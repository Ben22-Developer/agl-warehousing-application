import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setContractData, submitContractData, resetContractSubmission } from '../../../redux/slice/warehousing-contract/create-contract/SubmitContractDataSlice.js';
import '../ContractPage.css';
import { SuppliersInformationComponent } from './PurchaseOrderSupplierComponent.jsx';
import { PurchaseOrderProductComponent } from './PurchaseOrderProductComponent.jsx';
import { AdvanceShippingNoticeComponent } from './AdvanceShippingNoticeComponent.jsx';
import MultiStepBar from "../../multi-step-bar/MultiStepBar.jsx";
import ModalComponent from "../../modal/ModalComponent.jsx";
import ContractDataComponent from "../contract-component/ContractDataComponent.jsx";
import LoaderComponent from "../../loader/LoaderComponent.jsx";
import ServerErrorMessageComponent from "../../server-messages/ServerErrorMessageComponent.jsx";
import ServerSuccessMessageComponent from "../../server-messages/ServerSuccessMessageComponent.jsx";
import MissingOnCreateFieldsComponent from "../../create-component/MissingOnCreateFieldsComponent.jsx";

const warehousingContractSteps = [
  {node:1, label:"Supplier\nInformation"}, {node:2, label:"Products"}, {node:3, label:"Shipping"}
];


