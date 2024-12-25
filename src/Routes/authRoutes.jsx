import Authenticated from "../Components/Protected Routes/Authenticated";
import { HOME, LOGIN } from "../Constants/RoutePaths";
import Login from "../pages/Auth/login";


export const authRoutes = {
    path:LOGIN,
    element:(
        <Authenticated
            redirect={HOME}
        >
            <Login/>
        </Authenticated>
    )
}