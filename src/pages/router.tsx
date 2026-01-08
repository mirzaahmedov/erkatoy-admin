import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/components/AppLayout'
import { AuthGuard } from '@/features/auth/components/AuthGuard'

import { AdsPage } from './ads/page'
import { AuthPage } from './auth/page'
import { BgImagePage } from './bg-image/page'
import { CategoryPage } from './category/page'
import { GifPage } from './gif/page'
import { PostViewPage } from './post/[id]/page'
import { PostPage } from './post/page'
import { TagPage } from './tag/page'

const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <AuthGuard />,
      children: [
        {
          path: '*',
          element: <AppLayout />,
          children: [
            {
              path: 'tag',
              element: <TagPage />
            },
            {
              path: 'category',
              element: <CategoryPage />
            },
            {
              path: 'post',
              element: <PostPage />
            },
            {
              path: 'post/:id',
              element: <PostViewPage />
            },
            {
              path: 'gif',
              element: <GifPage />
            },
            {
              path: 'bg-images',
              element: <BgImagePage />
            },
            {
              path: 'ads',
              element: <AdsPage />
            },
            {
              path: '*',
              element: <Navigate to="/post" />
            }
          ]
        }
      ]
    },
    {
      path: 'auth',
      element: <AuthPage />
    }
  ],
  {
    basename: 'admin'
  }
)

export default router
