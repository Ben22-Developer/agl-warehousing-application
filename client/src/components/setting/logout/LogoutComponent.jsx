import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {SERVER_AUTHORIZATION_CODE_EXCHANGE, SERVER_LOGIN} from "../../../path/ServerPath.js";
import ModalComponent from "../../modal/ModalComponent.jsx";
import LoaderComponent, {LoaderSmallSize} from "../../loader/LoaderComponent.jsx";
import {resetUser} from "../../../redux/slice/user/UserSlice.js";
import {logout, resetLogoutState} from "../../../redux/slice/auth/LogoutSlice.js";
import {clearToken} from "../../../redux/slice/auth/TokenSlice.js";

function LogoutComponent()
{
    const dispatch = useDispatch();
    const onFetch = useSelector(state => state.logout.onFetch)
    const onFetchError = useSelector(state => state.logout.onFetchError)
    const onFetchSuccess = useSelector(state => state.logout.onFetchSuccess)

    const [loggingOutError, setLoggingOutError] = useState(false)

    function handleLogout ()
    {
        if (onFetch)
            return;

        dispatch(logout())
    }

    useEffect(() =>
    {
        if (onFetchSuccess)
            window.location.replace(SERVER_LOGIN);

        return () =>
        {
            if (!onFetchSuccess)
                return;

            dispatch(clearToken());
            dispatch(resetUser());
        }
    }, [onFetchSuccess]);

    useEffect(() =>
    {
        if (!onFetchError)
            return;

        setLoggingOutError(true)
        dispatch(resetLogoutState());
    }, [onFetchError]);

    if (loggingOutError)
    {
        return <ModalComponent isOpen={loggingOutError} onClose={() => setLoggingOutError(false)} children={<p>An error occurred while logging you out</p>}/>
    }

    return(
    <li className={`li-item ${onFetch ? 'disable' : ''}`} onClick={handleLogout}>
        {onFetch ? <LoaderComponent size={LoaderSmallSize}/> : <p>Log Out</p>}
    </li>)
}

export default LogoutComponent;