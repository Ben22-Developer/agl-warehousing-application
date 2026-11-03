import { useEffect, useState } from "react";
import LoaderComponent, { LoaderMediumSize } from "../loader/LoaderComponent";
import errorImage from "../../assets/error.jpg";
import "./ImageComponent.css";

export default function ImageComponent({ url, className, alt }) {
    const [imageLoadSuccess, setImageLoadSuccess] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    useEffect(() => {
        const image = new Image();

        image.src = url;

        image.onerror = () => {
            setImageLoadError(true);
        }

        image.onload = () => {
            setImageLoadSuccess(true);
        }

    }, [url]);


    if (imageLoadSuccess) {
        return <img src={url} alt={alt || "Image"} className={className} />
    }

    if (imageLoadError) {
        return <img src={errorImage} alt={alt || "Default image"} className={className} />
    }

    return <LoaderComponent size={LoaderMediumSize} />;
}
