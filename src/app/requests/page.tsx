"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Requests() {
  return <></>;
}

export default withAuth(Requests, { allowedRoles: ["admin", "head", "staff"] });
