// ethod	Endpoint	Description	Access
// POST	/api/products	Create new product	Admin/Seller only
// GET	/api/products	Get all products (with filters)	Public
// GET	/api/products/featured	Get featured products	Public
// GET	/api/products/search	Search products	Public
// GET	/api/products/:id	Get product by ID	Public
// GET	/api/products/slug/:slug	Get product by slug	Public
// GET	/api/products/:id/related	Get related products	Public
// PUT	/api/products/:id	Update product	Admin/Seller only
// DELETE	/api/products/:id	Delete product	Admin/Seller only
// PUT	/api/products/:id/stock	Update inventory	Admin/Seller only
// POST	/api/products/bulk-delete	Delete multiple products	Admin only
// PUT	/api/products/bulk-status	Bulk update status	Admin only


const express = require("express")

const productRouter = express.Router()

productRouter.post("/",createProduct);
// productRouter.get("/",getAllProducts);
// productRouter.get("/featured",getFeaturedProducts);
// productRouter.get("/search",searchProduct);
// productRouter.get("/:id",getProductById)
// productRouter.get("/slug/:slug",getProductBySlugId);
// productRouter.get("/:id/related",getRelatedProducts);
// productRouter.put("/:id",updateProductById);
// productRouter.delete("/:id",deleteProductById);
// productRouter.put("/:id/stock",updateInventory);



module.exports = productRouter
