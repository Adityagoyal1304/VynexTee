// src/data/products.js
// Mock product data — swap VITE_API_BASE_URL in .env to use a real API

export const products = [
  // ─── T-SHIRTS ─────────────────────────────────────────────────
  {
    id: "p001",
    name: "Classic White Oversized Tee",
    price: 699,
    category: "tshirt",
    description:
      "Our signature oversized tee is crafted from 100% pre-shrunk ring-spun cotton. The boxy, relaxed fit drapes beautifully and gets softer with every wash. A wardrobe essential.",
    color: "#F5F5F5",
    badge: "Bestseller",
    images: ["/products/tshirt-white.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p002",
    name: "Midnight Drop-Shoulder Tee",
    price: 749,
    category: "tshirt",
    description:
      "A premium drop-shoulder cut in heavyweight 220 GSM cotton. The deep midnight colorway pairs effortlessly with everything in your rotation.",
    color: "#1A1A2E",
    badge: "New",
    images: ["/products/tshirt-midnight.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p003",
    name: "Sage Washed Vintage Tee",
    price: 799,
    category: "tshirt",
    description:
      "Stone-washed for an authentic lived-in feel. This sage green tee features a relaxed crew neck and slightly cropped length — perfect for layering.",
    color: "#8B9E7B",
    badge: null,
    images: ["/products/tshirt-sage.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "p004",
    name: "Bone Striped Polo Tee",
    price: 849,
    category: "tshirt",
    description:
      "A modern take on the classic polo. Crafted from pique cotton with contrast tipping on the collar and cuffs. Elevated enough for smart-casual, relaxed enough for weekends.",
    color: "#F7F0E6",
    badge: "New",
    images: ["/products/tshirt-polo.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p005",
    name: "Graphite Slub Cotton Tee",
    price: 649,
    category: "tshirt",
    description:
      "Slub-textured cotton gives this lightweight tee a natural, breathable feel. The subtle texture catches light in all the right ways.",
    color: "#4A4A4A",
    badge: null,
    images: ["/products/tshirt-graphite.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p006",
    name: "Icy Blue Longline Tee",
    price: 899,
    category: "tshirt",
    description:
      "A longline silhouette with curved hem and ribbed side panels. The icy blue hue is a head-turner — inspired by our logo's signature steel-blue palette.",
    color: "#93C5FD",
    badge: "Bestseller",
    images: ["/products/tshirt-blue.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "p007",
    name: "Terracotta Split-Hem Tee",
    price: 749,
    category: "tshirt",
    description:
      "Raw split hem at the sides for an editorial edge. Relaxed fit in terracotta — a warm, earthy tone that complements every skin tone.",
    color: "#C1694F",
    badge: null,
    images: ["/products/tshirt-terracotta.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },

  // ─── BAGS ─────────────────────────────────────────────────────
  {
    id: "p008",
    name: "Urban Canvas Tote",
    price: 1199,
    category: "bag",
    description:
      "Heavy-duty 12 oz canvas tote with reinforced handles and a zipper inner pocket. Fits a 15\" laptop. Perfect for commutes, market runs, or weekend escapes.",
    color: "#D4C5A9",
    badge: "Bestseller",
    images: ["/products/bag-canvas-tote.jpg"],
    sizes: ["One Size"],
  },
  {
    id: "p009",
    name: "Midnight Structured Sling",
    price: 1499,
    category: "bag",
    description:
      "A minimalist crossbody sling in deep navy faux-leather. Adjustable strap, two compartments, and a magnetic snap closure. Goes from desk to dinner effortlessly.",
    color: "#1A1A2E",
    badge: "New",
    images: ["/products/bag-sling-midnight.jpg"],
    sizes: ["One Size"],
  },
  {
    id: "p010",
    name: "Sage Woven Market Bag",
    price: 899,
    category: "bag",
    description:
      "Open-weave design in sage cotton rope. Stretches to fit your weekly shop or beach essentials. Lightweight, foldable, and eco-conscious.",
    color: "#8B9E7B",
    badge: null,
    images: ["/products/bag-woven-sage.jpg"],
    sizes: ["One Size"],
  },
  {
    id: "p011",
    name: "Steel Commuter Backpack",
    price: 2499,
    category: "bag",
    description:
      "A sleek, padded backpack with USB-C charging port, anti-theft back pocket, and laptop sleeve up to 16\". Built for the modern professional.",
    color: "#60A5FA",
    badge: "New",
    images: ["/products/bag-backpack-steel.jpg"],
    sizes: ["One Size"],
  },
  {
    id: "p012",
    name: "Bone Leather Belt Bag",
    price: 1799,
    category: "bag",
    description:
      "A sleek belt bag (fanny pack reimagined) in genuine pebble leather. Three inner pockets keep your essentials organised. Wear it around the waist or across the chest.",
    color: "#F7F0E6",
    badge: "Bestseller",
    images: ["/products/bag-belt-bone.jpg"],
    sizes: ["One Size"],
  },
  {
    id: "p013",
    name: "Graphite Drawstring Gym Bag",
    price: 999,
    category: "bag",
    description:
      "Lightweight ripstop nylon drawstring bag with mesh side pockets for a water bottle. Perfect for the gym, yoga, or a spontaneous day trip.",
    color: "#4A4A4A",
    badge: null,
    images: ["/products/bag-drawstring-graphite.jpg"],
    sizes: ["One Size"],
  },
  {
    id: "p014",
    name: "Vynex Signature Tote",
    price: 1699,
    category: "bag",
    description:
      "Our flagship tote — heavyweight canvas with the Vynex monogram embossed in metallic thread. Wide base, inner zip pocket, magnetic closure. The ultimate carry-all.",
    color: "#0D0D1A",
    badge: "Bestseller",
    images: ["/products/bag-signature-tote.jpg"],
    sizes: ["One Size"],
  },
];

export default products;
