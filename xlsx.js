const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require("fs")
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sample", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connect with mongodb")
}).catch((err) => {
    console.log(err)
})

var XLSX = require("xlsx");

XLSX.utils.sheet_to_json()

const fileExtension = require('file-extension');
const { json } = require('express')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'API/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage }).single('file');

app.get('/', (req, res) => {
    res.sendFile("hello world");
});
const productSchema = new mongoose.Schema({
    Name: String,
    description: String,

}, { strict: false })

const Product = new mongoose.model("Product", productSchema)

app.post('/upload', upload, async (req, res) => {
    const product = await Product.create(req.body);

    let excel2json;
    console.log(req.file)
    const doc = XLSX.readFile(req.file.path);
    const json = XLSX.utils.sheet_to_json(doc.Sheets[doc.SheetNames[0]])
    await Product.insertMany(json)

    await unlinkAsync(req.file.path)
    res.send(json);

    console.log(req.json)
});
app.listen('3000', () => {
    console.log('Server running on port 3000');
});