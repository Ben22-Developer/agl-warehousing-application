import {useState} from "react";
import ImageComponent from "../image/ImageComponent";

function ImageCarousel ({ images, setParentCurrentImageIndex=null })
{
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    function updateCurrentImage (num) {

        setCurrentImageIndex(currentImageIndex + num);
        setCurrentImageIndex(currentImageIndex + num);

        if (setParentCurrentImageIndex != null) {
            setParentCurrentImageIndex(currentImageIndex + num);
        }
    }

    if (images == null || images.length <= 0) {
        return <div className="no-content-paragraph">No Image available</div>;
    }

    return(
        <div className="carousel">

            <button
                className="carousel-nav-btn prev"
                onClick={() => updateCurrentImage(-1)}
                disabled={currentImageIndex <= 0}
            >
                ‹
            </button>

            <div className="carousel-content">
                {images[currentImageIndex] && (
                    <ImageComponent
                        url={images[currentImageIndex].cloudinaryUrl}
                        alt='Product in stock image'
                        className="product-image"
                    />
                )}


                <p className="image-carousel-counter">{currentImageIndex+1}/{images.length}</p>
            </div>

            <button
                className="carousel-nav-btn next"
                onClick={() => updateCurrentImage( 1)}
                disabled={currentImageIndex >= images.length-1}
            >
                ›
            </button>
        </div>
    )
}

export default ImageCarousel;