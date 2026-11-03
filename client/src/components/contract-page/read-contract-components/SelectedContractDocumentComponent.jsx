import {useDispatch, useSelector} from "react-redux";
import ContractDataComponent from "../contract-component/ContractDataComponent.jsx";
import {showDocumentIdentifiers} from "./ReadContractComponent.jsx";
import { useState, useEffect } from "react";
import { EditGoodReceiptNoteComponent } from "../update-contract-component/EditGoodReceiptNoteComponent.jsx";
import {deleteGoodReceiptNote, resetDeleteState} from "../../../redux/slice/warehousing-contract/delete/DeleteGoodReceiptNoteSlice.js";
import { fetchWarehousingAgreement, resetState } from "../../../redux/slice/warehousing-contract/read-contract/WarehousingAgreementSlice.js";
import LoaderComponent, {LoaderMediumSize} from "../../loader/LoaderComponent.jsx";
import ModalComponent from "../../modal/ModalComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";
import RefreshButtonComponent from "../../refresh/RefreshButtonComponent.jsx";
import {CreateGoodReceiptNoteComponent} from "../create-contract-components/CreateGoodReceiptNoteComponent.jsx";
import {ADMIN, AGENT, USER} from "../../../role/SystemRoles.js";
import SelectComponent from "../../select/SelectComponent.jsx";
import {
    productInStockSelectedItems,
    productInStockSelectedItemsForAdmin, productInStockSelectedItemsForAdmin_Agent
} from "../../../redux/slice/product-in-stock/read-product-in-stock/ReadProductInStockSlice.js";

function SelectedContractDocumentComponent ({ setContentToShow })
{
    const warehousingAgreements = useSelector(state => state.warehousingAgreements.warehousingAgreements);
    const isLoading = useSelector(state => state.warehousingAgreements.isLoading);
    const error = useSelector(state => state.warehousingAgreements.error);
    const [loadSucceeded, setLoadSucceeded] = useState(false);

    const selectedDocument = useSelector(state => state.contractIdentifiers.selectedDocumentIdentifier)

    const selectedWarehousingAgreementDocument = warehousingAgreements[selectedDocument];

    const dispatch = useDispatch();

    useEffect(() => {

        handleBeforeAndAfterLoad(selectedDocument, selectedWarehousingAgreementDocument, dispatch, setLoadSucceeded)

    }, [selectedDocument, selectedWarehousingAgreementDocument, dispatch]);

    const handleRefresh = () => {
        dispatch(resetState());
        setLoadSucceeded(false);
    };

    return <>
        <br/>
        <button className="app-btn styled-btn" onClick={() => setContentToShow(showDocumentIdentifiers)}>Back</button>
        <br/><br/>
        <div className="flex-row-container">
            <h3>{selectedDocument}</h3>
            <RefreshButtonComponent onClick={handleRefresh} disabled={isLoading} />
        </div>

        <br/>

        {selectedWarehousingAgreementDocument && <SelectedDocumentData selectedWarehousingAgreementDocument={selectedWarehousingAgreementDocument}
                                                                       selectedDocument={selectedDocument}/>}

        {isLoading && <LoaderComponent size={LoaderMediumSize} />}

        {error && <ServerErrorMessageComponent errorMessage={error} />}

        {loadSucceeded && !selectedWarehousingAgreementDocument && <p className="no-content-paragraph">No contract data available</p> }
    </>
}


