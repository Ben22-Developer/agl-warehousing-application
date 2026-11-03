import axios from "axios";
import HttpError from "../error/HttpError.js";
import refreshToken from "../TokenRefresh.js";
import {ACCESS_TOKEN} from "../../redux/slice/auth/TokenSlice.js";

export async function patchRequest ({ url, body, header, otherConfig=null, errorMessage=null, maxRetries=2 })
{
    let attempt = 0;
    let tokenRefreshed = false;
    let config = null;

    while (attempt < maxRetries)
    {
        attempt++;

        try
        {
            if (config == null) {
                config = {
                    headers: {...header, }, ...otherConfig
                }
            }

            const rawData = await axios.patch(url, body, config);

            if (rawData.status > 299) {
                console.log(rawData);
                throw new HttpError(rawData.status, rawData.statusText, errorMessage);
            }

            console.log(rawData);

            return rawData.data;
        }
        catch (error) {

            if (error.response?.status === 401 && !tokenRefreshed)
            {
                await refreshToken(config.headers);
                tokenRefreshed = true;
                continue;
            }

            console.log(error instanceof  HttpError);
            throw Error(error);
        }
    }
}
