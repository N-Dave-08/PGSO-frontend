"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Accomplishment() {
  return <></>;
}

export default withAuth(Accomplishment, { allowedRoles: ["personnel"] });
