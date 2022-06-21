const express = require('express')
const app = express()

app.use(express.json())

const CSVToJSON = require('csvtojson');

app.post("/api/product", (req, res) => {
    db = [...db, req.body]
CSVToJSON().fromFile('users.csv')
    .then(users => {

        console.log(users);
    }).catch(err => {
    
        console.log(err);
    });
})
app.listen(3000, () => {
    console.log({
        "instance": true,
        "port": 3000
    })
})