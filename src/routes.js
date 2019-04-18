// @material-ui/icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import TasksIcon from '@material-ui/icons/Create';

const dashboardRoutes = [
    {
        path: "/",
        name: "Dashboard",
        icon: DashboardIcon
    },
    {
        path: "/profile",
        name: "Edit Profile",
        icon: PersonIcon
    },
    {
        path: "/notifications",
        name: "Notifications",
        icon: NotificationsIcon
    },
    {
        path: "/tasks",
        name: "Tasks",
        icon: TasksIcon
    }
];

export default dashboardRoutes;
