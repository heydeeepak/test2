const express = require('express')
const fs = require('fs');
const app = express()
const busboy = require('busboy');

app.use(express.json())

let db = require('./db.json')

app.post("/upload", (req, res) => {
    try {
        const bb = new busboy({ headers: req.headers});
        bb.on('file', (name, file, info) => {
            const saveTo = path.join(os.tmpdir(), `busboy-upload-${Date.now()}`);
            file.pipe(fs.createWriteStream(saveTo));
        });
        bb.on('close', () => {
            res.status(200).send({ 'Connection': 'close' });
            res.end(`That's all folks!`);
        });
        req.pipe(bb);
        return;

    } catch (error) {
        console.error(error);
    }
})
app.listen(3000, () => {
  console.log({
    "instance": true,
    "port": 3000
  })
})
