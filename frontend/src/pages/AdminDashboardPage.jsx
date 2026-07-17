// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Package, Plus, Trash2, CheckCircle, UploadCloud, ShoppingBag, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { getProducts, createProduct, deleteProduct, uploadImage } from "@/services/productService";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { formatPrice } from "@/utils/formatPrice";

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
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "tshirt",
    image: "",
    stock: "",
    color: "",
    badge: "",
    sizes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        images: form.image ? [form.image] : [],
      });
      toast.success("Product created successfully");
      setShowAddForm(false);
      setForm({ name: "", description: "", price: "", category: "tshirt", image: "", stock: "", color: "", badge: "", sizes: "" });
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating product");
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImage(file);
      setForm({ ...form, image: data.url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" };
      case "shipped": return { bg: "rgba(96,165,250,0.15)", text: "#60a5fa", border: "rgba(96,165,250,0.3)" };
      case "cancelled": return { bg: "rgba(248,113,113,0.15)", text: "#f87171", border: "rgba(248,113,113,0.3)" };
      default: return { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", border: "rgba(251,191,36,0.3)" };
    }
  };

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
                  
                  <div>
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Name</label>
                    <input required name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Price</label>
                    <input required type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                      <option value="tshirt">T-Shirt</option>
                      <option value="bag">Bag</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Stock</label>
                    <input required type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Color</label>
                    <input type="text" name="color" placeholder="#FFFFFF or White" value={form.color} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Badge (Optional)</label>
                    <input type="text" name="badge" placeholder="e.g. New, Bestseller" value={form.badge} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Sizes (Comma separated)</label>
                    <input type="text" name="sizes" placeholder="S, M, L, XL" value={form.sizes} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Product Image</label>
                    
                    <div className="flex items-center gap-4">
                      {/* File Input */}
                      <div className="flex-1 relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors hover:bg-white/5" style={{ borderColor: "var(--border-light)" }}>
                        <input
                          type="file"
                          onChange={uploadFileHandler}
                          disabled={uploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                        <UploadCloud size={24} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
                        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                          {uploading ? "Uploading..." : "Click to upload an image"}
                        </p>
                      </div>

                      {/* Image Preview */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border flex items-center justify-center bg-black/20" style={{ borderColor: "var(--border-light)" }}>
                        {form.image ? (
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Preview</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "var(--text-secondary)" }}>Description</label>
                    <textarea required name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 text-sm rounded-lg" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>

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
                          <td className="px-5 py-4 font-medium">${p.price}</td>
                          <td className="px-5 py-4 capitalize">{p.category}</td>
                          <td className="px-5 py-4">{p.stock}</td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-500"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
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
    </div>
  );
};

export default AdminDashboardPage;
