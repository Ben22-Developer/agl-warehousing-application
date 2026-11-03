import '../create-stock-component/CreateStockComponent.css';
import ImageComponent from "../../image/ImageComponent";

function ProductsInStockDataComponent({ products }) {

    console.log(products);

    if (!products || products.length === 0) {
        return <p className="no-content-paragraph">No products to display</p>
    }

    return (
        <div className="create-stock-container">
            <h2 className="create-title">Products in Stock</h2>
            
            {products.map((product, index) => (
                <div key={index} className="form-section product-card">
                    <ProductHeader productIndex={index} />
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                value={product.name}
                                className="form-input"
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Code</label>
                            <input
                                type="text"
                                value={product.code}
                                className="form-input"
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                value={product.quantity}
                                className="form-input"
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Weight (kg)</label>
                            <input
                                type="number"
                                value={product.weight}
                                className="form-input"
                                step="0.1"
                                disabled
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Storage Location</label>
                            <input
                                type="text"
                                value={product.storageLocation}
                                className="form-input"
                                disabled
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Description</label>
                            <textarea
                                value={product.description}
                                className="form-textarea"
                                rows="3"
                                disabled
                            />
                        </div>

                        <div className="form-group full-width">
                            <h3 className="section-title">Product Images</h3>
                            <div className="images-container">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((image, imgIndex) => (
                                        <div key={imgIndex} className="image-preview">
                                            <ImageComponent 
                                                url={image.url} 
                                                alt={`Product ${index + 1} - Image ${imgIndex + 1}`}
                                                className="product-image"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-images">No images available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProductHeader({ productIndex }) {
    return (
        <div className="product-card-header">
            <h3 className="section-title">Product {productIndex + 1}</h3>
        </div>
    );
}

export default ProductsInStockDataComponent;
