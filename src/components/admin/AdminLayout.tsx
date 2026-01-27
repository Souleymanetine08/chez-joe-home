import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import NewOrderNotification from "./NewOrderNotification";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      {/* Real-time order notifications */}
      <NewOrderNotification />
    </div>
  );
}
