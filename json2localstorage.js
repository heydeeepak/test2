const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require("fs")

var XLSX = require("xlsx");

XLSX.utils.sheet_to_json()

const fileExtension = require('file-extension');
const { json } = require('express')

app.use(bodyParser.json());

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'API/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage }).single('file');

app.get('/', (req, res) => {
    res.sendFile("hello world");
});

app.post('/upload', upload, async (req, res) => {

    let excel2json;
    console.log(req.file)
    const doc = XLSX.readFile(req.file.path);
    const json = XLSX.utils.sheet_to_json(doc.Sheets[doc.SheetNames[0]])

    res.send(json);

    console.log(req.json)
    fs.writeFile('./db.xlsx', JSON.stringify(json), (err) => {
    })
});
app.listen('3000', () => {
    console.log('Server running on port 3000');
});