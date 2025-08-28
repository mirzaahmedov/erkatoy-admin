import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export const AppLayout = () => {
  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <div className="flex flex-1 min-h-0">
        <AppSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
