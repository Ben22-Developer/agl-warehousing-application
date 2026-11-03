import LoaderComponent, {LoaderMediumSize, LoaderSmallSize} from "../loader/LoaderComponent.jsx";
import "./auth-code-component.css"
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {
    ACCESS_TOKEN,
    fetchToken, refreshAccessToken,
    setTokenSliceOnFetch,
    setTokenSliceOnFetchError, setTokenSliceOnFetchErrorMessage,
    setTokenSliceOnFetchSuccess
} from "../../redux/slice/auth/TokenSlice.js";
import {useNavigate} from "react-router-dom";
import {ROUTE_HOME, ROUTE_STOCK} from "../../path/ClientPath.js";
import {SERVER_LOGIN} from "../../path/ServerPath.js";
import {fetchUserData, resetUser} from "../../redux/slice/user/UserSlice.js";


function RedirectingComponent ({ refreshTokenFetch=false }) {

    const dispatch = useDispatch();

    const onFetchError = useSelector(state => state.token.onFetchError);

    const onFetchSuccess = useSelector(state => state.token.onFetchSuccess);

    const onFetch = useSelector(state => state.token.onFetch);

    const onFetchErrorMessage = useSelector(state => state.token.onFetchErrorMessage);

    const onFetchUser = useSelector(state => state.user.onFetch);

    const onFetchErrorUser = useSelector(state => state.user.onFetchError);

    const onFetchSuccessUser = useSelector(state => state.user.onFetchSuccess);

    const onFetchErrorMessageUser = useSelector(state => state.user.onFetchErrorMessage);

    const x = useSelector(state => state.user)

    const navigate = useNavigate();

    useEffect(() =>
    {
        if (ACCESS_TOKEN === null)
            fetchTokens(dispatch, refreshTokenFetch)
    }, [])

    useEffect(() =>
    {
        if (!onFetchSuccess) {
            return;
        }

        dispatch(fetchUserData());

    }, [onFetchSuccess]);

    useEffect(() =>
    {
        if (!onFetchSuccessUser) {
            return;
        }

        afterTokenNavigate(navigate, refreshTokenFetch);

    }, [onFetchSuccessUser]);




    return <div className="redirecting-container">
        {onFetch || onFetchUser && <p className="redirecting-paragraph">Redirecting</p>}
        {onFetch || onFetchUser && <LoaderComponent size={LoaderMediumSize}/>}

        {onFetchError && !refreshTokenFetch && <p className="error-message">{onFetchErrorMessage}</p>}
        {onFetchError &&
            <button
                className="app-btn styled-btn"
                onClick={() => window.location.href=SERVER_LOGIN}>
                Login</button>
        }

        {onFetchErrorUser && <p className="error-message">{onFetchErrorMessageUser}</p>}
        {onFetchSuccess && onFetchErrorUser &&
            <button
                className="app-btn styled-btn"
                onClick={() => { dispatch(resetUser()); dispatch(fetchUserData()); }}>
                Re-try again
            </button>
        }

    </div>
}

function fetchTokens (dispatch, refreshTokenFetch)
{
    if (refreshTokenFetch) {
        dispatch(refreshAccessToken())
    }
    else {
        const authCode = window.location.search.split("=")[1]
        dispatch(fetchToken(authCode));
    }
}

function afterTokenNavigate (navigate, refreshTokenFetch)
{

    if (refreshTokenFetch) {
        navigate(window.location.pathname);
    }
    else {
        navigate(ROUTE_HOME);
    }
}

export default RedirectingComponent;