import express from "express"
import { 
    addProducts,
    updateProduct,
    deleteProduct } from "../controllers/seller.js";
import { verifyToken } from "../middleware/auth.js";
const router=express.Router()

router.post('/:id/add-Product',verifyToken,addProducts)
router.patch('/:id/update-Product',verifyToken,updateProduct)
router.delete('/:id/delete-Product',verifyToken,deleteProduct)


export default router;