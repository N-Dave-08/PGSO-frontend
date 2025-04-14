"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Staffs() {
  return <></>;
}

export default withAuth(Staffs, { allowedRoles: ["head"] });
