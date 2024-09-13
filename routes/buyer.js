import express from "express"
import { 
    getProducts,
    addToCart,
    removeFromCart,
    searchProduct 
} from "../controllers/buyer.js";
import { verifyToken } from "../middleware/auth.js";
const router=express.Router();



router.get('/get-Products',getProducts)
router.post('/add-To-Cart/:productId/:buyerId',verifyToken,addToCart)
router.delete('/remove-Cart/:productId/:buyerId',verifyToken,removeFromCart)
router.get('/search-Products',verifyToken,searchProduct)
export default router;