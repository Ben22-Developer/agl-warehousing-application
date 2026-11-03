import {useEffect, useRef, useState} from 'react';
import './UpdateStockComponent.css';
import ImageCarousel from "../../image-carousel/ImageCarousel.jsx";
import AddNewProductStockImage from "../shared/AddNewProductStockImage.jsx";
import {useDispatch, useSelector} from "react-redux";
import ModalComponent from "../../modal/ModalComponent.jsx";
import LoaderComponent, {LoaderMediumSize} from "../../loader/LoaderComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";
import {
    setProductInStockUpdateName,
    setProductInStockUpdateDescription,
    setProductInStockUpdateQuantity,
    setProductInStockUpdateWeight,
    setProductInStockUpdateStorageLocation, setProductInStockUpdateCode, addProductInStockImages,
    removeProductInStockImages, addProductInStockNewImages, removeProductInStockNewImages,
    resetUpdateProductInStock, updateProductInStock, setUpdateProductInStockFieldError
} from "../../../redux/slice/product-in-stock/update-product-in-stock/UpdateProductInStockSlice.js";
import {wordValidator} from "../../../validator/RegexVaildator.js";

function UpdateStockComponent({ product })
{
    const productInStockUpdate = useSelector(state => state.updateProductInStock)

    const dispatch = useDispatch();

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const isUpdating = useSelector(state => state.updateProductInStock.isUpdating);
    const updateSuccess = useSelector(state => state.updateProductInStock.updateSuccess);
    const updateError = useSelector(state => state.updateProductInStock.updateError);
    const updateErrorMessage = useSelector(state => state.updateProductInStock.updateErrorMessage);

    useEffect(() => {
        if (!updateSuccess)
            return;

        setShowSuccessModal(true);
        dispatch(resetUpdateProductInStock());
    }, [updateSuccess, dispatch]);

    useEffect(() => {
        if (!updateError)
            return;

        setShowErrorModal(true);
    }, [updateError]);

    useEffect(() => {

        return () => {
            dispatch(resetUpdateProductInStock())
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateProductSubmit(productInStockUpdate, product, dispatch);
    };

    if (!product) {
        return <div className="no-product">No product selected</div>;
    }


    return (
        <div className="update-stock-container">
            <h2 className="update-title">Update Product</h2>
            
            <form onSubmit={handleSubmit} className="update-form">
                <div className="form-section">
                    <h3 className="section-title">Product Information</h3>
                    
                    <div className="form-grid">

                        <UpdateName product={product}/>

                        <UpdateCode product={product}/>

                        <UpdateStockNumber product={product}/>

                        <UpdateWeight product={product}/>

                        <UpdateStorageLocation product={product}/>

                        <UpdateDescription product={product}/>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Product Images</h3>

                    <UpdateProductInStockImage product={product}/>

                    <br /> <br />

                    <AddNewProductStockImage
                        getImages={() => useSelector((state) => state.updateProductInStock.newImages)}
                        addImageAction={(e) => dispatch(addProductInStockNewImages(e))}
                        removeImageAction={(e) => dispatch(removeProductInStockNewImages(e))}
                    />

                </div>

                <div className="form-actions">
                    <button type="submit" className="app-btn styled-btn" disabled={isUpdating}>
                        Update Product
                    </button>
                </div>
            </form>

            <ModalComponent isOpen={isUpdating}
                            onClose={() => alert("Please be patient we're currently updating the product")}
                            children={<LoaderComponent size={LoaderMediumSize}/>}/>

            <ModalComponent isOpen={showErrorModal}
                            onClose={() => setShowErrorModal(false)}
                            children={<ServerErrorMessageComponent errorMessage={updateErrorMessage} />}/>

            <ModalComponent isOpen={showSuccessModal}
                            onClose={() => setShowSuccessModal(false)}
                            children={<ServerSuccessMessageComponent message="Product in stock updated successfully."/>}/>
        </div>
    );
}

function UpdateName ({ product })
{
    const dispatch = useDispatch();
    const productInStockUpdateName = useSelector(state => state.updateProductInStock.name);

    useEffect(() =>
    {
        dispatch(setProductInStockUpdateName(product.name));
    },[]);

    function validator () {
        const message = wordValidator(productInStockUpdateName, "Invalid name");
        return message;
    }

    return (
        <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
                type="text"
                name="name"
                value={productInStockUpdateName}
                onChange={(e) => dispatch(setProductInStockUpdateName(e.target.value))}
                className="form-input"
                required
            />
            <p className="error-message">{fieldValidate (validator)}</p>
        </div>
    )
}

function UpdateStockNumber ({ product })
{
    const dispatch = useDispatch();
    const productInStockUpdateQuantity = useSelector(state => state.updateProductInStock.quantity);

    useEffect(() => {
        dispatch(setProductInStockUpdateQuantity(product.quantity))
    }, []);

    function validator () {
        const message = productInStockUpdateQuantity < 0 ? "Quantity cannot be negative" : "";
        return message;
    }

    return (
        <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
                type="number"
                name="quantity"
                value={productInStockUpdateQuantity}
                onChange={(e) => dispatch(setProductInStockUpdateQuantity(e.target.value))}
                className="form-input"
                min="0"
                required
            />
            <p className="error-message">{fieldValidate (validator)}</p>
        </div>
    )
}

function UpdateCode ({ product })
{
    const dispatch = useDispatch();
    const productInStockUpdateCode = useSelector(state => state.updateProductInStock.code);

    useEffect(() => {
        dispatch(setProductInStockUpdateCode(product.code))
    }, []);

    function validator () {
        const message = productInStockUpdateCode.length === 0 ? "The code is required" : "";
        return message;
    }

    return (
        <div className="form-group">
            <label className="form-label">Product Code</label>
            <input
                type="text"
                name="code"
                value={productInStockUpdateCode}
                className="form-input"
                disabled={true}
                required
            />
            <p className="error-message">{fieldValidate (validator)}</p>
        </div>
    )
}

function UpdateWeight ({ product })
{
    const dispatch = useDispatch();
    const productInStockUpdateWeight = useSelector(state => state.updateProductInStock.weight);

    useEffect(() => {
        dispatch(setProductInStockUpdateWeight(product.weight))
    }, []);

    function validator () {
        const message = productInStockUpdateWeight < 0 ? "Weight cannot be negative" : "";
        return message;
    }

    return (
        <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input
                type="number"
                name="weight"
                value={productInStockUpdateWeight}
                onChange={(e) => dispatch(setProductInStockUpdateWeight(e.target.value))}
                className="form-input"
                min="0"
                step="0.1"
                required
            />
            <p className="error-message">{fieldValidate (validator)}</p>
        </div>
    )
}

function UpdateStorageLocation ({ product })
{
    const dispatch = useDispatch();
    const productInStockUpdateStorageLocation = useSelector(state => state.updateProductInStock.storageLocation);

    useEffect(() => {
        dispatch(setProductInStockUpdateStorageLocation(product.storageLocation))
    }, []);

    function validator () {
        const message = wordValidator(productInStockUpdateStorageLocation, "Invalid storage location");
        return message;
    }

    return (
        <div className="form-group full-width">
            <label className="form-label">Storage Location</label>
            <input
                type="text"
                name="storageLocation"
                value={productInStockUpdateStorageLocation}
                onChange={(e) => dispatch(setProductInStockUpdateStorageLocation(e.target.value))}
                className="form-input"
                required
            />
            <p className="error-message">{fieldValidate (validator)}</p>
        </div>
    )
}

function UpdateDescription ({ product })
{
    const dispatch = useDispatch();
    const productInStockUpdateDescription = useSelector(state => state.updateProductInStock.description);

    useEffect(() => {
        dispatch(setProductInStockUpdateDescription(product.description))
    }, []);

    function validator () {
        const message = wordValidator(productInStockUpdateDescription, "Invalid description");
        return message;
    }

    return (
        <div className="form-group full-width">
            <label className="form-label">Description</label>
            <textarea
                name="description"
                value={productInStockUpdateDescription}
                onChange={(e) => dispatch(setProductInStockUpdateDescription(e.target.value))}
                className="form-textarea"
                rows="3"
                required
            />
            <p className="error-message">{fieldValidate (validator)}</p>
        </div>
    )
}

function UpdateProductInStockImage ({ product })
{

    const dispatch = useDispatch();

    const images = useSelector(state => state.updateProductInStock.images.filter(e => !e.hasOnDeleteMark)); //

    const newImages = useSelector((state) => state.updateProductInStock.newImages);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    console.log(images)

    function validator () {
        const message = (newImages.length + images.length === 0) ? "They must be at least 1 image" : "";
        return message;
    }

    useEffect(() =>
    {
        const productInStockRefinedImages =
            product.productInStockImageResponseList.map((element, index) =>
        {
            return  { cloudinaryUrl: element.cloudinaryUrl, cloudinaryPublicId : element.cloudinaryPublicId,  hasOnDeleteMark: false}
        });

        dispatch(addProductInStockImages(productInStockRefinedImages))

    }, []);

    return (
        <>
            <ImageCarousel images={images} setParentCurrentImageIndex={setCurrentImageIndex}/>

            {images.length > 0 &&
                <button
                    type="button"
                    className="delete-image-btn"
                    onClick={() => {

                        dispatch(removeProductInStockImages({cloudinaryPublicId: images[currentImageIndex].cloudinaryPublicId}));

                    }}
                >
                    Delete Current Image
                </button>}

            <p className="error-message">{fieldValidate (validator)}</p>
        </>
    )
}

function handleUpdateProductSubmit(productInStockUpdate, product, dispatch) {

    const isError = validateProductInStockUpdatedData (productInStockUpdate);

    if (isError)
        return;

    patchProductInStock(productInStockUpdate, product, dispatch);
}

function validateProductInStockUpdatedData (productInStockUpdate)
{
    const nameError = wordValidator(productInStockUpdate.name, "Invalid name").length > 0;
    const quantityError = productInStockUpdate.quantity < 0;
    const codeError = productInStockUpdate.code.length === 0;
    const weightError = productInStockUpdate.weight < 0;
    const storageLocationError = wordValidator(productInStockUpdate.storageLocation, "Invalid storage location").length > 0;
    const descriptionError = wordValidator(productInStockUpdate.description, "Invalid description").length > 0;
    const imagesError = (productInStockUpdate.newImages.length + productInStockUpdate.images.filter(e => !e.hasOnDeleteMark).length === 0);

    console.log(nameError +","+ quantityError +","+ codeError +","+ weightError +","+ storageLocationError +","+ descriptionError +","+ imagesError)

    return nameError || quantityError || codeError || weightError || storageLocationError || descriptionError || imagesError;
}

function patchProductInStock (productInStockUpdate, product, dispatch)
{
    const productInStockImage = [
        ...productInStockUpdate.images.map(img => ({
            cloudinaryPublicId: img.cloudinaryPublicId,
            hasOnDeleteMark: img.hasOnDeleteMark,
            base64String: ""
        })),
        ...productInStockUpdate.newImages.map(img => ({
            cloudinaryPublicId: img.cloudinaryPublicId,
            hasOnDeleteMark: img.hasOnDeleteMark,
            base64String: img.base64String
        }))
    ];

    const payload = {
        productInStockId: product.productInStockId,
        name: productInStockUpdate.name,
        quantity: productInStockUpdate.quantity,
        weight: productInStockUpdate.weight,
        description: productInStockUpdate.description,
        storageLocation: productInStockUpdate.storageLocation,
        productInStockImage: productInStockImage
    };

    // console.log(payload)

    dispatch(updateProductInStock(payload));
}

function fieldValidate (runnable)
{
    return runnable();
}

export default UpdateStockComponent;