function SelectedDocumentData ({ selectedWarehousingAgreementDocument, selectedDocument })
{
    const [showEditModal, setShowEditModal] = useState(false);
    const [showGoodReceiptModal, setShowGoodReceiptModal] = useState(false);

    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);

    const dispatch = useDispatch();
    const deleteGoodReceiptNoteRedux = useSelector((state) => state.deleteGoodReceiptNote);

    const userRole = useSelector(state => state.user.user.role.name);

    const handleCreateReceipt = () => {
        setShowGoodReceiptModal(true);
    };

    const handleDeleteReceipt = () => {
        if (selectedDocument) {
            dispatch(deleteGoodReceiptNote(selectedDocument));
        }
    };

    useEffect(() => {
        if (deleteGoodReceiptNoteRedux.deleteSuccess) {
            setShowDeleteSuccessModal(true);
            dispatch(fetchWarehousingAgreement(selectedDocument));
        }
    }, [deleteGoodReceiptNoteRedux.deleteSuccess, dispatch, selectedDocument]);

    useEffect(() => {
        if (deleteGoodReceiptNoteRedux.deleteError) {
            setShowDeleteErrorModal(true);
        }
    }, [deleteGoodReceiptNoteRedux.deleteError]);

    const handleCloseDeleteSuccessModal = () => {
        setShowDeleteSuccessModal(false);
        dispatch(resetDeleteState());
    };

    const handleCloseDeleteErrorModal = () => {
        setShowDeleteErrorModal(false);
        dispatch(resetDeleteState());
    };

    return (
        <>
            <div className="flex-row-container">

                {selectedWarehousingAgreementDocument.goodsInStockReceiptNoteResponse === null &&
                    <button className="app-btn styled-btn" onClick={handleCreateReceipt}>Create Receipt</button>}

                {userRole !== USER && selectedWarehousingAgreementDocument.goodsInStockReceiptNoteResponse !== null &&
                    <button className="remove-btn" onClick={handleDeleteReceipt} disabled={deleteGoodReceiptNoteRedux.isDeleting}>Delete Receipt</button>}

                {userRole !== USER && selectedWarehousingAgreementDocument.goodsInStockReceiptNoteResponse &&
                    <button className="app-btn styled-btn" onClick={() => setShowEditModal(true)}>Edit Good Receipt Note</button>}

            </div>
            <br/>
            <ContractDataComponent
                suppliersInformation={selectedWarehousingAgreementDocument.purchaseOrderResponse.supplierInformationList}
                purchaseOrderProducts={selectedWarehousingAgreementDocument.purchaseOrderResponse.purchaseOrderProductList}
                advanceShippingNotice={selectedWarehousingAgreementDocument.advanceShippingNoticeResponse}
                goodsInStockReceiptNote={selectedWarehousingAgreementDocument.goodsInStockReceiptNoteResponse}
            />
            <br/>

            <ModalComponent isOpen={showEditModal}
                            onClose={() => setShowEditModal(false)}
                            children={<EditGoodReceiptNoteComponent goodsInStockReceiptNote={selectedWarehousingAgreementDocument.goodsInStockReceiptNoteResponse}
                                                                    documentIdentifier={selectedDocument}/>} />

            <ModalComponent isOpen={showGoodReceiptModal}
                            onClose={() => setShowGoodReceiptModal(false)}
                            children={<CreateGoodReceiptNoteComponent documentIdentifier={selectedWarehousingAgreementDocument.documentIdentifier} />} />

            <ModalComponent
                isOpen={deleteGoodReceiptNoteRedux.isDeleting}
                onClose={() => alert("We are currently deleting your goods receipt note please be patient.")}
                children={<LoaderComponent size="large" />}
            />

            <ModalComponent
                isOpen={showDeleteSuccessModal}
                onClose={handleCloseDeleteSuccessModal}
                children={<ServerSuccessMessageComponent title="Success" message="Good receipt note deleted successfully"/>}
            />

            <ModalComponent
                isOpen={showDeleteErrorModal}
                onClose={handleCloseDeleteErrorModal}
                children={<ServerErrorMessageComponent title="Error" message="Failed to delete good receipt note" errorMessage={deleteGoodReceiptNoteRedux.deleteError}/>}
            />
        </>
    )
}

function handleBeforeAndAfterLoad (selectedDocument, selectedWarehousingAgreementDocument, dispatch, setLoadSucceeded)
{
    if (selectedDocument && !selectedWarehousingAgreementDocument)
        dispatch(fetchWarehousingAgreement(selectedDocument));


    if (selectedDocument && selectedWarehousingAgreementDocument)
        setLoadSucceeded(true);
}


export default SelectedContractDocumentComponent;
