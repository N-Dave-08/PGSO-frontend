"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Divisions() {
  return <></>;
}

export default withAuth(Divisions, { allowedRoles: ["admin", "head"] });
