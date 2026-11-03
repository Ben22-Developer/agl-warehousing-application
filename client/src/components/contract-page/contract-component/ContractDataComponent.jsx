import "../ContractPage.css"

function ContractDataComponent ({suppliersInformation, purchaseOrderProducts, advanceShippingNotice, goodsInStockReceiptNote=null})
{

    return (
        <div className="contract-data-html">
            <div className="data-section">
                <h3>Purchase Order</h3>

                <SuppliersSubSection suppliersInformation={suppliersInformation}/>

                <PurchaseOrderSubSection purchaseOrderProducts={purchaseOrderProducts}/>

                <AdvanceShippingNoticeSubSection advanceShippingNotice={advanceShippingNotice}/>

                {goodsInStockReceiptNote !== null && <GoodsInStockReceiptNoteSubSection goodsInStockReceiptNote={goodsInStockReceiptNote}/> }
            </div>


        </div>
    )
}

function SuppliersSubSection ({suppliersInformation})
{
    return (
        <div className="data-subsection">
            <h4>Suppliers Information</h4>
            {suppliersInformation.map((supplier, index) => (
                <div key={index} className="data-item">
                    <span className="data-label">Supplier {index + 1}:</span>
                    <div className="data-details">
                        <p><strong>Name:</strong> {supplier.name}</p>
                        <p><strong>Location:</strong> {supplier.location}</p>
                        <p><strong>Phone:</strong> {supplier.phoneNumber}</p>
                        <p><strong>Email:</strong> {supplier.email}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

function PurchaseOrderSubSection ({purchaseOrderProducts})
{
    return (
        <div className="data-subsection">
            <h4>Purchase Order Products</h4>
            {purchaseOrderProducts.map((product, index) => (
                <div key={index} className="data-item">
                    <span className="data-label">Product {index + 1}:</span>
                    <div className="data-details">
                        <p><strong>Code:</strong> {product.code}</p>
                        <p><strong>Name:</strong> {product.name}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        <p><strong>Weight:</strong> {product.weight} kg</p>
                        <p><strong>Unit Price:</strong> {product.unitPrice}</p>
                        <p><strong>Description:</strong> {product.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

function AdvanceShippingNoticeSubSection ({advanceShippingNotice})
{
    return (
        <div className="data-section">
            <h3>Advance Shipping Notice</h3>
            <div className="data-subsection">
                <h4>Shipping Details</h4>
                <div className="data-details">
                    <p><strong>Shipment Number:</strong> {advanceShippingNotice.shipmentNumber}</p>
                    <p><strong>Shipped From:</strong> {advanceShippingNotice.shippedFromAddress}</p>
                    <p><strong>Shipped To:</strong> {advanceShippingNotice.shippedToAddress}</p>
                    <p><strong>Shipping Mode:</strong> {advanceShippingNotice.shippingMode}</p>
                    <p><strong>Shipping Date:</strong> {advanceShippingNotice.shippingDate}</p>
                </div>
            </div>

            <div className="data-subsection">
                <h4>Shipping Drivers Information</h4>
                {advanceShippingNotice.shippingDriversInformation.map((driver, index) => (
                    <div key={index} className="data-item">
                        <span className="data-label">Driver {index + 1}:</span>
                        <div className="data-details">
                            <p><strong>Name:</strong> {driver.name}</p>
                            <p><strong>Phone:</strong> {driver.phoneNumber}</p>
                            <p><strong>Email:</strong> {driver.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function GoodsInStockReceiptNoteSubSection ({goodsInStockReceiptNote})
{
    return (
        <div className="data-section">
            <h3>Goods Receipt</h3>
            <div className="data-subsection">
                <h4>Goods Received In Stock</h4>
                {goodsInStockReceiptNote.productInStocktList.map((product, index) => (
                    <div key={index} className="data-item">
                        <span className="data-label">Product {index + 1}:</span>
                        <div className="data-details">
                            <p><strong>Code:</strong> {product.code}</p>
                            <p><strong>Name:</strong> {product.name}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><strong>Weight:</strong> {product.weight} kg</p>
                            <p><strong>Storage location:</strong> {product.storageLocation}</p>
                            <p><strong>Description:</strong> {product.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-row-container"><h3>Received on:</h3> <p> {goodsInStockReceiptNote.receivedOn}</p></div>
            <div className="flex-row-container"><h3>Received by:</h3> <p>{goodsInStockReceiptNote.user.role.name} {goodsInStockReceiptNote.user.name}</p></div>
        </div>
    )
}

export default ContractDataComponent;