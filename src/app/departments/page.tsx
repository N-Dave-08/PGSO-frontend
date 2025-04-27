"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Departments() {
  return <></>;
}

export default withAuth(Departments, { allowedRoles: ["admin"] });
