import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../Components/Common/Loading";
import Authenticated from "../Components/Protected Routes/Authenticated";
import {
    HOME,
    HOME_CODE_HUB,
    HOME_CreateQuestion,
    HOME_CreateQuestion_CreateTestCases,
    HOME_CreateQuestion_QuestionTemplate,
    HOME_DASHBOARD,
    HOME_ListQuestion,
    HOME_User,
    LOGIN
} from "../Constants/RoutePaths";
import Home from "../pages/Home/Home";
import QuestionCreationContainer from "../pages/Home/Question/index";
import QuestionDetail from "../pages/Home/Question/Question";
import CreateTestCasesPage from "../pages/Home/Question/TestCasePage";



const User = lazy(() => import("../pages/Home/User"))
// const QuestionCreationContainer = lazy(() => import("../pages/Home/Question/index"))
// const QuestionDetail = lazy(() => import("../pages/Home/Question/Question"))
// const CreateTestCasesPage = lazy(() => import("../pages/Home/Question/TestCasePage"))
const ListQuestions = lazy(() => import("../pages/Home/List Questions/index"))
const DashBoard = lazy(() => import("../pages/Home/Dashboard/index"))
const CodeHub = lazy(() => import("../pages/Home/Code Hub/index"))



export const homeRoutes = {
    path: HOME,
    element: (
        <Authenticated
            redirect={LOGIN}
        >
            <Home />
        </Authenticated>
    ),
    children: [
        {
            index: true,
            element: <Navigate to={HOME_ListQuestion}></Navigate>
        },
        {
            path: HOME_ListQuestion,
            element: (
                <Suspense fallback={<Loading />}>
                    <ListQuestions />
                </Suspense>
            )
        },
        {
            path: HOME_User,
            element: (
                <Suspense fallback={<Loading />}>
                    <User />
                </Suspense>
            )
        },
        {
            path: HOME_CreateQuestion,
            element: (
                <QuestionCreationContainer />
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to={HOME_CreateQuestion_QuestionTemplate}></Navigate>
                },
                {
                    path: HOME_CreateQuestion_QuestionTemplate,
                    element: (
                        <QuestionDetail />
                    )
                },
                {
                    path: HOME_CreateQuestion_CreateTestCases,
                    element: (
                        <CreateTestCasesPage />
                    )
                }
            ]
        },
        {
            path: HOME_DASHBOARD,
            element: (
                <Suspense fallback={<Loading />}>
                    <DashBoard />
                </Suspense>
            )
        },
        {
            path: HOME_CODE_HUB,
            element: (
                <Suspense fallback={<Loading />}>
                    <CodeHub/>
                </Suspense>
            )
        }
    ]
}