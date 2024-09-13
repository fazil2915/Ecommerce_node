import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//get products
export const getProducts = async (req, res) => {
    try {
        // Fetch all products
        const products = await prisma.product.findMany({
            include: {
                seller: true, // Optionally include the seller's details
            },
        });


        if (!products.length) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
}

//  Add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, buyerId } = req.params;
        const { quantity } = req.body;


        // Find the buyer
        const buyer = await prisma.buyer.findUnique({
            where: { userId: buyerId }
        });

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Find the buyer's cart
        let cart = await prisma.cart.findUnique({
            where: { buyerId: buyer.id },
            include: { items: true } 
        });

        if (!cart) {
            // Create a new cart for the buyer if it does not exist
            cart = await prisma.cart.create({
                data: {
                    buyer: {
                        connect: { id: buyerId } 
                    }
                }
            });
        }

        // Check if the product already exists in the cart
        const existingCartProduct = await prisma.cartProduct.findFirst({
            where: {
                cartId: cart.id,
                productId: productId
            }
        });

        if (existingCartProduct) {
            // Update quantity if the product already exists in the cart
            const updatedCartProduct = await prisma.cartProduct.update({
                where: { id: existingCartProduct.id },
                data: { quantity: existingCartProduct.quantity + quantity }
            });
            return res.status(200).json({ message: 'Product quantity updated', cartProduct: updatedCartProduct });
        } else {
            // Create a new CartProduct if it doesn't exist
            const newCartProduct = await prisma.cartProduct.create({
                data: {
                    cart: {
                        connect: { id: cart.id } 
                    },
                    product: {
                        connect: { id: productId } 
                    },
                    quantity: quantity
                }
            });
            return res.status(201).json({ message: 'Product added to cart', cartProduct: newCartProduct });
        }
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};


//remove from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId,buyerId } = req.params;
        

        if (!buyerId) {
            return res.status(400).json({ message: 'Buyer ID is required' });
        }

        // Find the buyer's cart
        const cart = await prisma.cart.findUnique({
            where: { buyerId: buyerId },
            include: { items: true } 
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the buyer' });
        }

        // Find the CartProduct entry for the given productId
        const cartProduct = await prisma.cartProduct.findFirst({
            where: {
                cartId: cart.id,
                productId: productId
            }
        });

        if (!cartProduct) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        await prisma.cartProduct.delete({
            where: { id: cartProduct.id }
        });

        return res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//search for products by name & category
export const searchProduct=async(req,res)=>{
    try {
        const {
            name,
            category
        }=req.body;
        // Build the search query
        const searchQuery = {
            where: {},
        };

        // Add conditions to the query if parameters are provided
        if (name) {
            searchQuery.where.name = {
                contains: name, // Use 'contains' for partial matching
                mode: 'insensitive', // Case-insensitive search
            };
        }
        if (category) {
            searchQuery.where.category = category;
        }

        // Fetch the products based on the search criteria
        const products = await prisma.product.findMany(searchQuery);

        // Return the results
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}