import { createBrowserRouter, Navigate } from "react-router-dom";
import { LOGIN } from "../Constants/RoutePaths";
import { authRoutes } from "./authRoutes";
import { homeRoutes } from "./homeRoutes";
import { questionDashboardRoutes } from "./questionDashboardRoutes";
import { codeCollab } from "./codeCollabRoutes";
import App from "../App";


const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to={LOGIN}></Navigate>
            },
            {
                ...authRoutes
            },
            {
                ...homeRoutes
            },
            {
                ...questionDashboardRoutes
            },
            {
                ...codeCollab
            }
        ]
    }

]


const router = createBrowserRouter(routes)

export default router