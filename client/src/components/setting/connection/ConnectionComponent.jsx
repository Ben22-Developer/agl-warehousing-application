import {useDispatch, useSelector} from "react-redux";
import {testConnection, setTestConnectionSliceOnFetch, setTestConnectionSliceOnFetchError, setTestConnectionSliceOnFetchSuccess} from "../../../redux/slice/connection-test/TestConnectionSlice.js";
import LoaderComponent, {LoaderSmallSize} from "../../loader/LoaderComponent.jsx";

const ConnectionTesting = "testing"
const ConnectionSuccess = "success"
const ConnectionFailed = "failed"

function ConnectionComponent ()
{
    const dispatch = useDispatch();
    const onFetch = useSelector(state => state.testConnection.onFetch)
    const onFetchError = useSelector(state => state.testConnection.onFetchError)
    const onFetchSuccess = useSelector(state => state.testConnection.onFetchSuccess)

    const connectionStatus = getConnectionStatus(onFetch, onFetchError, onFetchSuccess);

    const handleConnectionTest = () => {

        if (onFetch)
            return;

        dispatch(testConnection());
    };

    return (
        <div className="connection-test-li-container">
            <li className={`li-item ${onFetch ? 'disable' : ''}`} onClick={handleConnectionTest}>
                {onFetch ? "Loading" : "ConnectionComponent Test"}
            </li>
            <ConnectionStatus connectionStatus={connectionStatus} />
        </div>
    )
}

function ConnectionStatus ({ connectionStatus }) {

    switch (connectionStatus) {
        case ConnectionTesting:
            return <span className="status-indicator testing"><LoaderComponent size={LoaderSmallSize}/></span>;
        case ConnectionSuccess:
            return <span className="status-indicator success">✅</span>;
        case ConnectionFailed:
            return <span className="status-indicator failed">❌</span>;
        default:
            return <span className="status-indicator idle">⚪</span>;
    }
}

function getConnectionStatus(onFetch, onFetchError, onFetchSuccess)
{
    if (!onFetch && !onFetchError && !onFetchSuccess)
        return ""

    if (onFetch)
        return ConnectionTesting

    if (onFetchError)
        return ConnectionFailed

    if (onFetchSuccess)
        return ConnectionSuccess
}


export default ConnectionComponent;