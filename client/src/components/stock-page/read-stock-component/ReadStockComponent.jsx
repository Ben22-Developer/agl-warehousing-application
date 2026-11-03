import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ReadStockComponent.css';
import ModalComponent from "../../modal/ModalComponent.jsx";
import UpdateStockComponent from "../update-stock-component/UpdateStockComponent.jsx";
import ImageCarousel from "../../image-carousel/ImageCarousel.jsx";
import LoaderComponent, { LoaderMediumSize } from "../../loader/LoaderComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import RefreshButtonComponent from "../../refresh/RefreshButtonComponent.jsx";
import {
    fetchProductInStock,
    productInStockSelectedItems, productInStockSelectedItemsForAdmin, productInStockSelectedItemsForAdmin_Agent,
    resetProductInStock
} from "../../../redux/slice/product-in-stock/read-product-in-stock/ReadProductInStockSlice.js";
import { deleteProductInStock, resetDeleteProductInStock } from "../../../redux/slice/product-in-stock/delete-product-in-stock/DeleteProductInStockSlice.js";
import SelectComponent from "../../select/SelectComponent.jsx";
import {ADMIN, AGENT, USER} from "../../../role/SystemRoles.js";

function ReadStockComponent({ showActions=true }) {

    const dispatch = useDispatch();
    const products = useSelector(state => state.readProductInStock.productInStock);
    const isLoading = useSelector(state => state.readProductInStock.isLoading);
    const error = useSelector(state => state.readProductInStock.error);
    const errorMessage = useSelector(state => state.readProductInStock.errorMessage);

    const [selectedItem, setSelectedItem] = useState(productInStockSelectedItems[0]);

    const userRole = useSelector(state => state.user.user.role.name);

    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            setShowErrorModal(true);
        }
    }, [error]);

    const handleRefresh = () => {
        dispatch(resetProductInStock());
        fetchData();
    };

    function fetchData () {
        dispatch(fetchProductInStock({selectedItem: selectedItem}));
    }

    return (
        <div className="stock-carousel-container">
            <div className="flex-row-container">
                <h2 className="create-title">Products in Stock</h2>
                <RefreshButtonComponent onClick={handleRefresh} disabled={isLoading}/>
            </div>

            {userRole !== USER &&
                <div className="select-component-container">
                {userRole === ADMIN &&
                    <SelectComponent setSelected={(e) => setSelectedItem(e)} items={productInStockSelectedItemsForAdmin}
                                     placeholder="Products Category"/>}

                {userRole === AGENT && <SelectComponent setSelected={(e) => setSelectedItem(e)}
                                                        items={productInStockSelectedItemsForAdmin_Agent}
                                                        placeholder="Products Category"/>}
            </div>}

            <br/>

                {products.map((product, index) => {
                    return (
                        <div className="product-card" key={index}>
                            <ProductCounter currentProductIndex={index} productsLength={products.length}/>
                            <ImageCarousel images={product.productInStockImageResponseList}/>
                            <ProductSummaryInfo product={product} />
                            {userRole !== USER && showActions && <Actions product={product}/>}
                        </div>
                    )
                })}

            {isLoading && <LoaderComponent size={LoaderMediumSize} />}

            {products.length == 0 && <div className="no-content-paragraph">No products available</div>}

            <ModalComponent isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} children={<ServerErrorMessageComponent errorMessage={errorMessage} />}/>

        </div>
    );
}

function ProductCounter ({ currentProductIndex, productsLength}) {
    return (
        <div className="product-counter">
            <span className="counter-current">{currentProductIndex+1}</span>
            <span className="counter-divider">/</span>
            <span className="counter-total">{productsLength}</span>
        </div>
    )
}


function ProductSummaryInfo ({ product })
{
    return (
        <div className="product-info">
            <div className="product-header">
                <div>
                    <h2 className="product-name">{product.name}</h2>
                    <span className="product-code">Product code: {product.code}</span>
                </div>
                <div className="quantity-badge">
                    <span className="quantity-number">{product.quantity}</span>
                    <span className="quantity-label">in stock</span>
                </div>
            </div>

            <div className="product-details">
                <div className="detail-item">
                    <span className="detail-label">Weight</span>
                    <span className="detail-value">{product.weight} kg</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Storage</span>
                    <span className="detail-value">{product.storageLocation}</span>
                </div>
            </div>

            <div className="product-description">
                <span className="description-label">Description</span>
                <p className="description-text">{product.description}</p>
            </div>
        </div>)
}

