import { FileText, Users, Building2 } from "lucide-react";
import { FeatureCard } from "@/components/cards/FeatureCard";

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Request Management System
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Streamlined process for submitting and tracking service requests
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <FeatureCard
            icon={<FileText className="h-12 w-12 text-primary" />}
            title="Request Submission"
            description="Submit service requests online with ease"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-primary" />}
            title="Request Tracking"
            description="Monitor the status of your requests in real-time"
          />
          <FeatureCard
            icon={<Building2 className="h-12 w-12 text-primary" />}
            title="Document Management"
            description="Secure handling of all your important documents"
          />
        </div>
      </div>
    </section>
  );
}
