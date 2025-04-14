"use client";

import { withAuth } from "@/components/hoc/with-auth";

function Feedback() {
  return <></>;
}

export default withAuth(Feedback, { allowedRoles: ["personnel"] });
