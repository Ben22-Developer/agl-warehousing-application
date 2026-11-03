import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSuppliers} from "../../../redux/slice/warehousing-contract/create-contract/SuppliersInformationSlice.js";
import {emailValidator, phoneNumberValidator, wordValidator} from "../../../validator/RegexVaildator.js";
import NextStepParagraph from "./NextStepParagraph.jsx";

export function SuppliersInformationComponent ({ next, setNext })
{

  const[suppliersInformation, setSuppliersInformation] = useState(
      useSelector((state => state.purchaseOrderSuppliersInformation.suppliers)).map((element) => {
        return {name:{description: element.name, error:""}, location:{description: element.location, error:""},
          phoneNumber:{description: element.phoneNumber, error:""}, email:{description: element.email, error:""}};
      })
  )

  console.log(suppliersInformation)

  const dispatch = useDispatch();

  const [saveClick, setSaveClick] = useState(false);

  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    setNext(true);
  }, []);

  const addSupplier = () => {
    setSuppliersInformation([...suppliersInformation,
      {
        name:{description:"", error:""},
        location:{description:"", error:""},
        phoneNumber:{description:"", error:""},
        email:{description:"", error:""}
      }]);
  }

  const removeSupplier = (index) => {
    const newSuppliers = suppliersInformation.filter((_, i) => i !== index);
    setSuppliersInformation(newSuppliers);
    setNext(false);
  }

  const updateSupplierName = (index, name) =>
  {
    const newSuppliers = [...suppliersInformation];
    newSuppliers[index].name.description = name;
    setSuppliersInformation(newSuppliers);
    setNext(false);
  }

  const updateSupplierLocation = (index, location) =>
  {
    const newSuppliers = [...suppliersInformation];
    newSuppliers[index].location.description = location;
    setSuppliersInformation(newSuppliers);
    setNext(false);
  }

  const updateSupplierPhoneNumber = (index, phoneNumber) =>
  {
    const newSuppliers = [...suppliersInformation];
    newSuppliers[index].phoneNumber.description = phoneNumber;
    setSuppliersInformation(newSuppliers);
    setNext(false);
  }

  const updateSupplierEmailAddress = (index, email) =>
  {
    const newSuppliers = [...suppliersInformation];
    newSuppliers[index].email.description = email;
    setSuppliersInformation(newSuppliers);
    setNext(false);
  }

  useEffect(() =>
  {
    if (!saveClick)
      return;

    validateSuppliersInformation(dispatch, suppliersInformation, setErrorOccurred, setSaveClick, setNext);

  }, [saveClick]);

  return(
      <div className="form-section">
        <h2>Suppliers Information</h2>

        {suppliersInformation.map((element, index) => {
          return (<div key={index+1} className="supplier-card">

            <div className="card-header">

              <h3>Supplier {index+1}</h3>

              {
                (suppliersInformation.length > 1) &&
                <button type="button" onClick={() => removeSupplier(index)} className="remove-btn">
                  Remove
                </button>
              }

            </div>

            <div className="form-grid">
              <div className="form-group-container">
                <div className="form-group">
                  <label>Name</label>
                  <input
                      type="text"
                      placeholder="SHIMWA Benjamin"
                      value={element.name.description}
                      onChange={(e) => updateSupplierName(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.name.error}</p>}
              </div>

              <div className="form-group-container">
                <div className="form-group">
                  <label>Location</label>
                  <input
                      type="text"
                      placeholder="Kigali/Kicukiro"
                      value={element.location.description}
                      onChange={(e) => updateSupplierLocation(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.location.error}</p>}
              </div>
              <div className="form-group-container">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                      type="text"
                      placeholder="+250780270994"
                      value={element.phoneNumber.description}
                      onChange={(e) => updateSupplierPhoneNumber(index, e.target.value)}
                      required
                  />
              </div>
                {errorOccurred && <p className="error-message">{element.phoneNumber.error}</p>}
              </div>
              <div className="form-group-container">
                <div className="form-group">
                  <label>Email</label>
                  <input
                      type="email"
                      placeholder="shimwabenjamin@gmail.com"
                      value={element.email.description}
                      onChange={(e) => updateSupplierEmailAddress(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.email.error}</p>}
              </div>
            </div>
          </div>)
        })}

        <div className="flex-row-container">
          {
              (suppliersInformation.length <= 5) &&
              <button type="button" onClick={addSupplier} className="app-btn styled-btn">
                + Add Supplier
              </button>
          }
          <button type="button" className="app-btn styled-btn" onClick={() => {setSaveClick(true); setErrorOccurred(false)} }>Save</button>
        </div>
        <br/>
        {next && <NextStepParagraph />}
      </div>
  )
}


function validateSuppliersInformation (useDispatch, suppliersInformation, setErrorOccurred, setSaveClick, setNext)
{
  let errorOccurred = false;

  suppliersInformation.forEach((supplier) =>
  {
    supplier.name.error = wordValidator(supplier.name.description, "Invalid name provided");
    supplier.location.error = wordValidator(supplier.location.description, "Invalid location provided");
    supplier.phoneNumber.error = phoneNumberValidator(supplier.phoneNumber.description, "Invalid phone number provided");
    supplier.email.error = emailValidator(supplier.email.description ,"Invalid email provided");

    if (supplier.name.error.length !== 0 ||
        supplier.location.error.length !== 0 ||
        supplier.phoneNumber.error.length !== 0 ||
        supplier.email.error.length !== 0)
    {
      setErrorOccurred(true)
      errorOccurred = true;
    }
  })

  setSaveClick(false);

  if (!errorOccurred)
  {
    populateDataToSlice(useDispatch, suppliersInformation);
    setNext(true);
  }
}

function populateDataToSlice (useDispatch, suppliersInformation)
{
  const refinedSuppliersInformation = suppliersInformation.map((supplier) => {
    return { name: supplier.name.description, location: supplier.location.description, phoneNumber: supplier.phoneNumber.description, email: supplier.email.description };
  });

  useDispatch(setSuppliers(refinedSuppliersInformation));
}
