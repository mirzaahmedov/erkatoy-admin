import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

import { AuthPage } from "./auth/page";
import { CategoryPage } from "./category/page";
import { TagPage } from "./tag/page";
import { PostPage } from "./post/page";
import { PostViewPage } from "./post/[id]/page";

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
              path: "tag",
              element: <TagPage />,
            },
            {
              path: "category",
              element: <CategoryPage />,
            },
            {
              path: "post",
              element: <PostPage />,
            },
            {
              path: "post/:id",
              element: <PostViewPage />,
            },
            {
              path: "*",
              element: <Navigate to="/post" />,
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
