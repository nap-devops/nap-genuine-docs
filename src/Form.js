import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Select from "react-select";

const productsData = [
    {
        name: "",
        types: []
    },
    {
        name: "FG",
        types: ["", "Extracts", "Feed"]
    }
];

const typesData = [
    {
        name: "Extracts",
        cats: ["", "Black-Galingale", "Black-Ginger", "Butterfly-Pea", "Coffee", "Ginger", "Happy-Yellow-Karee", "Kratom", "Marigold", "Monk-Fruit"]
    },
    {
        name: "Feed",
        cats: ["", "Astro-Nano", "Hydro-Herb-DCL", "Hydro-Herb-DCP"]
    }
];

const catsData = [
    {
        name: "Black-Galingale",
        docs: ["Black galingale Extracts lot.2206001.pdf", "Black galingale Extracts lot.2206006.pdf"]
    },
    {
        name: "Black-Ginger",
        docs: ["Black ginger extract lot.A2211002.pdf"]
    },
    {
        name: "Butterfly-Pea",
        docs: ["Butterfly Pea Extract lot.A2211001.pdf"]
    },
    {
        name: "Coffee",
        docs: ["Coffee Extract A2302002.pdf"]
    },
    {
        name: "Ginger",
        docs: ["Ginger Extract lot.A2212002.pdf"]
    },
    {
        name: "Happy-Yellow-Karee",
        docs: ["Happy yellow keree lot.A2301001.pdf"]
    },
    {
        name: "Kratom",
        docs: ["Kratom extract lot.A2210004.pdf", "Kratom extract lot.L6410004.pdf", "Kratom extract lot.L6410008.pdf", "Mitragyna speciosa Extract lot.2203002.pdf"]
    },
    {
        name: "Marigold",
        docs: ["Marigold Extract A2302001.pdf", "Marigold Extract A2302003.pdf"]
    },
    {
        name: "Monk-Fruit",
        docs: ["Monk Fruit Extract lot.A2212001.pdf", "Monk Fruit Extract lot.A2301002.pdf"]
    },
    {
        name: "Astro-Nano",
        docs: ["Asta Nano lot.2207002.pdf"]
    },
    {
        name: "Hydro-Herb-DCL",
        docs: ["Hydro Herb DCL lot.2207001.pdf"]
    },
    {
        name: "Hydro-Herb-DCP",
        docs: ["Hydro Herb DCP lot.2208001.pdf"]
    }
];

// const productList = [
//     { value: "Black-Galingale", label: "Black-Galingale" },
//     { value: "Black-Ginger", label: "Black-Ginger" },
//     { value: "Butterfly-Pea", label: "Butterfly-Pea" },
//     { value: "Coffee", label: "Coffee" },
// ];
// const productList = [];

// const lotNoList = [
//     { value: "2206001", label: "2206001" },
//     { value: "2206006", label: "2206006" },
//     { value: "A2211002", label: "A2211002" },
//     { value: "A2211001", label: "A2211001" },
// ];

const customStyles = {
    control: (base, state) => ({
        ...base,
        marginBottom: 10
    })
};


// const customStyles = {
//     control: (base, state) => ({
//         ...base,
//         background: "#023950",
//         marginBottom: 10,
//         // Overwrittes the different states of border
//         borderColor: state.isFocused ? "yellow" : "green",
//         // Removes weird border around container
//         boxShadow: state.isFocused ? null : null,
//         "&:hover": {
//             // Overwrittes the different states of border
//             borderColor: state.isFocused ? "red" : "blue"
//         }
//     })
// };


function Form() {

    const [{ product, type, cat, doc }, setData] = useState({
        product: "",
        type: "",
        cat: "",
        doc: ""
    });

    const [productList, setProductList] = useState([]);
    const [lotNoList, setLotNoList] = useState([]);

    useEffect(() => {
        fetch("api/products")
            .then((res) => res.json())
            .then((data) => setProductList(data));
    }, [])

    useEffect(() => {
        fetch("api/lot_nos")
            .then((res) => res.json())
            .then((data) => setLotNoList(data));
    }, [])

    const products = productsData.map((product) => (
        <option key={product.name} value={product.name}>
            {product.name}
        </option>
    ));

    const types = productsData.find(item => item.name === product)?.types.map((type) => (
        <option key={type} value={type}>
            {type}
        </option>
    ));

    const cats = typesData.find(item => item.name === type)?.cats.map((cat) => (
        <option key={cat} value={cat}>
            {cat}
        </option>
    ));

    const docs = catsData.find(item => item.name === cat)?.docs.map((doc) => (
        <option key={doc} value={doc}>
            {doc}
        </option>
    ));

    const downloadFile = async (id, path, mimetype) => {
        console.log(product);
        console.log(type);
        console.log(cat);
        console.log(doc);
        // try {
        //     const result = await axios.get(`${API_URL}/download/${id}`, {
        //     responseType: 'blob'
        //     });
        //     const split = path.split('/');
        //     const filename = split[split.length - 1];
        //     setErrorMsg('');
        //     return download(result.data, filename, mimetype);
        // } catch (error) {
        //     if (error.response && error.response.status === 400) {
        //     setErrorMsg('Error while downloading file. Try again later');
        //     }
        // }
    }

    function handleProductChange(event) {
        setData(data => ({ product: event.target.value, type: '', cat: '' }));
    }

    function handleTypeChange(event) {
        setData(data => ({ ...data, cat: '', doc: '', type: event.target.value }));
    }

    function handleCatChange(event) {
        setData(data => ({ ...data, cat: event.target.value }));
    }

    return (

        <form onSubmit={downloadFile}>
            {/* <div style={{ textAlign: 'left' }}>
                <label>Product:</label>
                <select value={product} onChange={handleProductChange}>
                    {products}
                </select>
            </div>
            <div style={{ textAlign: 'left' }}>
                <label>Type:</label>
                <select value={type} onChange={handleTypeChange}>
                    {types}
                </select>
            </div>
            <div style={{ textAlign: 'left' }}>
                <label>Category:</label>
                <select value={cat} onChange={handleCatChange}>
                    {cats}
                </select>
            </div>
            <div style={{ textAlign: 'left' }}>
                <label>Document:</label>
                <select value={doc}>
                    {docs}
                </select>
            </div> */}


            <div className="row align-items-center" style={{ height: '80vh' }}>
                <div className="m-auto w-50">
                    <div class="row">
                        <label class="col-form-label">Product Name</label>
                        <Select styles={customStyles} options={productList} />
                        {/* <label class="col-sm-3 col-form-label">Product Name</label>
                        <Select styles={customStyles} options={productList} />
                        <div class="col-sm-9">
                            <Select styles={customStyles} options={productList} />
                        </div> */}
                    </div>
                    <div class="row mb-3">
                        <label class="col-form-label">Lot Number</label>
                        <Select styles={customStyles} options={lotNoList} />
                        {/* <label class="col-sm-3 col-form-label">Lot Number</label>
                        <div class="col-sm-9">
                            <Select styles={customStyles} options={lotNoList} />
                        </div> */}
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-9">
                            <button type="submit" class="btn btn-default">Submit</button>
                        </div>
                        {/* <div class="col-sm-3"></div>
                        <div class="col-sm-9">
                            <button type="submit" class="btn btn-default">Submit</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Form;