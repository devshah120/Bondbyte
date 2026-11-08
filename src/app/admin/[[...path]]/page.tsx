import { Suspense } from "react";
import { AdminApp } from "@/components/admin/AdminApp";

/** /admin and every address under it: the admin panel picks the screen from the address. */
export default function AdminPage() {
  return (
    <Suspense>
      <AdminApp />
    </Suspense>
  );
}
