"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Settings() {
  return <></>;
}

export default withAuth(Settings, {
  allowedRoles: ["admin", "head", "staff", "personnel"],
});
