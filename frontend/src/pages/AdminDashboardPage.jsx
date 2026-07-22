// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Package, Plus, Trash2, CheckCircle, UploadCloud, ShoppingBag, X, ImagePlus, Pencil, Star } from "lucide-react";
import toast from "react-hot-toast";
import { getProducts, createProduct, deleteProduct, uploadImage, updateProduct } from "@/services/productService";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { formatPrice } from "@/utils/formatPrice";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "tshirt",
  images: [],
  stock: "",
  color: "",
  badge: "",
  sizes: "",
};

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("products"); // "products" or "orders"

  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Form state for creating a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef(null);

  // Edit modal state
  const [editProduct, setEditProduct] = useState(null); // null = closed, object = product being edited
  const [editForm, setEditForm] = useState(emptyForm);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadingCount, setEditUploadingCount] = useState(0);
  const editFileInputRef = useRef(null);

  const fetchData = async () => {
    if (activeTab === "products") {
      setLoadingProducts(true);
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    } else {
      setLoadingOrders(true);
      try {
        const data = await getAllOrders();
        setOrders(data || []);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ── Create handlers ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        color: form.color,
        badge: form.badge || null,
        sizes: form.sizes ? form.sizes.split(",").map(s => s.trim()).filter(Boolean) : [],
        images: form.images,
      });
      toast.success("Product created successfully");
      setShowAddForm(false);
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating product");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit handlers ────────────────────────────────────────────────────────
  const openEditModal = (p) => {
    setEditProduct(p);
    setEditForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      category: p.category || "tshirt",
      images: p.images || [],
      stock: p.stock ?? "",
      color: p.color || "",
      badge: p.badge || "",
      sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : (p.sizes || ""),
    });
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setEditForm(emptyForm);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      await updateProduct(editProduct._id, {
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        color: editForm.color,
        badge: editForm.badge || null,
        sizes: editForm.sizes ? editForm.sizes.split(",").map(s => s.trim()).filter(Boolean) : [],
        images: editForm.images,
      });
      toast.success("Product updated successfully");
      closeEditModal();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating product");
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── Delete handler ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // ── Order status handler ─────────────────────────────────────────────────
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // ── Image upload — create form ────────────────────────────────────────────
  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploadingCount((c) => c + files.length);
    setUploading(true);

    const results = await Promise.allSettled(files.map((file) => uploadImage(file)));

    const newUrls = [];
    let failed = 0;
    results.forEach((r) => {
      if (r.status === "fulfilled") newUrls.push(r.value.url);
      else failed++;
    });

    setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
    if (newUrls.length) toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded`);
    if (failed) toast.error(`${failed} image${failed > 1 ? "s" : ""} failed to upload`);

    setUploadingCount(0);
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Move image at `index` to position 0 (makes it the main/cover image)
  const setMainImage = (index) => {
    if (index === 0) return;
    setForm((prev) => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(index, 1);
      return { ...prev, images: [chosen, ...imgs] };
    });
    toast.success("Main image updated!");
  };

  // ── Image upload — edit form ──────────────────────────────────────────────
  const editUploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (editFileInputRef.current) editFileInputRef.current.value = "";

    setEditUploadingCount((c) => c + files.length);
    setEditUploading(true);

    const results = await Promise.allSettled(files.map((file) => uploadImage(file)));

    const newUrls = [];
    let failed = 0;
    results.forEach((r) => {
      if (r.status === "fulfilled") newUrls.push(r.value.url);
      else failed++;
    });

    setEditForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
    if (newUrls.length) toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded`);
    if (failed) toast.error(`${failed} image${failed > 1 ? "s" : ""} failed to upload`);

    setEditUploadingCount(0);
    setEditUploading(false);
  };

  const removeEditImage = (index) => {
    setEditForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const setEditMainImage = (index) => {
    if (index === 0) return;
    setEditForm((prev) => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(index, 1);
      return { ...prev, images: [chosen, ...imgs] };
    });
    toast.success("Main image updated!");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" };
      case "shipped": return { bg: "rgba(96,165,250,0.15)", text: "#60a5fa", border: "rgba(96,165,250,0.3)" };
      case "cancelled": return { bg: "rgba(248,113,113,0.15)", text: "#f87171", border: "rgba(248,113,113,0.3)" };
      default: return { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", border: "rgba(251,191,36,0.3)" };
    }
  };

  // ── Shared form fields renderer ───────────────────────────────────────────
  const renderProductFields = (formData, onChange, fileRef, onUpload, isUploading, uploadCount, images, onRemoveImage, onSetMain, isEdit = false) => (
    <>
      <div>
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Name</label>
        <input required name="name" value={formData.name} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Price (₹)</label>
        <input required type="number" name="price" value={formData.price} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Category</label>
        <select name="category" value={formData.category} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          <option value="tshirt">T-Shirt</option>
          <option value="bag">Bag</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Stock</label>
        <input required type="number" name="stock" value={formData.stock} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Color</label>
        <input type="text" name="color" placeholder="#FFFFFF or White" value={formData.color} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Badge (Optional)</label>
        <input type="text" name="badge" placeholder="e.g. New, Bestseller" value={formData.badge} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Sizes (Comma separated)</label>
        <input type="text" name="sizes" placeholder="S, M, L, XL" value={formData.sizes} onChange={onChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold tracking-wide mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
          Product Images
          <span className="ml-2 normal-case font-normal" style={{ color: "var(--text-muted)" }}>({images.length} uploaded — you can add multiple)</span>
        </label>

        <div
          className="relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition-colors hover:bg-white/5 cursor-pointer mb-3"
          style={{ borderColor: isUploading ? "var(--accent-deep)" : "var(--border-light)" }}
          onClick={() => !isUploading && fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" onChange={onUpload} disabled={isUploading} className="hidden" accept="image/*" multiple />
          {isUploading ? (
            <>
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-2" style={{ borderColor: "var(--accent-deep)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Uploading {uploadCount} image{uploadCount > 1 ? "s" : ""}…</p>
            </>
          ) : (
            <>
              <ImagePlus size={26} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Click to upload images</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>PNG, JPG, WEBP — up to 5 MB each — select multiple at once</p>
            </>
          )}
        </div>

        {images.length > 0 && (
          <>
            <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
              <Star size={9} className="inline mr-1" style={{ color: "#f59e0b" }} />
              Click the star on any image to set it as the main cover image.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200"
                  style={{
                    borderColor: idx === 0 ? "#f59e0b" : "var(--border-light)",
                    boxShadow: idx === 0 ? "0 0 0 1px rgba(245,158,11,0.4)" : "none",
                  }}
                >
                  <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Hover overlay with action buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => onSetMain(idx)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors"
                        style={{ backgroundColor: "rgba(245,158,11,0.9)", color: "#000" }}
                        title="Set as main image"
                      >
                        <Star size={10} fill="currentColor" /> Set Main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveImage(idx)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500 hover:bg-red-600 transition-colors text-white"
                      title="Remove image"
                    >
                      <X size={10} /> Remove
                    </button>
                  </div>

                  {/* Main badge on the primary image */}
                  {idx === 0 && (
                    <span
                      className="absolute bottom-1 left-1 flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "#f59e0b", color: "#000" }}
                    >
                      <Star size={8} fill="currentColor" /> Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Description</label>
        <textarea required name="description" value={formData.description} onChange={onChange} rows={3} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>
    </>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 animate-fadeIn" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Manage your store products and orders
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${activeTab === "products" ? "bg-white text-black" : "bg-transparent text-white border border-white/20"}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${activeTab === "orders" ? "bg-white text-black" : "bg-transparent text-white border border-white/20"}`}
            >
              Orders
            </button>
          </div>
        </div>

        {activeTab === "products" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: "var(--accent-deep)" }}
              >
                {showAddForm ? "Cancel" : <><Plus size={16} /> Add Product</>}
              </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <div
                className="rounded-2xl p-6 mb-8 animate-fadeIn"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  Create New Product
                </h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderProductFields(form, handleChange, fileInputRef, uploadFileHandler, uploading, uploadingCount, form.images, removeImage, setMainImage, false)}
                  <div className="md:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ backgroundColor: "var(--accent-deep)", opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? "Creating..." : "Save Product"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
              <div className="p-5 border-b" style={{ borderColor: "var(--border-light)" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>All Products</h2>
              </div>

              {loadingProducts ? (
                <div className="p-10 text-center" style={{ color: "var(--text-muted)" }}>Loading products...</div>
              ) : products.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <Package size={40} className="mb-3" style={{ color: "var(--border)" }} />
                  <p style={{ color: "var(--text-secondary)" }}>No products found.</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Click "Add Product" to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: "rgba(255,255,255,0.02)", color: "var(--text-muted)" }}>
                      <tr>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Product</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Price</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Category</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Stock</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: "var(--text-secondary)" }}>
                      {products.map((p) => (
                        <tr key={p._id || p.id} className="border-t transition-colors hover:bg-white/5" style={{ borderColor: "var(--border-light)" }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.images?.[0] || ""} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-medium">{formatPrice(p.price)}</td>
                          <td className="px-5 py-4 capitalize">{p.category}</td>
                          <td className="px-5 py-4">{p.stock}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-2 rounded-lg transition-colors hover:bg-blue-500/10 text-blue-400"
                                title="Edit Product"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(p._id)}
                                className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-500"
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
            <div className="p-5 border-b" style={{ borderColor: "var(--border-light)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>All Orders</h2>
            </div>

            {loadingOrders ? (
              <div className="p-10 text-center" style={{ color: "var(--text-muted)" }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center">
                <ShoppingBag size={40} className="mb-3" style={{ color: "var(--border)" }} />
                <p style={{ color: "var(--text-secondary)" }}>No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead style={{ backgroundColor: "rgba(255,255,255,0.02)", color: "var(--text-muted)" }}>
                    <tr>
                      <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Order ID</th>
                      <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Date</th>
                      <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Customer</th>
                      <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Total</th>
                      <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
                      <th className="px-5 py-3 font-semibold uppercase tracking-wider text-xs text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-secondary)" }}>
                    {orders.map((o) => {
                      const statusStyles = getStatusColor(o.status);
                      return (
                        <tr key={o._id} className="border-t transition-colors hover:bg-white/5" style={{ borderColor: "var(--border-light)" }}>
                          <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>
                            #{o._id.substring(o._id.length - 8)}
                          </td>
                          <td className="px-5 py-4">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            {o.user?.name}
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{o.user?.email}</div>
                          </td>
                          <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>
                            {formatPrice(o.totalAmount)}
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-md" style={{ backgroundColor: statusStyles.bg, color: statusStyles.text, border: `1px solid ${statusStyles.border}` }}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                              className="px-3 py-1.5 text-xs rounded-lg cursor-pointer outline-none"
                              style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Edit Product Modal ─────────────────────────────────────────────── */}
      {editProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-fadeIn"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Product</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Update the details for <span style={{ color: "var(--text-secondary)" }}>{editProduct.name}</span></p>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderProductFields(
                editForm,
                handleEditChange,
                editFileInputRef,
                editUploadFileHandler,
                editUploading,
                editUploadingCount,
                editForm.images,
                removeEditImage,
                setEditMainImage,
                true
              )}
              <div className="md:col-span-2 mt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: "var(--accent-deep)", opacity: editSubmitting ? 0.7 : 1 }}
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
