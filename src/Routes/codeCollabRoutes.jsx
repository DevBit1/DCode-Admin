import { lazy, Suspense } from "react";
import Authenticated from "../Components/Protected Routes/Authenticated";
import Loading from "../Components/Common/Loading";
import { Navigate } from "react-router-dom";
import { CODE_COLLAB, LOGIN } from "../Constants/RoutePaths";

const CodeCollab = lazy(() => import("../pages/Collab hub/index"))

export const codeCollab = {
    path: `${CODE_COLLAB}/:roomName`,
    element: (
        <Authenticated
            // redirect={LOGIN}
        >
            <Suspense fallback={<Loading />}>
                <CodeCollab />
            </Suspense>
        </Authenticated>
    )
}