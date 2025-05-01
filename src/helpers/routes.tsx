import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Network,
  FileText,
  ChartBarStacked,
  User,
  ListTodo,
} from "lucide-react";

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
    link: "/dashboard",
  },
  TASKS: {
    icon: <ListTodo />,
    name: "Tasks",
    link: "/tasks",
  },
  REQUESTS: {
    icon: <ClipboardList />,
    name: "Requests",
    link: "/requests",
  },
  CATEGORIES: {
    icon: <ChartBarStacked />,
    name: "Categories",
    link: "/categories",
  },
  USERS: {
    icon: <Users />,
    name: "Users",
    link: "/users",
  },
  DEPARTMENTS: {
    icon: <Building2 />,
    name: "Departments",
    link: "/departments",
  },
  DIVISIONS: {
    icon: <Network />,
    name: "Divisions",
    link: "/divisions",
  },
  STAFFS: {
    icon: <Users />,
    name: "Staffs",
    link: "/staffs",
  },
  AUDIT_LOGS: {
    icon: <FileText />,
    name: "Audit Logs",
    link: "/audits",
  },
  PROFILE: {
    icon: <User />,
    name: "Profile",
    link: "/profile",
  },
  REPORTS: {
    icon: <FileText />,
    name: "Reports",
    link: "/reports",
  },
  ACCOMPLISHMENT: {
    icon: <FileText />,
    name: "Accomplishment",
    link: "/accomplishment",
  },
};
