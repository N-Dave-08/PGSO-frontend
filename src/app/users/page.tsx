"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Users() {
  return <></>;
}

export default withAuth(Users, { allowedRoles: ["admin"] });
