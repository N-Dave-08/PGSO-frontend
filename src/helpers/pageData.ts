import { LucideIcon } from "lucide-react";

export interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
}

import { Send, FileSearch, Users, FileBarChart, UserCircle, Clock } from 'lucide-react';

export const capabilities: Capability[] = [
  {
    icon: Send,
    title: "Submit Service Request",
    description: "Easily request services for maintenance, procurement, transport, and more."
  },
  {
    icon: FileSearch,
    title: "Track Service Requests",
    description: "Monitor the status of your requests in real time."
  },
  {
    icon: Users,
    title: "Department Collaboration",
    description: "Work with various departments to ensure efficient service delivery."
  },
  {
    icon: FileBarChart,
    title: "Report Generation",
    description: "Create detailed reports on service requests and completions for accountability."
  },
  {
    icon: UserCircle,
    title: "Multi-role Access",
    description: "Roles such as Department Staff, Department Heads, and Admins can access tailored dashboards."
  },
  {
    icon: Clock,
    title: "Quick Response Time",
    description: "Ensure quick turnaround for urgent requests."
  },
]

export interface Process {
  title: string;
  description: string;
}

export const process: Process[] = [
    {
        title: "Log In to Your Account",
        description: "Users can log in as Department Staff, Heads, Admin, or Super Admin.",
    },
    {
        title: "Submit a Service Request",
        description: "Select the department and specify the service needed (e.g., procurement, transport).",
    },
    {
        title: "Track Your Request",
        description: "Get real-time updates as the responsible department processes your request.",
    },
    {
        title: "Receive Confirmation",
        description: "Receive notifications once your request is completed.",
    },
    {
        title: "Generate Reports",
        description: "For Admins and Heads, detailed reports on service requests are available.",
    },
]

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "How do I submit a service request?",
    answer: "To submit a service request, log into your account and navigate to the 'New Request' page. Fill out the required fields with details about your request and click 'Submit'."
  },
  {
    question: "How can I track the status of my service request?",
    answer: "You can track your service request by going to the 'My Requests' page. Here, you'll see a list of all your requests with their current status. Click on any request for more detailed information."
  },
  {
    question: "Who can access the system?",
    answer: "Our system supports multiple roles including Department Staff, Department Heads, and Admins. Each role has access to tailored dashboards and functionalities appropriate for their responsibilities."
  },
  {
    question: "How are urgent requests handled?",
    answer: "Urgent requests are flagged in our system and receive priority attention. Our goal is to ensure quick turnaround times for these critical issues."
  },
  {
    question: "Can I generate reports on service requests?",
    answer: "Yes, you can generate detailed reports on service requests and completions. Navigate to the 'Reports' section in your dashboard, select the type of report and date range, then click 'Generate'."
  },
  {
    question: "How does inter-department collaboration work?",
    answer: "Our system facilitates inter-department collaboration by allowing you to tag relevant departments in your requests. Updates and communications are shared in real-time with all involved parties."
  }
];

