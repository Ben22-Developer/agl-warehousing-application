import { useDispatch, useSelector } from 'react-redux';
import './CreateStockComponent.css';
import AddNewProductStockImage from '../shared/AddNewProductStockImage.jsx';
import {
    setProductInStockCreateWarehousingContractDocumentIdentifier,
    addProductInStockCreateProduct,
    removeProductInStockCreateProduct,
    resetProductInStockCreateForm, setProductInStockFields, setProductInStockCreatePrevIndex,
    setProductInStockCreateNextIndex, postProductInStock, setSubmitError, setSubmitSuccess
} from '../../../redux/slice/product-in-stock/create-product-in-stock/CreateProductInStockSlice.js';
import {useEffect, useRef, useState} from "react";
import {wordValidator} from "../../../validator/RegexVaildator.js";
import {
    setGoodReceiptNote
} from "../../../redux/slice/warehousing-contract/create-contract/CreateGoodReceiptNoteSlice.js";
import MissingOnCreateFieldsComponent from "../../create-component/MissingOnCreateFieldsComponent.jsx";
import ModalComponent from "../../modal/ModalComponent.jsx";
import ProductsInStockDataComponent from "../shared/ProductsInStockDataComponent.jsx";
import LoaderComponent, {LoaderMediumSize} from "../../loader/LoaderComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";

