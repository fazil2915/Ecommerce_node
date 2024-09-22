import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const prisma=new PrismaClient()


export const register = async (req, res) => {
    try {
      const { email, name, password, role } = req.body;
  
      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(404).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user as either a seller or buyer
      let newUser;
      if (role === 'SELLER') {
        newUser = await prisma.seller.create({
          data: {
            user: {
              create: {
                email,
                name,
                password: hashedPassword,
                role: 'SELLER',
              },
            },
          },
          include: {
            user: true, // Include the user details in the response
          },
        });
      } else if (role === 'BUYER') {
        newUser = await prisma.buyer.create({
          data: {
            user: {
              create: {
                email,
                name,
                password: hashedPassword,
                role: 'BUYER',
              },
            },
          },
          include: {
            user: true, // Include the user details in the response
          },
        });
      } else {
        return res.status(400).json({ message: 'Invalid role provided' });
      }
  
      // Send the response with the newly created user
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ err: error.message });
    }
  };

export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await prisma.user.findFirst({
            where:{email:email},
            include:{
                seller:true,
                buyer:true
            },
        })
        if(!user) return res.status(404).json({message:'User doesnt exist!'});
        
        //compare the password with user password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid credential"});
       
      
        const token=jwt.sign({id:user.userId},process.env.JWT_SECRET,{
            expiresIn:'1d'
        });
        delete user.password;
        res.status(200).json({token,user})


    } catch (error) {
        res.status(500).json({err:error.message})
    }
}

