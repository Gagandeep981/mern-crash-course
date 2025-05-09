// Import dependencies
import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import path from "path";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import Product from "./models/product.model.js";

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());

// Serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only .jpg, .jpeg, .png files are allowed"));
  },
});

// Product creation route with image upload
app.post("/api/products/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    if (!name || !description || !price || !quantity || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, price, and an image.",
      });
    }

    // Construct public image path
    const imagePath = `/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      image: imagePath,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Use product routes
app.use("/api/products", productRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Fallback route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
