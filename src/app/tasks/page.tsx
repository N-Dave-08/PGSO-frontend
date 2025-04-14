"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Tasks() {
  return <></>;
}

export default withAuth(Tasks, { allowedRoles: ["personnel"] });
