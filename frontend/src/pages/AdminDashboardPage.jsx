// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Package, Plus, Trash2, Edit, CheckCircle, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { getProducts, createProduct, deleteProduct, uploadImage } from "@/services/productService";

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for creating a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "tshirt",
    image: "",
    stock: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        images: form.image ? [form.image] : [], // Send as array for the backend schema
      });
      toast.success("Product created successfully");
      setShowAddForm(false);
      setForm({ name: "", description: "", price: "", category: "tshirt", image: "", stock: "" });
      fetchProducts();
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
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
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

  return (
    <div
      className="min-h-screen pt-24 pb-20 animate-fadeIn"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
            >
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Manage your store products and inventory
            </p>
          </div>
          
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
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
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
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div className="p-5 border-b" style={{ borderColor: "var(--border-light)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>All Products</h2>
          </div>

          {loading ? (
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

      </div>
    </div>
  );
};

export default AdminDashboardPage;
