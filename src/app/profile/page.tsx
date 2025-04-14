"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Profile() {
  return <></>;
}

export default withAuth(Profile, {
  allowedRoles: ["staff", "head", "personnel"],
});