function GoodsInStockReceiptNote ({ receiptNote })
{
    if (!receiptNote) return <div className="no-receipt-note">No receipt note available</div>;

    return (
        <div className="receipt-note-container">
            <h3 className="receipt-note-title">Goods In Stock Receipt Note</h3>
            <div className="receipt-note-details">
                <div className="receipt-note-item">
                    <span className="receipt-note-label">Description:</span>
                    <span className="receipt-note-value">{receiptNote.description}</span>
                </div>
                <div className="receipt-note-item">
                    <span className="receipt-note-label">Payment Status:</span>
                    <span className="receipt-note-value">{receiptNote.paymentStatus}</span>
                </div>
                <div className="receipt-note-item">
                    <span className="receipt-note-label">Received On:</span>
                    <span className="receipt-note-value">{new Date(receiptNote.receivedOn).toLocaleString()}</span>
                </div>
                <div className="receipt-note-item">
                    <span className="receipt-note-label">Expiry Time:</span>
                    <span className="receipt-note-value">{new Date(receiptNote.goodsInStockExpiryTime).toLocaleString()}</span>
                </div>
                {receiptNote.goodsInContractReceiver && (
                    <div className="receiver-info">
                        <h4 className="receiver-title">Receiver Information</h4>
                        <div className="receipt-note-item">
                            <span className="receipt-note-label">Name:</span>
                            <span className="receipt-note-value">{receiptNote.goodsInContractReceiver.name}</span>
                        </div>
                        <div className="receipt-note-item">
                            <span className="receipt-note-label">Username:</span>
                            <span className="receipt-note-value">{receiptNote.goodsInContractReceiver.username}</span>
                        </div>
                        <div className="receipt-note-item">
                            <span className="receipt-note-label">Role:</span>
                            <span className="receipt-note-value">{receiptNote.goodsInContractReceiver.role?.name}</span>
                        </div>
                        <div className="receipt-note-item">
                            <span className="receipt-note-label">Created At:</span>
                            <span className="receipt-note-value">{new Date(receiptNote.goodsInContractReceiver.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Actions ({product})
{
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useDispatch();
    const isDeleting = useSelector(state => state.deleteProductInStock.isDeleting);
    const deleteSuccess = useSelector(state => state.deleteProductInStock.deleteSuccess);
    const deleteError = useSelector(state => state.deleteProductInStock.deleteError);
    const deleteErrorMessage = useSelector(state => state.deleteProductInStock.deleteErrorMessage);

    useEffect(() => {
        if (!deleteSuccess)
            return;

        dispatch(resetDeleteProductInStock());
        setShowDeleteModal(false);
        dispatch(fetchProductInStock());

    }, [deleteSuccess, dispatch]);

    useEffect(() => {
        if (deleteError) {
            setShowDeleteModal(false);
        }
    }, [deleteError]);

    console.log(product + "/ " + showUpdateModal)

    return (
        <div className="flex-row-container">
            <button
                className="app-btn styled-btn"
                onClick={() => {
                    setShowUpdateModal(true);
                }}
            >
                Update Product
            </button>

            <button
                className="app-btn styled-btn"
                onClick={() => setShowDetailsModal(true)}
            >
                Product Details
            </button>

            <button
                className="remove-btn"
                onClick={() => {setShowDeleteModal(true); dispatch(deleteProductInStock({productInStockId: product.productInStockId}));}}
            >
                Delete Product
            </button>

            <ModalComponent isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} children={<UpdateStockComponent product={product}/>}/>

            <ModalComponent isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} children={
                                                                                                      <div className="product-details-modal">
                                                                                                         <ProductSummaryInfo product={product} />
                                                                                                         <GoodsInStockReceiptNote receiptNote={product.goodsInStockReceiptNote} />
                                                                                                     </div>
                                                                                                 }/>
            <ModalComponent 
                isOpen={showDeleteModal} 
                onClose={() => !isDeleting && setShowDeleteModal(false)} 
                children={<LoaderComponent size={LoaderMediumSize} />}
            />
            {deleteError && <ModalComponent isOpen={deleteError} onClose={() => {dispatch(resetDeleteProductInStock());}} children={<ServerErrorMessageComponent errorMessage={deleteErrorMessage} />}/>}
        </div>)
}

export default ReadStockComponent;