// `productController.js` → Logic for product routes.
import Product from "../models/Product.js";
import mongoose from 'mongoose'; 

export const getProducts = async (req, res) => {
  try {
    const getAllProduct = await Product.find();
    return res.status(200).json({ allProducts: getAllProduct });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findOne({_id:id});

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    return res.status(200).json({ product: product });
  } catch (error) {
    res.status(504).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
 try {
         const {title, price, description} = req.body
 
         if(!title || !price || !description){
            return res.status(400).json({message:'all fields are required'})
         }        
         const newProduct = new Product({
             title,
             price,
             description
         })
         await newProduct.save() 
         return res.status(201).json({message:"created new product"})
     } catch (error) {
         res.status(500).json({message:'internal server error',error:error.message})
     }
};

export const updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const {title, price, description} = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, {title, price, description}, {new:true, runValidators:true}) // Returns the modified document and runs schema checks

    if(!updatedProduct){
      return res.status(404).json({message:'Product not found!'})
    }

    return res.status(200).json({message:"item changed!", data: updatedProduct})

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {

    const {id} = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id)

    if(!deleteProduct){ //it will check for product, if didn't exist return 404!
      return res.status(404).json({message:'product not found'})
    }

    return res.status(200).json({message:"item deleted!", data: deleteProduct})
    
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
