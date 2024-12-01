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
        link: "/dashboard"
    },
    REQUESTS: {
        icon: <ClipboardList />,
        name: "Requests",
        link: "/requests"
    },
    CATEGORIES: {
        icon: <ChartBarStacked />,
        name: "Categories",
        link: "/categories"
    },
    USERS: {
        icon: <Users />,
        name: "Users",
        link: "/users"
    },
    DEPARTMENTS: {
        icon: <Building2 />,
        name: "Departments",
        link: "/departments"
    },
    DIVISIONS: {
        icon: <Network />,
        name: "Divisions",
        link: "/divisions"
    },
    AUDIT_LOGS: {
        icon: <FileText />,
        name: "Audit Logs",
        link: "/audits"
    },
    SETINGS: {
        icon: <Settings />,
        name: "Settings",
        link: "/settings"
    }
}