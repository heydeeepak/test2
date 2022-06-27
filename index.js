const express = require('express')
const fs = require('fs');
const app = express()
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage }).single("file");

app.use(express.json())

let db = require('./db.json')

app.get('/', (req, res) => {
    res.send('hello world');
});

app.post("/upload", (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            res.status(400).send("Something went wrong!");
            console.log("eror occured");
        }
        res.send(req.file);
    });
});

app.post("/api/product", (req, res,) => {
    try {

        console.log("=========REQUEST BODY=========", req.body)
        db = [...db, req.body]
        fs.writeFile('./db.json', JSON.stringify(db), (err) => {
            if (err) {
                return res.status(201).json({
                    "success": false,
                    "error": err.message
                })
            }
            return res.status(201).json({
                "success": true,
                "messsage": "Data has been saved successfully"
            })

        })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/api/product", (req, res) => {
    try {
        return res.status(200).json({
            "message": "All products",
            "data": db
        })

    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.put("/api/product/:id", (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error("Please enter id in req params");
        }

        let pr = {}
        for (let d of db) {
            if (d["id"] == req.params.id) {
                d["name"] = req.body.name
                pr = d
            }
        }

        fs.writeFile('./db.json', JSON.stringify(db), (err) => {
            if (err) {
                return res.status(201).json({
                    "success": false,
                    "error": err.message
                })
            }
            return res.status(201).json({
                "success": true,
                "messsage": "Data has been updated successfully"
            })

        })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
})
app.delete("/api/product/:id", (req, res) => {
    try {

        const index = db.findIndex((d) => d.id == req.params.id)
        if (index) {

            db.splice(index, 1)

            fs.writeFile('./db.json', JSON.stringify(db), (err) => {
                if (err) {
                    return res.status(201).json({
                        "success": false,
                        "error": err.message
                    })
                }
                return res.status(201).json({
                    "success": true,
                    "messsage": "Data has been deleted successfully"
                })
            })

            return res.status(200).json({ message: "Product deleted successfully", data: db })

        }

        else {
            return res.status(400).json({ message: "Invalid Product" })
        }
    }


    catch (error) {
        json
        return res.status(500).json({ error: error.message })
    }
})

app.listen(3000, () => {
    console.log({
        "instance": true,
        "port": 3000
    })
})
