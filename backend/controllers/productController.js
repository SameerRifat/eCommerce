const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// create product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next)=>{
    // https://console.cloudinary.com/console/c-2f6c744ac4244728afca07aa7217e6/media_library/folders/home
    let images = [];
    if(typeof req.body.images === 'string'){
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }
    const imagesLink = [];
    for(let i = 0; i<images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        })
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    if(req.body.colors){
        let colors = [];
        if(typeof req.body.colors === 'string'){
            colors.push(req.body.colors);
        }else{
            colors = req.body.colors;
        }
        const colorsLink = [];
        for(let i = 0; i<colors.length; i++){
            const result = await cloudinary.v2.uploader.upload(colors[i], {
                folder: "colors",
            })
            colorsLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.colors = colorsLink;
    }
    if(req.body.sizes){
        const sizes = JSON.parse(req.body.sizes)
        req.body.sizes = sizes
    }
    req.body.images = imagesLink;
    
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    // console.log(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// get all products
exports.getAllCategories = catchAsyncErrors(async (req, res, next)=>{
    const categories = await Product.distinct('category')
    res.status(200).json({
        success: true,
        categories
    });
})
exports.getAllProducts = catchAsyncErrors(async (req, res, next)=>{
    const resultPerPage = 8;
    // console.log(req.query);
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
    let products = await apiFeature.query;
    const filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();
    
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    });
})
// get all products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next)=>{
    const products = await Product.find();
    if(!products){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        products
    });
})

// update product
exports.updateProduct = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    if(req.body.images !== undefined){
        for(let i = 0; i<product.images.length; i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        let images = [];
        if(typeof req.body.images === 'string'){
            images.push(req.body.images);
        }else{
            images = req.body.images;
        }
        const imagesLink = [];
        for(let i = 0; i<images.length; i++){
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            })
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLink;
    }else{
        req.body.images = product.images
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

// delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    
    for(let i = 0; i<product.images.length; i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
})
// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        product,
    })
})
// create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next)=>{
    const {rating , comment , productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = Number(rating)
                rev.comment = comment
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg=0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = avg/product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true
    })
})
// get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
// delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
    let avg=0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })
    const ratings = avg/reviews.length;
    const numOfReviews = reviews.length;
    const result = await Product.findByIdAndUpdate(req.query.productId, {reviews, ratings, numOfReviews}, {new: true, runValidators: true, useFindAndModify: false})
    res.status(200).json({
        success: true,
    })
})