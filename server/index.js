const path = require('path');
const express = require('express');
const app = express();

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));


//app.use('/static', express.static(join(__dirname, '..', 'src')));

const fs = require('fs');

// fs.readdir('../', { withFileTypes: true }, (error, files) => {
//     if (error) throw error;
//     const directoriesInDIrectory = files
//         .filter((item) => item.isDirectory() && item.name.toLowerCase() === 'napbiotec')
//         .map((item) => item.name);

//     console.log(directoriesInDIrectory);
// });


// fs.readdir('../napbiotec/', (error, files) => {
//     if (error) throw error;
//     console.log(files);
// });


// const arrayOfFiles = fs.readdirSync('../napbiotec/');
// console.log(arrayOfFiles);


const data = [];
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

                // if (!data.includes(product)) {
                //     data.push({ product: product[0], category: category[0], type: type[0], lotno: lotNo[0], file: path.join(__dirname, '../', dirPath, "/", file) });
                // }

                data.push({ product: product[0], category: category[0], type: type[0], lot_no: lotNo[0], file: path.join(__dirname, '../', dirPath, "/", file) });

                // console.log(lotNo);
                //console.log(__dirname + " / " + dirPath);
                //arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
                // arrayOfFiles.push(path.join(__dirname, '../..', dirPath, "/", file));
                arrayOfFiles.push(path.join(__dirname, '../', dirPath, "/", file));
                //arrayOfFiles.push(path.join(dirPath, "/", file))
            }
        }
    })

    return arrayOfFiles
}

const allFiles = getAllFiles('../napbiotec');
console.log(allFiles);

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

// app.get('/v1/api/search/:product/:lotNo', (req, res) => {

//     let product = req.params.product;
//     let lotNo = req.params.lotNo;

//     var result = data.filter(item => {
//         return item.product === product && item.lot_no === lotNo;
//     });

//     res.setHeader('Content-Type', 'application/json');
//     res.writeHead(200);
//     res.end(JSON.stringify(result, null, 3));
// })

app.post('/v1/api/download/', function (req, res) {
    res.download(req.body.filePath);
})

app.post('/v1/api/search/', (req, res) => {

    console.log(req.body);

    if (req.body.product && req.body.lotNo) {

        let result = data.filter(item => {
            return item.product === req.body.product && item.lot_no === req.body.lotNo;
        });

        console.log(result.length);
        // if (result.length > 0) {

        //     console.log(result);

        //     // let fileName = 'napbiotec/coa/FG/Feed/Hydro-Herb-DCP/Hydro Herb DCP lot.2208001.pdf';
        //     // let filePath = path.join(__dirname, '../..', "/", fileName);
        //     // console.log(filePath);

        //     // res.download(result.file);
        //     res.json({ filePath: result.file, lotNo: 10 });
        // } else {
        //     res.json({ filePath: '', message: `Not Found COA for ${req.body.product}, ${req.body.lotNo}` });
        // }

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(result, null, 3));


        // `Hi, I am ${name} and I am ${age} years old. I am from ${country}.`
        // `napbiotec/coa/FG/Feed/Hydro-Herb-DCP/Hydro Herb DCP lot.${req.body.lotNo}.pdf`

        // let fileName = req.params.fileName;
        // console.log(fileName);


        // fs.readFile(filePath, function (err, data) {
        //     console.log(data);
        //     res.contentType('application/pdf');
        //     res.send(data);
        // });

        // res.setHeader('Content-Length', file.length);
        // res.write(file, 'binary');
        // res.end();

        // Set disposition and send it.

    }


    // res.setHeader('Content-Type', 'application/json');
    // res.writeHead(200);
    // res.end(JSON.stringify(null, null, 3));
})

app.get('/v1/api/products', (req, res) => {

    let result = [];
    for (i = 0; i < data.length; i++) {
        // result.push({ value: data[i].product, label: data[i].product });
        if (!result.includes(data[i].product)) {
            result.push(data[i].product);
        }
    }

    let result2 = [];
    for (i = 0; i < result.length; i++) {
        result2.push({ value: result[i], label: result[i] });
    }

    // let result2 = [];
    // result2 = result.filter(item => {
    //     const isDuplicate = result2.includes(item.value);
    //     if (!isDuplicate) return true;
    //     return false;
    // });

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(result2, null, 3));
})

app.get('/v1/api/lotnos', (req, res) => {

    let result = [];
    for (i = 0; i < data.length; i++) {
        result.push({ value: data[i].lot_no, label: data[i].lot_no });
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
});

// const path = require('path');
// const express = require('express');
// const app = express();

// app.get("/download", (req, res) => {
//     res.download(path.join(__dirname, "comment.json"));
// });

// app.get("/sendfile", (req, res) => {
//     res.set("Content-Disposition", 'attachment; filename="comment.json"');
//     res.sendFile(path.join(__dirname, "comment.json"));
// });

// app.listen(80);
