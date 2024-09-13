import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

export const addProducts=async (req,res)=>{
    try {
        const {id:sellerId}=req.params;

        // Check if the seller exists
        const seller = await prisma.seller.findUnique({
        where: { userId: sellerId },
      });
        const {
              name,
              category,
              description,
              price,
              discount,
        }=req.body

        //create a new product
       const newProduct=await prisma.product.create({
        data:{
            name,
            category,
            description,
            price,
            discount,
            seller: {
              connect: { userId: sellerId }, // Connect the product to the seller
            },
        }
       });
       
       return res.status(201).json({messsage:"Product created successfully",product:newProduct})
    } catch (error) {
        res.status(500).json({err:error.message})
    }
}


//update product

export const updateProduct = async (req, res) => {
    try {
        const { id: productId } = req.params; 
        
        const {
            name,
            category,
            description,
            price,
            discount,
        } = req.body; 

        // Check if the product exists 
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                sellerId: sellerId, 
            },
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found or does not belong to this seller' });
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                category,
                description,
                price,
                discount,
            },
        });

        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};


export const deleteProduct=async (req,res)=>{
try {
    const { id: productId } = req.params; 

     // Check if the product exists 
     const existingProduct = await prisma.product.findFirst({
        where: {
            id: productId,
            sellerId: sellerId, 
        },
    });
    if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found or does not belong to this seller' });
    }
    
    const deletedProduct=await prisma.product.delete({
        where:{id:productId}
    })
    return res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
} catch (error) {
    res.status(500).json({ err: error.message });
}
}