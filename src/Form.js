import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useTranslation } from 'react-i18next'
import Select from "react-select";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const customStyles = {
    control: (base, state) => ({
        ...base,
        marginBottom: 10
    })
};

function Form() {
    const { t } = useTranslation();

    const [productList, setProductList] = useState([]);
    const [productValue, setProductValue] = useState(0);

    const [lotNoList, setLotNoList] = useState([]);
    const [lotNoValue, setLotNoValue] = useState(0);

    const [isLoading, setLoading] = useState(false);
    const [isCOAFound, setCOAFound] = useState(true);

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch("v1/api/products")
            .then((res) => res.json())
            .then((data) => setProductList(data))
            .catch(error => {
                setErrorMessage(error.toString())
            })
    }, [])

    useEffect(() => {
        fetch("/v1/api/lotnos")
            .then((res) => res.json())
            .then((data) => setLotNoList(data))
            .catch(error => {
                setErrorMessage(error.toString())
            })
    }, [])

    const handleClick = () => {
        setLoading(true)
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: productValue,
                lotNo: lotNoValue
            })
        }

        const response = fetch('/v1/api/search', options)
            .then((res) => res.json())
            .then((data) => {

                setLoading(false)
                console.log(data.length);

                if (data.length > 0) {
                    fetch('/v1/api/download', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filePath: data[0].file })
                    })
                        .then((response) => response.blob())
                        .then((blob) => {
                            const a = document.createElement('a')
                            a.target = '_blank'
                            a.href = URL.createObjectURL(blob)
                            const clickEvent = new MouseEvent('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                            })
                            a.dispatchEvent(clickEvent)
                            a.remove()
                        })
                        .catch(error => {
                            setErrorMessage(error.toString());
                        })
                } else {
                    setCOAFound(false);
                    setMessage(`Not Found COA for ${productValue}, ${lotNoValue}`);
                }
            })
            .catch(error => {
                setLoading(false)
                setMessage(error.toString());
            })
    }

    const downloadFile = (event) => {
        event.preventDefault()
        //setLoading(true)
        // const options = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ product: 'Butterfly-Pea' })
        // }
    }

    return (

        <form onSubmit={downloadFile}>
            <div className="row align-items-center" style={{ height: '80vh' }}>
                <div className="m-auto w-50">
                    <div class="row">
                        <div>
                            {!isCOAFound &&
                                <Alert key="warning" variant="warning">
                                    {message}
                                </Alert>
                            }
                            {errorMessage &&
                                <Alert key="danger" variant="danger">
                                    {errorMessage}
                                </Alert>
                            }
                        </div>
                    </div>
                    <div class="row">
                        <label class="col-form-label">{t('Product Name')}</label>
                        <Select
                            styles={customStyles}
                            options={productList}
                            onChange={(choice) => {
                                setCOAFound(true)
                                setProductValue(choice.value)
                            }}
                        />
                    </div>
                    <div class="row mb-3">
                        <label class="col-form-label">{t('Lot Number')}</label>
                        <Select
                            styles={customStyles}
                            options={lotNoList}
                            onChange={(choice) => {
                                setCOAFound(true)
                                setLotNoValue(choice.value)
                            }}
                        />
                    </div>
                    <Button
                        variant="primary"
                        disabled={isLoading || !productValue || !lotNoValue}
                        onClick={!isLoading ? handleClick : null}
                    >
                        {isLoading ? 'Loading…' : t('Submit')}
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default Form;