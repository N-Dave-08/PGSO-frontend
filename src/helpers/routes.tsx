import { 
    LayoutDashboard, 
    ClipboardList, 
    Users, 
    Building2, 
    Network, 
    FileText, 
    Settings,
    ChartBarStacked
} from 'lucide-react'

interface RouteProps {
    icon: React.ReactNode;
    name: string;
    link: string;
}

interface RoutesDataProps {
    [key: string]: RouteProps;
}

export const routesData: RoutesDataProps = {
    DASHBOARD: {
        icon: <LayoutDashboard />,
        name: "Dashboard",
        link: "/admin/dashboard"
    },
    REQUESTS: {
        icon: <ClipboardList />,
        name: "Requests",
        link: "/admin/requests"
    },
    CATEGORIES: {
        icon: <ChartBarStacked />,
        name: "Categories",
        link: "/admin/categories"
    },
    USERS: {
        icon: <Users />,
        name: "Users",
        link: "/admin/users"
    },
    DEPARTMENTS: {
        icon: <Building2 />,
        name: "Departments",
        link: "/admin/departments"
    },
    DIVISIONS: {
        icon: <Network />,
        name: "Divisions",
        link: "/admin/divisions"
    },
    AUDIT_LOGS: {
        icon: <FileText />,
        name: "Audit Logs",
        link: "/admin/audits"
    },
    SETINGS: {
        icon: <Settings />,
        name: "Settings",
        link: "/admin/settings"
    }
}