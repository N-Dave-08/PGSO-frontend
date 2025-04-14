"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
}

export default withAuth(Dashboard, {
  allowedRoles: ["admin", "head", "personnel", "staff"],
});
