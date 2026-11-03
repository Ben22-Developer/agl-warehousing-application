import axios from "axios"
import {SERVER_ACCESS_TOKEN_REFRESH} from "../path/ServerPath.js";
import {ACCESS_TOKEN, setAccessToken} from "../redux/slice/auth/TokenSlice.js";

export default async function refreshToken(headers)
{
    try {
        const response = await axios.post(SERVER_ACCESS_TOKEN_REFRESH, {}, {withCredentials: true})
        setAccessToken(response.data.access_token);
        headers.Authorization = ACCESS_TOKEN;
    }
    catch (error) {}
}
