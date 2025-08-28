import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "./auth/page";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";
import { CategoryPage } from "./category/page";

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
            {
              path: "category",
              element: <CategoryPage />,
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
