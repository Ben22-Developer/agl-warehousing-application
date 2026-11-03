import "./loader-style.css"

export const LoaderSmallSize = "small";

export const LoaderMediumSize = "medium";

export const LoaderLargeSize = "large";

function LoaderComponent ({size})
{
    return <div className={`loader ${getLoaderClassName(size)}`}></div>
}


function getLoaderClassName (size)
{
    switch (size) {
        case LoaderSmallSize:
            return "small";
        case LoaderMediumSize:
            return "medium";
       case LoaderLargeSize:
           return "large";
       default:
           return "large";
    }
}

export default LoaderComponent;

