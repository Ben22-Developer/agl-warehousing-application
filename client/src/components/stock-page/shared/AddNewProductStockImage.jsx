import ImageComponent from "../../image/ImageComponent";

function AddNewProductStockImage({ getImages, addImageAction, removeImageAction, label = "Add New Images", maximum=5 })
{
    // const dispatch = useDispatch();
    const images = getImages();

    const handleAddNewImages = (e) =>
    {
        const file = Array.from(e.target.files)[0];

        const fileReader = new FileReader();

        fileReader.onload = e =>
        {
            const result = e.target.result;
            addImageAction({ base64String: result });
        }

        fileReader.readAsDataURL(file)
    };

    const handleDeleteNewImage = (index) => {
        removeImageAction({ id: index });
    };

    // console.log(images);

    return (
        <div className="add-images-section">
            <label className="form-label">{label} (maximum {maximum})</label>
            {images.length < 5 && <input
                type="file"
                accept="image/*"
                onChange={handleAddNewImages}
                className="file-input"
            />}

            {images.length > 0 && (
                <div className="new-images-preview">
                    <h4 className="preview-title">New Images to Add:</h4>
                    {images.map((item, index) =>{
                        return (
                        <div key={index} className="new-image-item">
                            <ImageComponent url={item.base64String} alt={`New image ${index + 1}`} className="preview-image"/>
                            <span className="image-name">{index+1}</span>
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => handleDeleteNewImage(index)}
                        >
                            Remove
                        </button>
                    </div>)
                    })}
                </div>
            )}
        </div>
    )
}

export default AddNewProductStockImage;
