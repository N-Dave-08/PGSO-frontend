"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Audits() {
  return <></>;
}

export default withAuth(Audits, { allowedRoles: ["admin"] });