function CreateProductInStockComponent() {

    const dispatch = useDispatch();
    const products = useSelector(state => state.createProductInStock.products);
    const currentIndex = useSelector(state => state.createProductInStock.currentIndex);
    const [warehousingContractDocumentIdentifier, setWarehousingContractDocumentIdentifier] = useState({object:{description:"", error:""}})

    const currentProduct = products[currentIndex];

    const [isPerfect, setIsPerfect] = useState(true);

    const [saveClick, setSaveClick] = useState(false);

    const [errorOccurred, setErrorOccurred] = useState(false);

    const [openMissingFieldModal, setOpenMissingFieldModal] = useState(false);

    const [missingFields, setMissingFields] = useState([]);

    const [productsSubmitConfirmation, setProductsSubmitConfirmation] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);

    const isSubmitting = useSelector(state => state.createProductInStock.isSubmitting);
    const submitSuccess = useSelector(state => state.createProductInStock.submitSuccess);
    const submitError = useSelector(state => state.createProductInStock.submitError);
    const submitErrorMessage = useSelector(state => state.createProductInStock.submitErrorMessage);


    const [productField, setProductField] = useState({
        name:{description: "", error:""},
        code:{description: "", error:""},
        quantity:{description: 0, error:""},
        weight:{description: 0, error:""},
        storageLocation:{description: "", error:""},
        description:{description:"", error:""},
        base64ImageStrings:{description:[], error:""},
    });

    useEffect(() =>
    {
        if (!saveClick)
            return

        validateProductInStock (dispatch, productField, setErrorOccurred, setSaveClick, currentIndex, setIsPerfect, warehousingContractDocumentIdentifier)

    }, [saveClick]);

    useEffect(() =>
    {

        setProductField({
            name:{description: currentProduct.name, error:""},
            code:{description: currentProduct.code, error:""},
            quantity:{description: currentProduct.quantity, error:""},
            weight:{description: currentProduct.weight, error:""},
            storageLocation:{description: currentProduct.storageLocation, error:""},
            description:{description:currentProduct.description, error:""},
            base64ImageStrings:{description:currentProduct.base64ImageStrings.map(e => e), error:""},
        })
    }, [currentIndex]);

    useEffect(() =>
    {
        if (!submitSuccess)
            return;

        setShowSuccessModal(true);
        dispatch(resetProductInStockCreateForm());

    }, [submitSuccess]);

    useEffect(() =>
    {
        if (!submitError)
            return;

        setShowFailureModal(true);

    }, [submitError]);


    console.log(products);

    const handleSubmit = (e) => {
        e.preventDefault();

        toSubmitProductsValidation (products, warehousingContractDocumentIdentifier, setMissingFields, setOpenMissingFieldModal, setProductsSubmitConfirmation);
    };

    console.log(productsSubmitConfirmation)

    return (
        <div className="create-stock-container">
            <h2 className="create-title">Add Products to Stock (1-10)</h2>
            
            <form className="create-form">
                <div className="form-section">

                    <h3 className="section-title">Contract Information</h3>

                    <WarehousingContractDocumentIdentifier setIsPerfect={setIsPerfect}
                                                           warehousingContractDocumentIdentifier={warehousingContractDocumentIdentifier}
                                                           setWarehousingContractDocumentIdentifier={setWarehousingContractDocumentIdentifier} />
                </div>

                <div className="form-section product-card">

                    <ProductHeader dispatch={dispatch} productsNumber={products.length} productIndex={currentIndex} />

                    <div className="form-grid">

                        {/*<CreateName setErrorOccurred={setErrorOccurred} setProductField={setProductField} productField={productField} />*/}

                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                value={productField.name.description}
                                onChange={(e) => {setIsPerfect(false); setProductField({ ...productField, name:{...productField.name, description:e.target.value},})}}
                                className="form-input"
                                required
                            />
                            <p className="error-message">{productField.name.error}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Code</label>
                            <input
                                type="text"
                                value={productField.code.description}
                                onChange={(e) => {setIsPerfect(false); setProductField({ ...productField, code:{...productField.code, description:e.target.value},})}}
                                className="form-input"
                                required
                            />
                            <p className="error-message">{productField.code.error}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                value={productField.quantity.description}
                                onChange={(e) => {setIsPerfect(false); setProductField({ ...productField, quality:{ ...productField.quality, description:e.target.value,},})}}
                                className="form-input"
                                min="0"
                                required
                            />
                            <p className="error-message">{productField.quantity.error}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Weight (kg)</label>
                            <input
                                type="number"
                                value={productField.weight.description}
                                onChange={(e) => {setIsPerfect(false); setProductField({ ...productField, weight:{...productField.weight, description:e.target.value,},})}}
                                className="form-input"
                                min="0"
                                step="0.1"
                                required
                            />
                            <p className="error-message">{productField.weight.error}</p>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Storage Location</label>
                            <input
                                type="text"
                                value={productField.storageLocation.description}
                                onChange={(e) => {setIsPerfect(false); setProductField({ ...productField, storageLocation:{...productField.storageLocation, description:e.target.value, },})}}
                                className="form-input"
                                required
                            />
                            <p className="error-message">{productField.storageLocation.error}</p>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Description</label>
                            <textarea
                                value={productField.description.description}
                                onChange={(e) => {setIsPerfect(false); setProductField({ ...productField, description:{...productField.description, description:e.target.value,},})}}
                                className="form-textarea"
                                rows="3"
                                required
                            />
                            <p className="error-message">{productField.description.error}</p>
                        </div>

                        <div className="form-section image-container">
                            <h3 className="section-title">Product Images</h3>
                            <AddNewProductStockImage

                                getImages={() => productField.base64ImageStrings.description}

                                addImageAction={(payload)=> {
                                    const obj = productField.base64ImageStrings;
                                    obj.description = obj.description.map(e => e);
                                    obj.description.push(payload.base64String);
                                    setProductField({...productField, base64ImageStrings: obj});
                                    setIsPerfect(false)
                                }}

                                removeImageAction={(payload) => {
                                    const obj = productField.base64ImageStrings;
                                    obj.description = obj.description.filter((element, index ) => ( index != payload.id));
                                    setProductField({...productField, base64ImageStrings: obj});
                                    setIsPerfect(false)
                                }}
                            />
                            <p className="error-message">{productField.base64ImageStrings.error}</p>
                        </div>
                    </div>

                </div>

                <button className="app-btn styled-btn" onClick={(e) => {e.preventDefault(); setSaveClick(true);}}>Save the product</button>

                <div className="form-actions">
                    {isPerfect && (currentIndex > 0) &&
                        <button
                            type="button"
                            className="app-btn styled-btn"
                            onClick={() => dispatch(setProductInStockCreatePrevIndex())}
                        >
                            Previous Product
                        </button>}

                    {isPerfect && (currentIndex < products.length-1) &&
                        <button
                            type="button"
                            className="app-btn styled-btn"
                            onClick={() => dispatch(setProductInStockCreateNextIndex())}
                        >
                            Next Product
                        </button>}

                </div>

                <div className="form-actions">
                    {isPerfect && products.length < 10 &&
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => dispatch(addProductInStockCreateProduct())}
                        >
                            Add Another Product
                        </button>}
                </div>

                <div className="form-actions">
                    {isPerfect &&
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        Submit Products to Stock
                    </button>}
                </div>
            </form>

            <ModalComponent isOpen={openMissingFieldModal} onClose={() => setOpenMissingFieldModal(false)} children={<MissingOnCreateFieldsComponent missingFields={missingFields} />}/>

            <ModalComponent isOpen={productsSubmitConfirmation}
                            onClose={() => setProductsSubmitConfirmation(false)}
                            onConfirm={() => {

                                dispatch(postProductInStock({products: products, warehousingContractDocumentIdentifier: warehousingContractDocumentIdentifier.object.description}))
                                console.log("submit")
                            }}
                            children={<ProductsInStockDataComponent products={products.map((e => { return {name: e.name, code: e.code, quantity: e.quantity, weight:e.weight, storageLocation: e.storageLocation, description: e.description, images:e.base64ImageStrings.map((e)=> {{return {url:e}}}) } }))} />} />

            <ModalComponent isOpen={isSubmitting}
                            onClose={() => alert("Please be patient we're currently submitting the product in stock")}
                            children={<LoaderComponent size={LoaderMediumSize}/>}/>

            <ModalComponent isOpen={showFailureModal}
                            onClose={() => setShowFailureModal(false)}
                            children={<ServerErrorMessageComponent errorMessage={submitErrorMessage} />}/>

            <ModalComponent isOpen={showSuccessModal}
                            onClose={() => setShowSuccessModal(false)}
                            children={<ServerSuccessMessageComponent message="Products in stock submitted successfully."/>} />

        </div>
    );
}

