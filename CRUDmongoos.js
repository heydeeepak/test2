const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();

mongoose.connect("mongodb://localhost:27017/sample",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connect with mongodb")
}).catch((err)=>{
    console.log(err)
}) 

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
 
const productSchema = new mongoose.Schema({
    Name:String,
    description:String,
    Prise:Number,
})

const Product = new mongoose.model("Product",productSchema)

app.post("/api/v1/product/new",async(req,res)=>{

const product = await Product.create(req.body);

res.status(200).json({
    success:true,
    product

})
})

app.get("/api/v1/product/find",async(req,res)=>{

    const product = await Product.find(req.body);
    
    res.status(200).json({
        success:true,
        product
    
    })
    })

    app.put("/api/v1/product/update/:id",async(req,res)=>{

        let product = await Product.findById(req.params.id);
        
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,
            useFindAndModify:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            product
        
        })
        })

        app.delete("/api/v1/product/delete/:id",async(req,res)=>{

            let product = await Product.findById(req.params.id);
            await product.remove();

        res.status(200).json({
            success:true,
            product:"product deleted"
        
        })
        })

app.listen(4500,() => {
    console.log("server is running http://localhost:4500.")
})