"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Reports() {
  // This page is intentionally left empty because the role-specific profile components (@staff, @head, @personnel)
  // are rendered through the layout's renderContent function
  return null;
}

export default withAuth(Reports, {
  allowedRoles: ["head", "admin"],
});
