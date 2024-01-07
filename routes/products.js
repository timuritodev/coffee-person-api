const express = require("express");
const productModel = require("../models/product");

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await productModel.getProductById(productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/cart/add", async (req, res) => {
  const { userId, productId, product_price, product_weight } = req.body;
  const product = await productModel.getProductById(productId);
  try {
    // Вызываем метод модели корзины для добавления товара
    const result = await productModel.addToCart(
      userId,
      productId,
      product_price,
      product_weight
    );

    if (result.success) {
      // res.json({ product });
      res.json({
        id: product.id,
        title: product.title,
        // description: product.description,
        price: product_price,
        weight: product_weight,
        v_picture: product.v_picture,
        h_picture: product.h_picture,
        // acidity: product.low_weight,
        // density: product.low_weight,
        // big_description: product.low_weight,
        // low_price: product.low_weight,
        // low_weight: product.low_weight,
      });

      res.status(201);
    } else {
      res.status(400).json({ error: "Failed to add product to cart" });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/cart/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const result = await productModel.removeFromCart(userId, productId);

    if (result.success) {
      res.json({ productId });
    } else {
      res
        .status(400)
        .json({ error: result.error || "Failed to remove product from cart" });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/cart/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await productModel.deleteProductsByUserId(userId);

    if (result.success) {
      res.json({ message: "Products deleted successfully" });
    } else {
      res
        .status(400)
        .json({ error: result.error || "Failed to delete products" });
    }
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
