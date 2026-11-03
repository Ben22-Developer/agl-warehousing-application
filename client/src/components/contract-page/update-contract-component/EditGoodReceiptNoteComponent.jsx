import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateGoodReceiptNote, updateGoodReceiptNote, resetUpdateState } from "../../../redux/slice/warehousing-contract/update/UpdateGoodReceiptNoteSlice.js";
import { wordValidator } from "../../../validator/RegexVaildator.js";
import { fetchWarehousingAgreement } from "../../../redux/slice/warehousing-contract/read-contract/WarehousingAgreementSlice.js";
import LoaderComponent from "../../loader/LoaderComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";
import ModalComponent from "../../modal/ModalComponent.jsx";
import { GoodReceiptNoteFormFields } from "../shared/GoodReceiptNoteFormFields.jsx";
import "../ContractPage.css";

export function EditGoodReceiptNoteComponent ({ goodsInStockReceiptNote, documentIdentifier })
{
  const dispatch = useDispatch();
  const updateGoodReceiptNoteRedux = useSelector((state) => state.updateGoodReceiptNote);

  const [formData, setFormData] = useState({
    description: { description: goodsInStockReceiptNote?.description || "", error: "" },
    paymentStatus: { description: goodsInStockReceiptNote?.paymentStatus || "", error: "" },
    goodsInStockExpiryTime: { description: goodsInStockReceiptNote?.goodsInStockExpiryTime || "", error: "" },
    warehousingContractDocumentIdentifier: { description: documentIdentifier, error: "" }
  });

  const [saveClick, setSaveClick] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submit, setSubmit] = useState(false);

  const updateDescription = (description) => {
    setFormData({...formData, description:{...formData.description, description: description}});
    setSubmit(false);
  }

  const updatePaymentStatus = (paymentStatus) => {
    setFormData({...formData, paymentStatus:{...formData.paymentStatus, description: paymentStatus}});
    setSubmit(false);
  }

  const updateGoodsInStockExpiryTime = (goodsInStockExpiryTime) => {
    setFormData({...formData, goodsInStockExpiryTime:{...formData.goodsInStockExpiryTime, description: goodsInStockExpiryTime}});
    setSubmit(false);
  }

  const handleSave = () => {
    setSaveClick(true);
    setErrorOccurred(false);
  };

  console.log(goodsInStockReceiptNote)
  console.log(formData)

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    dispatch(updateGoodReceiptNote({documentIdentifier, payload: updateGoodReceiptNoteRedux}));
    setShowConfirmModal(false);
  };

  useEffect(() =>
  {
    if (!saveClick)
      return;

    validateGoodReceiptNote(dispatch, formData, setErrorOccurred, setSaveClick, setSubmit);

  }, [saveClick]);

  useEffect(() => {
    if (updateGoodReceiptNoteRedux.updateSuccess) {
      setShowSuccessModal(true);
      dispatch(fetchWarehousingAgreement(documentIdentifier));
    }
  }, [updateGoodReceiptNoteRedux.updateSuccess, dispatch, documentIdentifier]);

  useEffect(() => {
    if (updateGoodReceiptNoteRedux.updateError) {
      setShowErrorModal(true);
    }
  }, [updateGoodReceiptNoteRedux.updateError]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    dispatch(resetUpdateState());
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="form-section">
      <h2>Edit Good Receipt Note</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <GoodReceiptNoteFormFields
            formData={formData}
            updateDescription={updateDescription}
            updatePaymentStatus={updatePaymentStatus}
            updateGoodsInStockExpiryTime={updateGoodsInStockExpiryTime}
            errorOccurred={errorOccurred}
          />
        </div>

        <br/>

        <div className="flex-row-container">
          <button type="button" className="app-btn styled-btn" onClick={handleSave}>Save</button>
          {submit && <button type="submit" className="app-btn styled-btn" disabled={updateGoodReceiptNoteRedux.isUpdating}>Submit</button>}
        </div>
        <br/>
      </form>


      <ModalComponent
        isOpen={updateGoodReceiptNoteRedux.isUpdating}
        onClose={() => alert("We are currently updating your goods receipt note please be patient.")}
        children={<LoaderComponent size="large" />}
      />

      <ModalComponent
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        children={<ConfirmDataComponent updateGoodReceiptNoteRedux={updateGoodReceiptNoteRedux} />}
      />

      <ModalComponent
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        children={<ServerSuccessMessageComponent title="Success" message="Good receipt note updated successfully"/>}
      />

      <ModalComponent
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        children={<ServerErrorMessageComponent title="Error" message="Failed to update good receipt note" errorMessage={updateGoodReceiptNoteRedux.updateError}/>}
      />
    </div>
  );
}


function validateGoodReceiptNote (useDispatch, goodReceiptNote, setErrorOccurred, setSaveClick, setSubmit)
{
  let errorOccurred = false;

  goodReceiptNote.description.error = wordValidator(goodReceiptNote.description.description, "Invalid description provided");
  goodReceiptNote.paymentStatus.error = goodReceiptNote.paymentStatus.description.length === 0 ? "Payment status is required" : "";
  goodReceiptNote.goodsInStockExpiryTime.error = goodReceiptNote.goodsInStockExpiryTime.description.length === 0 ? "Goods in stock expiry time is required" : "";
  goodReceiptNote.warehousingContractDocumentIdentifier.error = wordValidator(goodReceiptNote.warehousingContractDocumentIdentifier.description, "Invalid contract document identifier provided");

  if (goodReceiptNote.description.error.length !== 0 ||
      goodReceiptNote.paymentStatus.error.length !== 0 ||
      goodReceiptNote.goodsInStockExpiryTime.error.length !== 0 ||
      goodReceiptNote.warehousingContractDocumentIdentifier.error.length !== 0)
  {
    setErrorOccurred(true)
    errorOccurred = true;
  }

  setSaveClick(false);

  if (!errorOccurred)
  {
    populateDataToSlice(useDispatch, goodReceiptNote);
    setSubmit(true);
  }
}

function populateDataToSlice (useDispatch, goodReceiptNote)
{
  const refinedGoodReceiptNote = {
    description: goodReceiptNote.description.description,
    paymentStatus: goodReceiptNote.paymentStatus.description,
    goodsInStockExpiryTime: goodReceiptNote.goodsInStockExpiryTime.description,
    warehousingContractDocumentIdentifier: goodReceiptNote.warehousingContractDocumentIdentifier.description
  };

  useDispatch(setUpdateGoodReceiptNote(refinedGoodReceiptNote));
}

function ConfirmDataComponent ({ updateGoodReceiptNoteRedux })
{
  return (<>
    <h2>Confirm Goods Receipt Note Data</h2>
    <p>Please review the goods receipt note data before submitting:</p>
    <div className="confirm-data-container">
      <p><strong>Description:</strong> {updateGoodReceiptNoteRedux?.description}</p>
      <p><strong>Payment Status:</strong> {updateGoodReceiptNoteRedux?.paymentStatus}</p>
      <p><strong>Goods In Stock Expiry Time:</strong> {updateGoodReceiptNoteRedux?.goodsInStockExpiryTime}</p>
      <p><strong>Warehousing Contract Document Identifier:</strong> {updateGoodReceiptNoteRedux?.warehousingContractDocumentIdentifier}</p>
    </div>
  </>)
}
