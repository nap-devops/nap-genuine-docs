const path = require('path');
const express = require('express');
const app = express();

require('dotenv').config();
const org = process.env.ORG || 'napbiotec';

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));

const fs = require('fs');

let data = [];
const lotNoList = [];

const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            if (file && file.indexOf('pdf') !== -1) {

                let dirs = dirPath.split('/');
                let product = dirs.slice(-1);
                let type = dirs.slice(-2);
                let category = dirs.slice(-3);

                let lotNo = file.split('.').slice(-2);
                lotNoList.push({ lotNo: lotNo[0] });

                data.push({ product: product[0], category: category[0], type: type[0], lot_no: lotNo[0], file: dirPath + "/" + file });
                arrayOfFiles.push(path.join(__dirname, '../', dirPath, "/", file));
            }
        }
    })

    return arrayOfFiles
}

app.get('/v1/api/checkpath/', function (req, res) {
    console.log(`${__dirname}`);
    console.log(`${path.join(__dirname, '../..')}`)
    console.log(`${path.join(__dirname, '../../..')}`)
    console.log(`${path.join(__dirname, '../../../..')}`)
})

app.get('/api/download2/:fileName', function (req, res) {

    console.log(`${__dirname}`);
    console.log(`${path.join(__dirname, '../..')}`)

    let fileName = req.params.fileName;
    console.log(fileName);

    let filePath = path.join(__dirname, '../..', "/", fileName);
    console.log(filePath);
    fs.readFile(filePath, function (err, data) {
        console.log(data);
        res.contentType('application/pdf');
        res.send(data);
    });

})

app.post('/v1/api/download/', function (req, res) {

    // Prevent path traversal
    let safePath = path.normalize(req.body.filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    console.log(safePath);

    // Prevent NULL byte injection
    if (safePath.indexOf('\0') !== -1) {
        res.status(500).json({ message: 'Access denied' })
    }

    res.download(safePath);
})

app.post('/v1/api/search/', (req, res) => {

    console.log(req.body);

    if (req.body.product && req.body.lotNo) {

        let result = data.filter(item => {
            return item.product === req.body.product && item.lot_no === req.body.lotNo;
        });

        console.log(result.length);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(result, null, 3));

    }
})

app.get('/v1/api/refresh', (req, res) => {
    
    data = [];
    const allFiles = getAllFiles(`/data/${org}`); // remote
    //const allFiles = getAllFiles(path.join(__dirname, '../data')); // local

    let result = [];
    result = allFiles.map((dir) => {
        return dir.split('/')?.slice(-1)
    });

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(result, null, 3));
})

app.get('/v1/api/products', (req, res) => {
    let result = [];
    for (i = 0; i < data.length; i++) {
        if (!result.includes(data[i].product)) {
            result.push(data[i].product);
        }
    }

    let result2 = [];
    for (i = 0; i < result.length; i++) {
        result2.push({ value: result[i], label: result[i] });
    }

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(result2, null, 3));
})

app.get('/v1/api/lotnos', (req, res) => {
    let result = [];
    for (i = 0; i < data.length; i++) {
        result.push({ value: data[i].lot_no, label: data[i].lot_no, product: data[i].product, category: data[i].category, type: data[i].type });
    }
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(result, null, 3));
})

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(3030, () => {
    console.log('server start on port 3030');
    console.log("ENV org: " + org);
    //const allFiles = getAllFiles(path.join(__dirname, '../data')); // local
    //const allFiles = getAllFiles(`/data/${org}`);   // remote
    //console.log("List all COA");
    //console.log(allFiles);
});
