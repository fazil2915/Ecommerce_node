import express from "express"
import { 
    getProducts,
    addToCart,
    removeFromCart 
} from "../controllers/buyer.js";
import { verifyToken } from "../middleware/auth.js";
const router=express.Router();



router.get('/get-Products',verifyToken,getProducts)
router.post('/add-To-Cart/:productId/:buyerId',verifyToken,addToCart)
router.delete('/remove-Cart/:productId/:buyerId',verifyToken,removeFromCart)
export default router;