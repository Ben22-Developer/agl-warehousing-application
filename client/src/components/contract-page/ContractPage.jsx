import './ContractPage.css'
import {useState} from "react";
import CreateContractComponent from "./create-contract-components/CreateContractComponent.jsx";
import ReadContractComponent from "./read-contract-components/ReadContractComponent.jsx";


const ShowCreateContract = "Create Contract";
const ShowReadContract = "Read Contract";


function ContractPage()
{
    const[showContractComponentField, setShowContractComponent] = useState(ShowReadContract);

    function setShowContractComponentHandler (contractComponent)
    {
        if (showContractComponentField === contractComponent)
            return;
        setShowContractComponent(contractComponent);
    }

  return (
    <div className="page-container">

      <div className="page-actions-container">

          <button className="app-button" onClick={() => setShowContractComponentHandler(ShowReadContract)}>
              My Contracts
          </button>

          <button className="app-button" onClick={() => setShowContractComponentHandler(ShowCreateContract)}>
              Add Contract
          </button>
      </div>

        {getContractComponentToShow(showContractComponentField)}

    </div>
  )
}

function getContractComponentToShow (showContractComponentField)
{
    if (showContractComponentField === ShowCreateContract)
        return <CreateContractComponent />

    else if (showContractComponentField === ShowReadContract)
        return  <ReadContractComponent />
}

export default ContractPage
