import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export const AppLayout = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};
