import { FaUserPlus } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { BiSolidBookAdd } from "react-icons/bi";
import { TiGroup } from "react-icons/ti";
import { HOME_CODE_HUB, HOME_CreateQuestion, HOME_DASHBOARD, HOME_ListQuestion, HOME_User } from "./RoutePaths";



export const links = [
    {
        path: HOME_ListQuestion,
        name: "List Questions",
        icon: <FaClipboardList />
    },
    {
        path: HOME_User,
        name: 'User',
        icon: <FaUserPlus />
    },
    {
        path: HOME_CreateQuestion,
        name: "Create Question",
        icon: <BiSolidBookAdd />
    },
    {
        path: HOME_DASHBOARD,
        name: 'Dashboard',
        icon: <MdSpaceDashboard />
    },
    {
        path: HOME_CODE_HUB,
        name : "Code hub",
        icon : <TiGroup/>
    }
]