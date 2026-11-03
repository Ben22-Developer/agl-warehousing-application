import {Outlet} from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.jsx";
import Header from "../header/Header.jsx";
import RedirectingComponent from "./RedirectingComponent.jsx";
import {useSelector} from "react-redux";

function ProtectedRoute ()
{
    const isAuthenticated = useSelector(state => state.token.isAuthenticated);
    const hasFetchedUserData = useSelector(state => state.user.hasFetchedUserData);

    if (!isAuthenticated || !hasFetchedUserData)
    {
        return <RedirectingComponent refreshTokenFetch={true}/>;
    }

    return (
        <div className="app">
        <Sidebar />
        <div className="main-content">
            <Header />
            <Outlet />
        </div>
    </div>)
}

export default ProtectedRoute;