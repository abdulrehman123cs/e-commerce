const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "products.json");
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

const ADMIN = {
  username: "admin",
  password: "riaz123",
};

const CATEGORIES = ["toys", "perfume", "other"];

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, "[]");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `${Date.now()}-${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype);
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getProducts() {
  return readJson(DATA_FILE, []);
}

function saveProducts(products) {
  writeJson(DATA_FILE, products);
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (token !== "riaz-admin-token") {
    return res.status(401).json({ message: "Admin login required" });
  }
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, store: "Riaz Toye Center" });
});

app.get("/api/categories", (_req, res) => {
  res.json([
    { id: "toys", name: "Toys", blurb: "Cars, blocks, dolls and fun" },
    { id: "perfume", name: "Perfume", blurb: "Fresh and long-lasting scents" },
    { id: "other", name: "Other", blurb: "Bags, gifts and daily items" },
  ]);
});

app.get("/api/products", (req, res) => {
  const category = String(req.query.category || "").toLowerCase();
  const q = String(req.query.q || "").toLowerCase().trim();
  let products = getProducts();
  if (CATEGORIES.includes(category)) {
    products = products.filter((p) => p.category === category);
  }
  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = getProducts().find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN.username && password === ADMIN.password) {
    return res.json({ token: "riaz-admin-token", name: "Store Admin" });
  }
  res.status(401).json({ message: "Invalid admin username or password" });
});

app.post("/api/products", requireAdmin, upload.single("image"), (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body || {};
    if (!name || !CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Name and valid category are required" });
    }
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ message: "Enter a valid amount" });
    }
    const product = {
      id: uuid(),
      name: String(name).trim(),
      category,
      price: amount,
      stock: Number(stock) || 0,
      description: String(description || "").trim(),
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };
    const products = getProducts();
    products.unshift(product);
    saveProducts(products);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not add product" });
  }
});

app.put("/api/products/:id", requireAdmin, upload.single("image"), (req, res) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  const current = products[index];
  const { name, category, price, stock, description } = req.body || {};
  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  products[index] = {
    ...current,
    name: name ? String(name).trim() : current.name,
    category: category || current.category,
    price: price !== undefined ? Number(price) : current.price,
    stock: stock !== undefined ? Number(stock) : current.stock,
    description: description !== undefined ? String(description).trim() : current.description,
    image: req.file ? `/uploads/${req.file.filename}` : current.image,
  };
  saveProducts(products);
  res.json(products[index]);
});

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const products = getProducts();
  const next = products.filter((p) => p.id !== req.params.id);
  if (next.length === products.length) {
    return res.status(404).json({ message: "Product not found" });
  }
  saveProducts(next);
  res.json({ ok: true });
});

app.post("/api/orders", (req, res) => {
  const { customer, items } = req.body || {};
  if (!customer?.name || !customer?.phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Name, phone and cart items are required" });
  }

  const catalog = getProducts();
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = catalog.find((p) => p.id === item.id);
    if (!product) continue;
    const qty = Math.max(1, Number(item.qty) || 1);
    if (product.stock < qty) {
      return res.status(400).json({ message: `${product.name} does not have enough stock` });
    }
    product.stock -= qty;
    const line = qty * product.price;
    total += line;
    orderItems.push({
      id: product.id,
      name: product.name,
      qty,
      price: product.price,
    });
  }

  if (!orderItems.length) {
    return res.status(400).json({ message: "No valid products in cart" });
  }

  saveProducts(catalog);
  const orders = readJson(ORDERS_FILE, []);
  const order = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    customer: {
      name: String(customer.name).trim(),
      phone: String(customer.phone).trim(),
      address: String(customer.address || "").trim(),
    },
    items: orderItems,
    total,
    status: "placed",
  };
  orders.unshift(order);
  writeJson(ORDERS_FILE, orders);
  res.status(201).json(order);
});

app.get("/api/orders", requireAdmin, (_req, res) => {
  res.json(readJson(ORDERS_FILE, []));
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || "Request failed" });
});

app.listen(PORT, () => {
  console.log(`Riaz Toye Center API running on http://localhost:${PORT}`);
});
