
import path from 'path';
import ProductModel from '../models/product.model.js';


export default class ProductController{

    getProducts(req,res){
        let products = ProductModel.get();
        // console.log(products);
        res.render("products",{products:products,userEmail:req.session.userEmail});

        // return res.sendFile(path.join(path.resolve(),"src","views","products.html"));
    }

    getAddForm(req,res){
       return res.render("new-product",{errorMessage:null,userEmail:req.session.userEmail});
    }

    addNewProduct(req,res){
        //access data from form
        console.log(req.body);
        const {name,desc,price} = req.body;
        const imageUrl = 'images/' + req.file.filename;
        ProductModel.add(name,desc,price,imageUrl);
        var products = ProductModel.get();
        res.render('products',{products,userEmail:req.session.userEmail});
    }

    getUpdateProductView(req,res,next){
        //check if product exists then return view 
        //else return error
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if(productFound){
            res.render("update-product",{product: productFound,errorMessage: null,userEmail:req.session.userEmail});
        }
        else{
            res.status(401).send("Product not Found");
        }
    }

    postUpdateProduct(req,res){
        console.log(req.body);
        ProductModel.update(req.body);
        let products = ProductModel.get();
        return res.render('products',{products});
    }

    deleteProduct(req,res){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if(!productFound){
           return res.status(401).send("Product not Found");
        }
        ProductModel.delete(id);
        let products = ProductModel.get();
        return res.render('products',{products});   
    }
}