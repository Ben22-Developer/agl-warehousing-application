import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setGoodReceiptNote, submitGoodReceiptNote, resetGoodReceiptNoteSubmission} from "../../../redux/slice/warehousing-contract/create-contract/CreateGoodReceiptNoteSlice.js";
import {wordValidator} from "../../../validator/RegexVaildator.js";
import ModalComponent from "../../modal/ModalComponent.jsx";
import LoaderComponent from "../../loader/LoaderComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";
import { GoodReceiptNoteFormFields } from "../shared/GoodReceiptNoteFormFields.jsx";

export function CreateGoodReceiptNoteComponent ({ documentIdentifier })
{
  const goodReceiptNoteRedux = useSelector((state => state.createGoodReceiptNote));

  const[goodReceiptNote, setGoodReceiptNoteState] = useState({
    description:{description: goodReceiptNoteRedux.description, error:""},
    paymentStatus:{description: goodReceiptNoteRedux.paymentStatus, error:""},
    goodsInStockExpiryTime:{description: goodReceiptNoteRedux.goodsInStockExpiryTime, error:""},
    goodsReceiverUsername:{description: "", error:""},
    goodsReceiverRawPassword:{description: "", error:""},
    warehousingContractDocumentIdentifier:{description: documentIdentifier, error:""}
  });

  const dispatch = useDispatch();

  const [saveClick, setSaveClick] = useState(false);

  const [errorOccurred, setErrorOccurred] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [submit, setSubmit] = useState(false);

  const updateDescription = (description) =>
  {
    setGoodReceiptNoteState({...goodReceiptNote, description:{...goodReceiptNote.description, description: description}});
    setSubmit(false)
  }

  const updatePaymentStatus = (paymentStatus) =>
  {
    const paymentStatusObject = {"half paid":"halfPaid", paid:"paid", unpaid:"unpaid"};
    setGoodReceiptNoteState({...goodReceiptNote, paymentStatus:{...goodReceiptNote.paymentStatus, description: paymentStatusObject[paymentStatus]}});
    setSubmit(false)
  }

  const updateGoodsInStockExpiryTime = (goodsInStockExpiryTime) =>
  {
    setGoodReceiptNoteState({...goodReceiptNote, goodsInStockExpiryTime:{...goodReceiptNote.goodsInStockExpiryTime, description: goodsInStockExpiryTime}});
    setSubmit(false)
  }

  const updateGoodsReceiverUsername = (goodsReceiverUsername) =>
  {
    setGoodReceiptNoteState({...goodReceiptNote, goodsReceiverUsername:{...goodReceiptNote.goodsReceiverUsername, description: goodsReceiverUsername}});
    setSubmit(false)
  }

  const updateGoodsReceiverRawPassword = (goodsReceiverRawPassword) =>
  {
    setGoodReceiptNoteState({...goodReceiptNote, goodsReceiverRawPassword:{...goodReceiptNote.goodsReceiverRawPassword, description: goodsReceiverRawPassword}});
    setSubmit(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    dispatch(submitGoodReceiptNote());
    setShowConfirmModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  useEffect(() =>
  {
    if (!saveClick)
      return;

 validateGoodReceiptNote(dispatch, goodReceiptNote, setErrorOccurred, setSaveClick, setSubmit);

  }, [saveClick]);

  useEffect(() => {
    if (!goodReceiptNoteRedux.submitSuccess) {
      return
    }
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    setSubmit(false);
    dispatch(resetGoodReceiptNoteSubmission());

  }, [goodReceiptNoteRedux.submitSuccess, dispatch]);

  useEffect(() => {
    if (!goodReceiptNoteRedux.submitError) {
      return
    }

    setShowConfirmModal(false);
    setShowErrorModal(true);

  }, [goodReceiptNoteRedux.submitError, dispatch]);

  // console.log(goodReceiptNote);

  return(
      <div className="form-section">

        {goodReceiptNoteRedux.isSubmitting && <ModalComponent isOpen={goodReceiptNoteRedux.isSubmitting} onClose={() => alert("We are currently submitting your goods receipt note please be patient.")} children={<LoaderComponent size="large" />}/>}



        <h2>Goods Receipt Note</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <GoodReceiptNoteFormFields
              formData={goodReceiptNote}
              updateDescription={updateDescription}
              updatePaymentStatus={updatePaymentStatus}
              updateGoodsInStockExpiryTime={updateGoodsInStockExpiryTime}
              updateGoodsReceiverUsername={updateGoodsReceiverUsername}
              errorOccurred={errorOccurred}
            />

            <div className="form-group-container">
              <div style={{marginBottom: 4}} className="form-group">
                <label>Goods Receiver</label>
                <input
                    type="text"
                    placeholder="Goods receiver username"
                    value={goodReceiptNote.goodsReceiverUsername.description}
                    onChange={(e) => updateGoodsReceiverUsername(e.target.value)}
                    required
                />
                {errorOccurred && <p className="error-message">{goodReceiptNote.goodsReceiverUsername.error}</p>}
              </div>
              <div className="form-group">
                <input
                    type="password"
                    placeholder="Goods receiver password"
                    value={goodReceiptNote.goodsReceiverRawPassword.description}
                    onChange={(e) => updateGoodsReceiverRawPassword(e.target.value)}
                    required
                />
                {errorOccurred && <p className="error-message">{goodReceiptNote.goodsReceiverRawPassword.error}</p>}
              </div>

            </div>

          </div>

          <br/>

          <div className="flex-row-container">
            <button type="button" className="app-btn styled-btn" onClick={() => {setSaveClick(true); setErrorOccurred(false)} }>Save</button>
            {submit && <button type="submit" className="app-btn styled-btn" disabled={goodReceiptNoteRedux.isSubmitting}>Submit</button>}
          </div>
          <br/>
        </form>

        <ModalComponent
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSubmit}
          children={<ConfirmDataComponent goodReceiptNoteRedux={goodReceiptNoteRedux} />}
        />

        <ModalComponent
          isOpen={showErrorModal}
          onClose={handleCloseErrorModal}
          children={<ServerErrorMessageComponent title={"Submission Error"} message={"Failed to submit goods receipt note:"} errorMessage={goodReceiptNoteRedux.submitErrorMessage} />}
        />

        <ModalComponent
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          children={<ServerSuccessMessageComponent title={"Goods Receipt Note Created Successfully"} message={"Your goods receipt note has been successfully created and submitted."} />}
        />
      </div>
  )
}


function validateGoodReceiptNote (useDispatch, goodReceiptNote, setErrorOccurred, setSaveClick, setSubmit)
{
  let errorOccurred = false;

  goodReceiptNote.description.error = wordValidator(goodReceiptNote.description.description, "Invalid description provided");
  goodReceiptNote.paymentStatus.error = goodReceiptNote.paymentStatus.description.length === 0 ? "Payment status is required" : "";
  goodReceiptNote.goodsInStockExpiryTime.error = goodReceiptNote.goodsInStockExpiryTime.description.length === 0 ? "Goods in stock expiry time is required" : "";
  goodReceiptNote.goodsReceiverUsername.error = wordValidator(goodReceiptNote.goodsReceiverUsername.description, "Invalid username");
  goodReceiptNote.goodsReceiverRawPassword.error = goodReceiptNote.goodsReceiverRawPassword.description === 0 ? "Goods receiver password is required" : "";
  goodReceiptNote.warehousingContractDocumentIdentifier.error = wordValidator(goodReceiptNote.warehousingContractDocumentIdentifier.description, "Invalid contract document identifier provided");

  if (goodReceiptNote.description.error.length !== 0 ||
      goodReceiptNote.paymentStatus.error.length !== 0 ||
      goodReceiptNote.goodsInStockExpiryTime.error.length !== 0 ||
      goodReceiptNote.goodsReceiverUsername.error.length !== 0 ||
      goodReceiptNote.goodsReceiverRawPassword.error.length !== 0 ||
      goodReceiptNote.warehousingContractDocumentIdentifier.error.length !== 0)
  {
    setErrorOccurred(true)
    errorOccurred = true;
  }

  setSaveClick(false);

  if (!errorOccurred)
  {
    populateDataToSlice(useDispatch, goodReceiptNote);
    setSubmit(true)
  }
}

function populateDataToSlice (useDispatch, goodReceiptNote)
{
  const refinedGoodReceiptNote = {
    description: goodReceiptNote.description.description,
    paymentStatus: goodReceiptNote.paymentStatus.description,
    goodsInStockExpiryTime: goodReceiptNote.goodsInStockExpiryTime.description,
    goodsReceiverUsername: goodReceiptNote.goodsReceiverUsername.description,
    goodsReceiverRawPassword: goodReceiptNote.goodsReceiverRawPassword.description,
    warehousingContractDocumentIdentifier: goodReceiptNote.warehousingContractDocumentIdentifier.description
  };

  useDispatch(setGoodReceiptNote(refinedGoodReceiptNote));
}

function ConfirmDataComponent ({ goodReceiptNoteRedux })
{
  return (<>
    <h2>Confirm Goods Receipt Note Data</h2>
    <p>Please review the goods receipt note data before submitting:</p>
    <div className="confirm-data-container">
      <p><strong>Description:</strong> {goodReceiptNoteRedux?.description}</p>
      <p><strong>Payment Status:</strong> {goodReceiptNoteRedux?.paymentStatus}</p>
      <p><strong>Goods In Stock Expiry Time:</strong> {goodReceiptNoteRedux?.goodsInStockExpiryTime}</p>
      <p><strong>Goods receiver username:</strong>{goodReceiptNoteRedux?.goodsReceiverUsername}</p>
      <p><strong>Warehousing Contract Document Identifier:</strong> {goodReceiptNoteRedux?.warehousingContractDocumentIdentifier}</p>
    </div>
  </>)
}
