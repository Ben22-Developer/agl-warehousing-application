import SelectComponent from "../../select/SelectComponent.jsx";

export function GoodReceiptNoteFormFields ({
  formData, 
  updateDescription, 
  updatePaymentStatus, 
  updateGoodsInStockExpiryTime,
  errorOccurred,
})
{
  return (
    <>
      <div className="form-group-container">
        <div className="form-group">
          <label>Description</label>
          <input
              type="text"
              placeholder="Goods receipt description"
              value={formData.description.description}
              onChange={(e) => updateDescription(e.target.value)}
              required
          />
        </div>
        {errorOccurred && <p className="error-message">{formData.description.error}</p>}
      </div>

      <div className="form-group-container">
        <div className="form-group">
          <label>Payment Status</label>

          <SelectComponent items={["paid", "half paid", "unpaid"]} setSelected={updatePaymentStatus} placeholder="Payment status" className="select-options-absolute"/>
        {errorOccurred && <p className="error-message">{formData.paymentStatus.error}</p>}
        </div>
      </div>

      <div className="form-group-container">
        <div className="form-group">
          <label>Goods In Stock Expiry Time</label>
          <input
              type="datetime-local"
              value={formData.goodsInStockExpiryTime.description}
              onChange={(e) => updateGoodsInStockExpiryTime(e.target.value)}
              required
          />
        </div>
        {errorOccurred && <p className="error-message">{formData.goodsInStockExpiryTime.error}</p>}
      </div>

      <div className="form-group-container">
        <div className="form-group">
          <label>Warehousing Contract Document Identifier</label>
          <input
              disabled={true}
              type="text"
              placeholder="Contract document identifier"
              value={formData.warehousingContractDocumentIdentifier.description}
              required
          />
        </div>
        {errorOccurred && <p className="error-message">{formData.warehousingContractDocumentIdentifier.error}</p>}
      </div>
    </>
  );
}
