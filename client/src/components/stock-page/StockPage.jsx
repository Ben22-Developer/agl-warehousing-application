import './StockPage.css'
import {useState} from "react";
import CreateContractComponent from "../contract-page/create-contract-components/CreateContractComponent.jsx";
import ReadContractComponent from "../contract-page/read-contract-components/ReadContractComponent.jsx";
import CreateProductInStockComponent from "./create-stock-component/CreateProductInStockComponent.jsx";
import ReadStockComponent from "./read-stock-component/ReadStockComponent.jsx";
import {useSelector} from "react-redux";
import {ADMIN, AGENT} from "../../role/SystemRoles.js";

const ShowCreateStock = "Create Stock";
const ShowReadStock = "Read Stock";

function StockPage()
{
    const[showStockComponentField, setShowStockComponent] = useState(ShowReadStock);

    const userRole = useSelector(state => state.user.user.role.name);

    function setShowStockComponentHandler (stockComponent)
    {
        if (showStockComponentField === stockComponent)
            return;
        setShowStockComponent(stockComponent);
    }

  return (
      <div className="page-container">

          <div className="page-actions-container">
              <button className="app-button" onClick={() => setShowStockComponentHandler(ShowReadStock)}>
                  My Stock
              </button>

              {(userRole === ADMIN || userRole === AGENT) &&
                  <button className="app-button" onClick={() => setShowStockComponentHandler(ShowCreateStock)}>
                    Add Stock
                  </button>}
        </div>
          {getStockComponentToShow(showStockComponentField)}
      </div>
  )
}

function getStockComponentToShow (showStockComponentField)
{
    if (showStockComponentField === ShowCreateStock)
        return <CreateProductInStockComponent />

    else if (showStockComponentField === ShowReadStock)
        return  <ReadStockComponent />
}

export default StockPage
