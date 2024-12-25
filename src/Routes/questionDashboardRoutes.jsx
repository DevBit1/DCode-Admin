import { lazy, Suspense } from "react";
import { LOGIN, QUESTION_DASHBOARD, QUESTION_DASHBOARD_USER, QUESTION_DASHBOARD_USER_LIST } from "../Constants/RoutePaths";
import Authenticated from "../Components/Protected Routes/Authenticated";
import Loading from "../Components/Common/Loading";
import { Navigate } from "react-router-dom";


const QuestionDashBoard = lazy(() => import("../pages/Question Dashboard/index"))
const Userlist = lazy(() => import("../Components/Question Dashboard/UserList"))
const Userdata = lazy(() => import("../Components/Question Dashboard/Userdata"))


export const questionDashboardRoutes = {
    path: `${QUESTION_DASHBOARD}/:qId`,
    element: (
        <Authenticated
            redirect={LOGIN}
        >
            <Suspense fallback={<Loading />}>
                <QuestionDashBoard />
            </Suspense>
        </Authenticated>
    ),
    children: [
        {
            index: true,
            element: <Navigate to={QUESTION_DASHBOARD_USER_LIST}></Navigate>
        },
        {
            path: QUESTION_DASHBOARD_USER_LIST,
            element: (
                <Suspense fallback={<Loading />}>
                    <Userlist />
                </Suspense>
            )
        },
        {
            path: QUESTION_DASHBOARD_USER,
            element: (
                <Suspense fallback={<Loading />}>
                    <Userdata />
                </Suspense>
            )
        }
    ],
}

