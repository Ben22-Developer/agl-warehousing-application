import {useDispatch, useSelector} from "react-redux";
import {
    setSelectedDocumentIdentifier,
    fetchContractIdentifiers,
    resetState,
    contractTypeSelectedItems,
    contractTypeSelectedItemsForAdmin,
    contractTypeSelectedItemsForAdmin_Agent
} from "../../../redux/slice/warehousing-contract/read-contract/ReadContractIdentifiersSlice.js";
import {
    deleteWarehousingContract,
    resetDeleteContractState
} from "../../../redux/slice/warehousing-contract/delete/DeleteWarehousingContractSlice.js";
import {showSelectedDocument} from "./ReadContractComponent.jsx";
import {useState, useEffect} from "react";
import ModalComponent from "../../modal/ModalComponent.jsx";
import LoaderComponent, {LoaderMediumSize, LoaderSmallSize} from "../../loader/LoaderComponent.jsx";
import RefreshButtonComponent from "../../refresh/RefreshButtonComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";
import SelectComponent from "../../select/SelectComponent.jsx";
import {ADMIN, AGENT} from "../../../role/SystemRoles.js";

function ContractDocumentIdentifiersComponent ({ setContentToShow })
{
    const documentIdentifiers = useSelector((state) => state.contractIdentifiers.documentIdentifiers);
    const isLoading = useSelector((state) => state.contractIdentifiers.isLoading);
    const hasLoaded = useSelector((state) => state.contractIdentifiers.hasLoaded);
    const error = useSelector((state) => state.contractIdentifiers.error)
    const dispatch = useDispatch();

    const [selectedItem, setSelectedItem] = useState(contractTypeSelectedItems[0]);

    const userRole = useSelector(state => state.user.user.role.name);

    useEffect(() =>
    {
        if (hasLoaded)
            return

        fetchData();
    }, [selectedItem]);

    const handleRefresh = () => {
        dispatch(resetState());
        fetchData();
    };

    function fetchData () {
        dispatch(fetchContractIdentifiers({selectedItem: selectedItem}));
    }

    return (
        <div className="document-identifiers-container">
            <div className="flex-row-container">
                <h2 className="document-identifiers-title">Contract Documents</h2>
                <RefreshButtonComponent  onClick={handleRefresh} disabled={isLoading}/>
            </div>

            <div className="select-component-container">
                {userRole === ADMIN && <SelectComponent setSelected={(e) => setSelectedItem(e)} items={contractTypeSelectedItemsForAdmin}
                                                        placeholder="Contract Type"/>}

                {userRole === AGENT && <SelectComponent setSelected={(e) => setSelectedItem(e)} items={contractTypeSelectedItemsForAdmin_Agent}
                                                        placeholder="Contract Type"/>}
            </div>

            <br/>

            {isLoading && <LoaderComponent size="large" />}
            {error && <ServerErrorMessageComponent title={"Error"} message={"Failed to fetch data"} errorMessage={error} />}

            {documentIdentifiers.length > 0 && <DocumentIdentifiersList documentIdentifiers={documentIdentifiers} setContentToShow={setContentToShow} />}
            {documentIdentifiers.length <= 0 && hasLoaded && <p className="no-content-paragraph">You have no current saved warehousing contract</p>}
        </div>
    );
}

function DocumentIdentifiersList ({ documentIdentifiers, setContentToShow })
{
    const [showModal, setShowModal] = useState(false);
    const [selectedIdentifier, setSelectedIdentifier] = useState(null);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);

    const deleteWarehousingContractRedux = useSelector((state) => state.deleteWarehousingContract);

    const handleIdentifierClick = (identifier) => {
        dispatch(setSelectedDocumentIdentifier(identifier));
        setContentToShow(showSelectedDocument);
    };

    const dispatch = useDispatch();

    const handleDeleteClick = (identifier) => {
        setSelectedIdentifier(identifier);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIdentifier) {
            dispatch(deleteWarehousingContract(selectedIdentifier));
        }
        setShowModal(false);
    };

    useEffect(() => {
        if (deleteWarehousingContractRedux.deleteSuccess) {
            setShowDeleteSuccessModal(true);
            dispatch(fetchContractIdentifiers());
        }
    }, [deleteWarehousingContractRedux.deleteSuccess, dispatch]);

    useEffect(() => {
        if (deleteWarehousingContractRedux.deleteError) {
            setShowDeleteErrorModal(true);
        }
    }, [deleteWarehousingContractRedux.deleteError]);

    const handleCloseDeleteSuccessModal = () => {
        setShowDeleteSuccessModal(false);
        dispatch(resetDeleteContractState());
    };

    const handleCloseDeleteErrorModal = () => {
        setShowDeleteErrorModal(false);
        dispatch(resetDeleteContractState());
    };

    return (
        <>
            <ul className="ul-container">
                {documentIdentifiers.map((identifier, index) => {
                    return (
                        <div key={index} className="document-identifier-item-container">
                            <li
                                key={index}
                                className="li-item"
                                onClick={() => handleIdentifierClick(identifier)}
                            >
                                {identifier}
                            </li>

                            {deleteWarehousingContractRedux.isDeleting ?
                                <LoaderComponent size={LoaderSmallSize}/> :
                                <button className="remove-btn" onClick={() => handleDeleteClick(identifier)}>
                                    Delete
                                </button>
                            }
                        </div>
                    );
                })}
            </ul>

            <ModalComponent
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                children={<h4>Are you sure you want to delete contract -> {selectedIdentifier}?</h4>}
            />

            <ModalComponent
                isOpen={showDeleteSuccessModal}
                onClose={handleCloseDeleteSuccessModal}
                children={<ServerSuccessMessageComponent title="Success" message="Warehousing contract deleted successfully"/>}
            />

            <ModalComponent
                isOpen={showDeleteErrorModal}
                onClose={handleCloseDeleteErrorModal}
                children={<ServerErrorMessageComponent title="Error" message="Failed to delete warehousing contract" errorMessage={deleteWarehousingContractRedux.deleteError}/>}
            />
        </>
    )
}

export default ContractDocumentIdentifiersComponent;