import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setProducts} from "../../../redux/slice/warehousing-contract/create-contract/ProductsSlice.js";
import {sentenceValidator, wordValidator} from "../../../validator/RegexVaildator.js";
import NextStepParagraph from "./NextStepParagraph.jsx";

export function PurchaseOrderProductComponent ({ next, setNext })
{
  const[productsInformation, setProductsInformation] = useState(
      useSelector((state => state.purchaseOrderProducts.products)).map((element) => {
        return {
          code:{description: element.code, error:""},
          name:{description: element.name, error:""},
          quantity:{description: element.quantity, error:""},
          weight:{description: element.weight, error:""},
          unitPrice:{description: element.unitPrice, error:""},
          description:{description: element.description, error:""}
        };
      })
  );

  const dispatch = useDispatch();

  const [saveClick, setSaveClick] = useState(false);

  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    setNext(true);
  }, []);

  const addProduct = () => {
    setProductsInformation([...productsInformation,
      {
        code:{description:"", error:""},
        name:{description:"", error:""},
        quantity:{description:"", error:""},
        weight:{description:"", error:""},
        unitPrice:{description:"", error:""},
        description:{description:"", error:""}
      }]);
  }

  const removeProduct = (index) => {
    const newProducts = productsInformation.filter((_, i) => i !== index);
    setProductsInformation(newProducts);
    setNext(false);
  }

  const updateProductCode = (index, code) =>
  {
    const newProducts = [...productsInformation];
    newProducts[index].code.description = code;
    setProductsInformation(newProducts);
    setNext(false);
  }

  const updateProductName = (index, name) =>
  {
    const newProducts = [...productsInformation];
    newProducts[index].name.description = name;
    setProductsInformation(newProducts);
    setNext(false);
  }

  const updateProductQuantity = (index, quantity) =>
  {
    const newProducts = [...productsInformation];
    newProducts[index].quantity.description = quantity;
    setProductsInformation(newProducts);
    setNext(false);
  }

  const updateProductWeight = (index, weight) =>
  {
    const newProducts = [...productsInformation];
    newProducts[index].weight.description = weight;
    setProductsInformation(newProducts);
    setNext(false);
  }

  const updateProductUnitPrice = (index, unitPrice) =>
  {
    const newProducts = [...productsInformation];
    newProducts[index].unitPrice.description = unitPrice;
    setProductsInformation(newProducts);
    setNext(false);
  }

  const updateProductDescription = (index, description) =>
  {
    const newProducts = [...productsInformation];
    newProducts[index].description.description = description;
    setProductsInformation(newProducts);
    setNext(false);
  }

  useEffect(() =>
  {
    if (!saveClick)
      return;

    validateProductsInformation(dispatch, productsInformation, setErrorOccurred, setSaveClick, setNext);

  }, [saveClick]);

  console.log(saveClick);
  console.log(productsInformation)

  return(
      <div className="form-section">
        <h2>Purchase Order Products</h2>

        {productsInformation.map((element, index) => {
          return (<div key={index+1} className="product-card">

            <div className="card-header">

              <h3>Product {index+1}</h3>

              {
                (productsInformation.length > 1) &&
                <button type="button" onClick={() => removeProduct(index)} className="remove-btn">
                  Remove
                </button>
              }

            </div>

            <div className="form-grid">
              <div className="form-group-container">
                <div className="form-group">
                  <label>Code</label>
                  <input
                      type="text"
                      placeholder="PRD001"
                      value={element.code.description}
                      onChange={(e) => updateProductCode(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.code.error}</p>}
              </div>

              <div className="form-group-container">
                <div className="form-group">
                  <label>Name</label>
                  <input
                      type="text"
                      placeholder="Product Name"
                      value={element.name.description}
                      onChange={(e) => updateProductName(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.name.error}</p>}
              </div>

              <div className="form-group-container">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                      type="number"
                      placeholder="100"
                      value={element.quantity.description}
                      onChange={(e) => updateProductQuantity(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.quantity.error}</p>}
              </div>

              <div className="form-group-container">
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                      type="number"
                      step="0.1"
                      placeholder="50.5"
                      value={element.weight.description}
                      onChange={(e) => updateProductWeight(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.weight.error}</p>}
              </div>

              <div className="form-group-container">
                <div className="form-group">
                  <label>Unit Price</label>
                  <input
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      value={element.unitPrice.description}
                      onChange={(e) => updateProductUnitPrice(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.unitPrice.error}</p>}
              </div>

              <div className="form-group-container full-width">
                <div className="form-group">
                  <label>Description</label>
                  <input
                      type="text"
                      placeholder="Product description"
                      value={element.description.description}
                      onChange={(e) => updateProductDescription(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.description.error}</p>}
              </div>
            </div>
          </div>)
        })}

        <div className="flex-row-container">
          {
              (productsInformation.length <= 10) &&
              <button type="button" onClick={addProduct} className="app-btn styled-btn">
                + Add Product
              </button>
          }
          <button type="button" className="app-btn styled-btn" onClick={() => {setSaveClick(true); setErrorOccurred(false)} }>Save</button>
        </div>
        <br/>
        {next && <NextStepParagraph />}
      </div>
  )
}


function validateProductsInformation (useDispatch, productsInformation, setErrorOccurred, setSaveClick, setNext)
{
  let errorOccurred = false;

  productsInformation.forEach((product) =>
  {
    product.code.error = product.code.description.length === 0 ? "Code is required" : "";
    product.name.error = wordValidator(product.name.description, "Invalid name provided");
    product.quantity.error = product.quantity.description.length === 0 || parseFloat(product.quantity.description) <= 0 ? "Invalid quantity provided" : "";
    product.weight.error = product.weight.description.length === 0 || parseFloat(product.weight.description) <= 0 ? "Invalid weight provided" : "";
    product.unitPrice.error = product.unitPrice.description.length === 0 || parseFloat(product.unitPrice.description) <= 0 ? "Invalid unit price provided" : "";
    product.description.error = sentenceValidator(product.description.description, "Description is required");

    if (product.code.error.length !== 0 ||
        product.name.error.length !== 0 ||
        product.quantity.error.length !== 0 ||
        product.weight.error.length !== 0 ||
        product.unitPrice.error.length !== 0 ||
        product.description.error.length !== 0)
    {
      setErrorOccurred(true)
      errorOccurred = true;
    }
  })

  setSaveClick(false);

  if (!errorOccurred)
  {
    populateDataToSlice(useDispatch, productsInformation);
    setNext(true);
  }
}

function populateDataToSlice (useDispatch, productsInformation)
{
  const refinedProductsInformation = productsInformation.map((product) => {
    return {
      code: product.code.description,
      name: product.name.description,
      quantity: product.quantity.description,
      weight: product.weight.description,
      unitPrice: product.unitPrice.description,
      description: product.description.description
    };
  });

  useDispatch(setProducts(refinedProductsInformation));
}