function ProductHeader ({ dispatch, productsNumber, productIndex })
{
    return (
        <div className="product-card-header">

            <h3 className="section-title">Product {productIndex + 1}</h3>

            {productsNumber > 1 &&
                <button
                type="button"
                className="remove-btn"
                onClick={() => dispatch(removeProductInStockCreateProduct(productIndex))}
                >
                Remove Product
            </button>}
        </div>
    )
}

function WarehousingContractDocumentIdentifier ({setIsPerfect, warehousingContractDocumentIdentifier, setWarehousingContractDocumentIdentifier})
{
    console.log(warehousingContractDocumentIdentifier);

    return (
        <div className="form-group full-width">
            <label className="form-label">Warehousing Contract Document Identifier</label>
            <input
                type="text"
                value={warehousingContractDocumentIdentifier.object.description}
                onChange={(e) => {
                    setIsPerfect(false);
                    const obj = warehousingContractDocumentIdentifier;
                    obj.object.description = e.target.value;
                    setWarehousingContractDocumentIdentifier({...obj});
                    console.log("in");
                }}
                className="form-input"
                required
            />
            <p className="error-message">{warehousingContractDocumentIdentifier.object.error}</p>
        </div>
    )
}

function validateProductInStock (dispatch, productField, setErrorOccurred, setSaveClick, currentIndex, setIsPerfect, warehousingContractDocumentIdentifier)
{
    let errorOccurred = false;

    warehousingContractDocumentIdentifier.object.error = wordValidator(warehousingContractDocumentIdentifier.object.description, "Invalid warehousing contract document identifier provided");
    productField.name.error = wordValidator(productField.name.description, "Invalid name provided");
    productField.storageLocation.error = wordValidator(productField.storageLocation.description, "Invalid name provided");
    productField.code.error = productField.code.description.length === 0 ? "The code is required" : "";
    productField.description.error = wordValidator(productField.description.description, "Invalid description provided");
    productField.base64ImageStrings.error = productField.base64ImageStrings.description.length === 0 ? "At least 1 image is required" : "";

    console.log(warehousingContractDocumentIdentifier)

    if (warehousingContractDocumentIdentifier.object.error.length !== 0 ||
        productField.name.error.length !== 0 ||
        productField.storageLocation.error.length !== 0 ||
        productField.code.error.length !== 0 ||
        productField.description.error.length !== 0 ||
        productField.base64ImageStrings.error.length !== 0)
    {
        setErrorOccurred(true)
        errorOccurred = true;
    }

    setSaveClick(false);

    if (!errorOccurred)
    {
        populateDataToSlice (dispatch, warehousingContractDocumentIdentifier, productField)
        setIsPerfect(true)
    }
}

function toSubmitProductsValidation (products, warehousingContractDocumentIdentifier, setMissingFields, setOpenMissingFieldsModal, setProductsSubmitConfirmation)
{
    const missingFields = [];

    if (warehousingContractDocumentIdentifier.object.description.length === 0)
        missingFields.push("You have not specified warehousing contract document identifier")

    for (const product of products) {
        if (product.name.length === 0) {
            missingFields.push("Some products are missing information.")
            break
        }
    }

    if (missingFields.length !== 0) {
        setOpenMissingFieldsModal(true);
        setMissingFields(missingFields);
    }
    else {
        setProductsSubmitConfirmation(true)
    }
}

function populateDataToSlice (dispatch, warehousingContractDocumentIdentifier, productField)
{
    const refinedProductInStock = {
        code: productField.code.description,
        storageLocation: productField.storageLocation.description,
        name: productField.name.description,
        quantity: productField.quantity.description,
        weight: productField.weight.description,
        description: productField.description.description,
        base64ImageStrings: productField.base64ImageStrings.description,
    };

    dispatch(setProductInStockFields(refinedProductInStock));
    dispatch(setProductInStockCreateWarehousingContractDocumentIdentifier(warehousingContractDocumentIdentifier.object.description))
}

export default CreateProductInStockComponent;