import ContractDocumentIdentifiersComponent from "./ContractDocumentIdentifiers.jsx";
import {useState} from "react";
import SelectedContractDocumentComponent from "./SelectedContractDocumentComponent.jsx";


export const showDocumentIdentifiers = "ShowDocumentIdentifiers";
export const showSelectedDocument = "ShowSelectedDocument";

function ReadContractComponent ()
{
    const [contentToShow, setContentToShow] = useState(showDocumentIdentifiers);

    return(
        <>
            { contentToShow === showDocumentIdentifiers && <ContractDocumentIdentifiersComponent setContentToShow={setContentToShow}/> }
            { contentToShow === showSelectedDocument && <SelectedContractDocumentComponent setContentToShow={setContentToShow}/> }
        </>
    )
}

export default ReadContractComponent;