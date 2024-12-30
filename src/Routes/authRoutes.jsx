import Authenticated from "../Components/Protected Routes/Authenticated";
import LoginWrapper from "../Components/Protected Routes/LoginWrapper";
import { HOME, LOGIN } from "../Constants/RoutePaths";
import Login from "../pages/Auth/login";


export const authRoutes = {
    path:LOGIN,
    element:(
        <LoginWrapper
        >
            <Login/>
        </LoginWrapper>
    )
}