// Import dependencies
import dotenv from "dotenv";
import multer from 'multer';
import express from "express";
import path from "path";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import Product from "./models/product.model.js"; // Import your Product model

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Connect to database
connectDB();

// Middlewares
app.use(express.json()); // To accept JSON data

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});

const upload = multer({ storage: storage });

// Consolidated product creation route with image upload
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validate input
    if (!name || !price || !req.file) {
      return res.status(400).json({
        message: "Please provide name, price, and an image."
      });
    }

    
    // Create a new product instance
    const newProduct = new Product({
      name,
      price,
      image: `/uploads/${req.file.filename}`, // Save image path
    });

    // Save the product in the database
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/uploads", express.static("uploads")); // To serve uploaded images

// Use external product routes (optional, if you have a dedicated routes file)
app.use("/api/products", productRoutes);

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Fallback route for frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
