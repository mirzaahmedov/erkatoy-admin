import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "./auth/page";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";

const router = createBrowserRouter(
  [
    {
      path: "*",
      element: <AuthGuard />,
      children: [
        {
          path: "*",
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: "hello",
            },
          ],
        },
      ],
    },
    {
      path: "auth",
      element: <AuthPage />,
    },
  ],
  {
    basename: "admin",
  },
);

export default router;