function CreateContractComponent() {

  const dispatch = useDispatch();

  const advanceShippingNotice = useSelector((state) => state.advanceShippingNotice);

  const purchaseOrderSuppliersInformation = useSelector((state) => state.purchaseOrderSuppliersInformation);

  const purchaseOrderProducts = useSelector((state) => state.purchaseOrderProducts);

  const contractData = useSelector((state) => state.submitContractData);

  const [completedSteps, setCompletedSteps] = useState(1);

  const[next, setNext] = useState(false);

  const [showMissingDataModal, setShowMissingDataModal] = useState(false);
  const [showConfirmDataModal, setShowConfirmDataModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const setCompletedStepsHandler = (num) => {
    setCompletedSteps(completedSteps + num);
  };

  useEffect(() => {
    if (!contractData.submitSuccess) {
      return
    }
    setShowConfirmDataModal(false);
    setShowSuccessModal(true);
    dispatch(resetContractSubmission());

  }, [contractData.submitSuccess, dispatch]);

  useEffect(() => {
    if (contractData.submitError) {
      setShowConfirmDataModal(false);
      setShowErrorModal(true);
    }
  }, [contractData.submitError, dispatch]);

  const handleValidateAndPrepareContractData = () => {
    const missingFieldsList = [];

    validateSubmittedData(purchaseOrderSuppliersInformation, missingFieldsList, purchaseOrderProducts, advanceShippingNotice);

    if (missingFieldsList.length > 0) {
      setMissingFields(missingFieldsList);
      setShowMissingDataModal(true);
      return;
    }

    const contractDataPayload = {
      purchaseOrder: {
        suppliersInformation: purchaseOrderSuppliersInformation.suppliers,
        purchaseOrderProducts: purchaseOrderProducts.products
      },
      advanceShippingNotice: {
        shipmentNumber: advanceShippingNotice.shipmentNumber,
        shippingDriversInformation: advanceShippingNotice.shippingDriversInformation,
        shippedFromAddress: advanceShippingNotice.shippedFromAddress,
        shippedToAddress: advanceShippingNotice.shippedToAddress,
        shippingMode: advanceShippingNotice.shippingMode,
        shippingDate: advanceShippingNotice.shippingDate
      }
    };

    dispatch(setContractData(contractDataPayload));
    setShowConfirmDataModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidateAndPrepareContractData();
  };

  const handleConfirmContract = () => {
    dispatch(submitContractData(contractData.contractData));
    setShowConfirmDataModal(false)
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };


  return (
    <div className="create-contract-container">
      {contractData.isSubmitting && <ModalComponent isOpen={contractData.isSubmitting} onClose={() => alert("We are currently creating your contract please be patient.")} children={<LoaderComponent size="large" />}/>}

      <h1>Create Contract</h1>

      <form onSubmit={handleSubmit} className="contract-form">

        {/* Suppliers Section */}
        {completedSteps === 1 && <SuppliersInformationComponent next={next} setNext={setNext} />}

        {/* Products Section */}
        {completedSteps === 2 && <PurchaseOrderProductComponent next={next} setNext={setNext} />}

        {/* Shipping Section */}
        {completedSteps === 3 && <AdvanceShippingNoticeComponent next={next} setNext={setNext} /> }

        {completedSteps < warehousingContractSteps.length+1 && <p className="save-message">Before moving to the next step, first click 'Save'</p>}

        <MultiStepBar steps={warehousingContractSteps}
                      completedSteps={completedSteps}
                      setCompletedStepsHandler={setCompletedStepsHandler}
                      previousButtonDisable={completedSteps === 1}
                      nextButtonDisable={completedSteps > warehousingContractSteps.length || !next}
                      setNext={setNext}
        />

        {completedSteps === warehousingContractSteps.length+1 &&
            <div className="form-actions">
              <button className="submit-btn" disabled={contractData.isSubmitting}>Create Contract</button>
            </div>
        }
      </form>

      <ModalComponent
        isOpen={showMissingDataModal}
        onClose={() => setShowMissingDataModal(false)}
        children={<MissingOnCreateFieldsComponent missingFields={missingFields} />}
      />

      <ModalComponent
        isOpen={showConfirmDataModal}
        onClose={() => setShowConfirmDataModal(false)}
        onConfirm={handleConfirmContract}
        children={<ConfirmOnSubmitDataComponent contractDataForConfirm={contractData.contractData} />}
      />

      <ModalComponent
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        children={<ServerErrorMessageComponent  title = {"Submission Error"} message = {"Failed to submit contract data:"} errorMessage={contractData.submitErrorMessage} />}
      />

      <ModalComponent
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        children={<ServerSuccessMessageComponent title = {"Contract Created Successfully"} message = {"Your warehousing contract has been successfully created and submitted."} />}
      />

    </div>
  );
}

function validateSubmittedData (purchaseOrderSuppliersInformation, missingFieldsList, purchaseOrderProducts, advanceShippingNotice)
{
  if (!purchaseOrderSuppliersInformation.suppliers ||
      purchaseOrderSuppliersInformation.suppliers.length === 0 ||
      purchaseOrderSuppliersInformation.suppliers[0].name.length === 0)
  {
    missingFieldsList.push('Suppliers Information');
  }

  if (!purchaseOrderProducts.products ||
      purchaseOrderProducts.products.length === 0 ||
      purchaseOrderProducts.products[0].name.length === 0)
  {
    missingFieldsList.push('Purchase Order Products');
  }

  if (!advanceShippingNotice.shipmentNumber || advanceShippingNotice.shipmentNumber.trim() === '')
  {
    missingFieldsList.push('Shipment Number');
  }

  if (!advanceShippingNotice.shippedFromAddress || advanceShippingNotice.shippedFromAddress.trim() === '') {
    missingFieldsList.push('Shipped From Address');
  }

  if (!advanceShippingNotice.shippedToAddress || advanceShippingNotice.shippedToAddress.trim() === '') {
    missingFieldsList.push('Shipped To Address');
  }

  if (!advanceShippingNotice.shippingDate || advanceShippingNotice.shippingDate.trim() === '') {
    missingFieldsList.push('Shipping Date');
  }

  if (!advanceShippingNotice.shippingDriversInformation ||
      advanceShippingNotice.shippingDriversInformation.length === 0 ||
      advanceShippingNotice.shippingDriversInformation[0].name.length === 0)
  {
    missingFieldsList.push('Shipping Drivers Information');
  }
}


function ConfirmOnSubmitDataComponent ({ contractDataForConfirm })
{
  return (<>
    <h2>Confirm Contract Data</h2>
    <p>Please review the contract data before submitting:</p>

    <ContractDataComponent suppliersInformation={contractDataForConfirm.purchaseOrder.suppliersInformation}
                           purchaseOrderProducts={contractDataForConfirm.purchaseOrder.purchaseOrderProducts}
                           advanceShippingNotice={contractDataForConfirm.advanceShippingNotice}
    />
  </>)
}



export default CreateContractComponent;