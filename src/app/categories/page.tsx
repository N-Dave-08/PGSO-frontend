"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Categories() {
  return <></>;
}

export default withAuth(Categories, { allowedRoles: ["admin"] });
