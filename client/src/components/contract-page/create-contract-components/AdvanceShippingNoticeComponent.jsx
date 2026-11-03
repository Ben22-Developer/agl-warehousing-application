import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setAdvanceShippingNotice} from "../../../redux/slice/warehousing-contract/create-contract/AdvanceShippingNoticeSlice.js";
import {emailValidator, phoneNumberValidator, wordValidator} from "../../../validator/RegexVaildator.js";
import NextStepParagraph from "./NextStepParagraph.jsx";

export function AdvanceShippingNoticeComponent ({ next, setNext })
{
  const advanceShippingNoticeRedux = useSelector((state => state.advanceShippingNotice));

  const[shippingInformation, setShippingInformation] = useState({
    shipmentNumber:{description: advanceShippingNoticeRedux.shipmentNumber, error:""},
    shippedFromAddress:{description: advanceShippingNoticeRedux.shippedFromAddress, error:""},
    shippedToAddress:{description: advanceShippingNoticeRedux.shippedToAddress, error:""},
    shippingMode:{description: advanceShippingNoticeRedux.shippingMode, error:""},
    shippingDate:{description: advanceShippingNoticeRedux.shippingDate, error:""}
  });

  const[driversInformation, setDriversInformation] = useState(
      advanceShippingNoticeRedux.shippingDriversInformation.map((element) => {
        return {
          name:{description: element.name, error:""},
          phoneNumber:{description: element.phoneNumber, error:""},
          email:{description: element.email, error:""}
        };
      })
  );

  const dispatch = useDispatch();

  const [saveClick, setSaveClick] = useState(false);

  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    setNext(true);
  }, []);

  const addDriver = () => {
    setDriversInformation([...driversInformation,
      {
        name:{description:"", error:""},
        phoneNumber:{description:"", error:""},
        email:{description:"", error:""}
      }]);
  }

  const removeDriver = (index) => {
    const newDrivers = driversInformation.filter((_, i) => i !== index);
    setDriversInformation(newDrivers);
    setNext(false);
  }

  const updateShipmentNumber = (shipmentNumber) =>
  {
    setShippingInformation({...shippingInformation, shipmentNumber:{...shippingInformation.shipmentNumber, description: shipmentNumber}});
    setNext(false);
  }

  const updateShippedFromAddress = (shippedFromAddress) =>
  {
    setShippingInformation({...shippingInformation, shippedFromAddress:{...shippingInformation.shippedFromAddress, description: shippedFromAddress}});
    setNext(false);
  }

  const updateShippedToAddress = (shippedToAddress) =>
  {
    setShippingInformation({...shippingInformation, shippedToAddress:{...shippingInformation.shippedToAddress, description: shippedToAddress}});
    setNext(false);
  }

  const updateShippingMode = (shippingMode) =>
  {
    setShippingInformation({...shippingInformation, shippingMode:{...shippingInformation.shippingMode, description: shippingMode}});
    setNext(false);
  }

  const updateShippingDate = (shippingDate) =>
  {
    setShippingInformation({...shippingInformation, shippingDate:{...shippingInformation.shippingDate, description: shippingDate}});
    setNext(false);
  }

  const updateDriverName = (index, name) =>
  {
    const newDrivers = [...driversInformation];
    newDrivers[index].name.description = name;
    setDriversInformation(newDrivers);
    setNext(false);
  }

  const updateDriverPhoneNumber = (index, phoneNumber) =>
  {
    const newDrivers = [...driversInformation];
    newDrivers[index].phoneNumber.description = phoneNumber;
    setDriversInformation(newDrivers);
    setNext(false);
  }

  const updateDriverEmailAddress = (index, email) =>
  {
    const newDrivers = [...driversInformation];
    newDrivers[index].email.description = email;
    setDriversInformation(newDrivers);
    setNext(false);
  }

  useEffect(() =>
  {
    if (!saveClick)
      return;

    validateAdvanceShippingNotice(dispatch, shippingInformation, driversInformation, setErrorOccurred, setSaveClick, setNext);

  }, [saveClick]);

  console.log(saveClick);
  console.log(shippingInformation)
  console.log(driversInformation)

  return(
      <div className="form-section">
        <h2>Advance Shipping Notice</h2>

        <div className="form-grid">
          <div className="form-group-container">
            <div className="form-group">
              <label>Shipment Number</label>
              <input
                  type="text"
                  placeholder="SHP001"
                  value={shippingInformation.shipmentNumber.description}
                  onChange={(e) => updateShipmentNumber(e.target.value)}
                  required
              />
            </div>
            {errorOccurred && <p className="error-message">{shippingInformation.shipmentNumber.error}</p>}
          </div>

          <div className="form-group-container">
            <div className="form-group">
              <label>Shipped From</label>
              <input
                  type="text"
                  placeholder="Kigali/Kicukiro"
                  value={shippingInformation.shippedFromAddress.description}
                  onChange={(e) => updateShippedFromAddress(e.target.value)}
                  required
              />
            </div>
            {errorOccurred && <p className="error-message">{shippingInformation.shippedFromAddress.error}</p>}
          </div>

          <div className="form-group-container">
            <div className="form-group">
              <label>Shipped To</label>
              <input
                  type="text"
                  placeholder="Musanze/Rubavu"
                  value={shippingInformation.shippedToAddress.description}
                  onChange={(e) => updateShippedToAddress(e.target.value)}
                  required
              />
            </div>
            {errorOccurred && <p className="error-message">{shippingInformation.shippedToAddress.error}</p>}
          </div>

          <div className="form-group-container">
            <div className="form-group">
              <label>Shipping Mode</label>
              <select
                  value={shippingInformation.shippingMode.description}
                  onChange={(e) => updateShippingMode(e.target.value)}
                  required
              >
                <option value="ground">Ground</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
              </select>
            </div>
            {errorOccurred && <p className="error-message">{shippingInformation.shippingMode.error}</p>}
          </div>

          <div className="form-group-container">
            <div className="form-group">
              <label>Shipping Date</label>
              <input
                  type="date"
                  value={shippingInformation.shippingDate.description}
                  onChange={(e) => updateShippingDate(e.target.value)}
                  required
              />
            </div>
            {errorOccurred && <p className="error-message">{shippingInformation.shippingDate.error}</p>}
          </div>
        </div>

        <br/>

        <h3>Shipping Drivers Information</h3>
        {driversInformation.map((element, index) => {
          return (<div key={index+1} className="driver-card">

            <div className="card-header">

              <h4>Driver {index+1}</h4>

              {
                (driversInformation.length > 1) &&
                <button type="button" onClick={() => removeDriver(index)} className="remove-btn">
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
                      placeholder="Driver Name"
                      value={element.name.description}
                      onChange={(e) => updateDriverName(index, e.target.value)}
                      required
                  />
                </div>
                {errorOccurred && <p className="error-message">{element.name.error}</p>}
              </div>

              <div className="form-group-container">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                      type="text"
                      placeholder="+250780270994"
                      value={element.phoneNumber.description}
                      onChange={(e) => updateDriverPhoneNumber(index, e.target.value)}
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
                      placeholder="driver@gmail.com"
                      value={element.email.description}
                      onChange={(e) => updateDriverEmailAddress(index, e.target.value)}
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
              (driversInformation.length <= 5) &&
              <button type="button" onClick={addDriver} className="app-btn styled-btn">
                + Add Driver
              </button>
          }
          <button type="button" className="app-btn styled-btn" onClick={() => {setSaveClick(true); setErrorOccurred(false)} }>Save</button>
        </div>
        <br/>
        {next && <NextStepParagraph />}
      </div>
  )
}


function validateAdvanceShippingNotice (useDispatch, shippingInformation, driversInformation, setErrorOccurred, setSaveClick, setNext)
{
  let errorOccurred = false;

  // Validate shipping information
  shippingInformation.shipmentNumber.error = shippingInformation.shipmentNumber.description.length === 0 ? "Shipment number is required" : "";
  shippingInformation.shippedFromAddress.error = wordValidator(shippingInformation.shippedFromAddress.description, "Invalid shipped from address provided");
  shippingInformation.shippedToAddress.error = wordValidator(shippingInformation.shippedToAddress.description, "Invalid shipped to address provided");
  shippingInformation.shippingMode.error = shippingInformation.shippingMode.description.length === 0 ? "Shipping mode is required" : "";
  shippingInformation.shippingDate.error = shippingInformation.shippingDate.description.length === 0 ? "Shipping date is required" : "";

  if (shippingInformation.shipmentNumber.error.length !== 0 ||
      shippingInformation.shippedFromAddress.error.length !== 0 ||
      shippingInformation.shippedToAddress.error.length !== 0 ||
      shippingInformation.shippingMode.error.length !== 0 ||
      shippingInformation.shippingDate.error.length !== 0)
  {
    setErrorOccurred(true)
    errorOccurred = true;
  }

  // Validate drivers information
  driversInformation.forEach((driver) =>
  {
    driver.name.error = wordValidator(driver.name.description, "Invalid name provided");
    driver.phoneNumber.error = phoneNumberValidator(driver.phoneNumber.description, "Invalid phone number provided");
    driver.email.error = emailValidator(driver.email.description, "Invalid email provided");

    if (driver.name.error.length !== 0 ||
        driver.phoneNumber.error.length !== 0 ||
        driver.email.error.length !== 0)
    {
      setErrorOccurred(true)
      errorOccurred = true;
    }
  })

  setSaveClick(false);

  if (!errorOccurred)
  {
    populateDataToSlice(useDispatch, shippingInformation, driversInformation);
    setNext(true);
  }
}

function populateDataToSlice (useDispatch, shippingInformation, driversInformation)
{
  const refinedShippingInformation = {
    shipmentNumber: shippingInformation.shipmentNumber.description,
    shippedFromAddress: shippingInformation.shippedFromAddress.description,
    shippedToAddress: shippingInformation.shippedToAddress.description,
    shippingMode: shippingInformation.shippingMode.description,
    shippingDate: shippingInformation.shippingDate.description,
    shippingDriversInformation: driversInformation.map((driver) => {
      return {
        name: driver.name.description,
        phoneNumber: driver.phoneNumber.description,
        email: driver.email.description
      };
    })
  };

  useDispatch(setAdvanceShippingNotice(refinedShippingInformation));
}
