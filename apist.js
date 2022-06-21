const express = require('express')
const app = express()

app.use(express.json())


let db = []


app.post("/api/product", (req, res) => {
    try {
        db = [...db, req.body]
        return res.status(201).json({
            "message": "Product added successfully",
            "data": req.body
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
                d["product"] = req.body.product
                pr = d
            }
        }
        return res.status(200).json({
            "message": "Product update successfully.",
            "data": pr
        })
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/api/product/:id", (req, res) => {
    try {
        const index = db.findIndex((d)=> d.id == req.params.id)
        if (index) {
            db.splice(index, 1)
            return res.status(200).json({ message: "Product deleted successfully", data: db })
        }
        else {
            return res.status(400).json({ message: "Invalid Product" })
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.listen(4000, () => {
    console.log({
        "instance": true,
        "port": 4000
    })
})
