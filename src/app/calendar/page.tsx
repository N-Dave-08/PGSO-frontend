"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Calendar() {
  return <></>;
}

export default withAuth(Calendar, { allowedRoles: ["personnel"] });
