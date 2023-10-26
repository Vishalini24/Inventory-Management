
import express from 'express';
import ProductController from './src/controllers/product.controller.js';
import UserController from './src/controllers/user.controller.js';
import path from 'path';
import ejsLayouts from "express-ejs-layouts";
import validationMiddleware from './src/middlewares/validation.middleware.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';
import session from 'express-session';
import { auth } from  './src/middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import { setLastVisit } from './src/middlewares/lastVisit.middleware.js';


const server = express();

server.use(express.static('public'));
server.use(cookieParser());

server.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false},
}));

//use ejs-layouts
server.use(ejsLayouts);
//parse form data
server.use(express.json());
server.use(express.urlencoded({extended:true}));

//set up view engine settings
server.set("view engine","ejs");
server.set("views",path.join(path.resolve(),"src","views"));


//create an instance of ProductController
const productController = new ProductController();
const usersController = new UserController();

server.get("/register",usersController.getRegister);
server.get("/login",usersController.getLogin);
server.post("/register",usersController.postRegister);
server.post("/login",usersController.postLogin);

server.get("/logout",usersController.logout);

server.get("/",setLastVisit,auth, productController.getProducts);
server.get("/new",auth,productController.getAddForm);

server.get("/update-product/:id",auth,productController.getUpdateProductView);
server.post("/update-product",auth,productController.postUpdateProduct);

server.post("/",auth,uploadFile.single('imageUrl'),validationMiddleware,productController.addNewProduct);
server.use(express.static('src/views'));

server.post("/delete-product/:id",auth,productController.deleteProduct);

server.listen(5000,()=>{
    console.log("Server is listening on 5000");
});