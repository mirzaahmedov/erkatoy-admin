import type { IPost } from '@/entities/post'

import { useEffect, useState } from 'react'

import { ComboBox, Item } from '@adobe/react-spectrum'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { DisallowedWords } from '@/features/DisallowedWords/components/DisallowedWords'
import { CategoryService } from '@/features/category/api'
import { useConfirm } from '@/features/confirm/useConfirm'
import { useLayoutStore } from '@/features/layout/store'
import { PostService } from '@/features/post/api'
import { PostTable } from '@/features/post/components/PostTable'
import { swal } from '@/lib/swal'

export const PostPage = () => {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)

  const postQuery = useQuery({
    queryKey: [PostService.QueryKey.GetAll, { page: 1, limit: 10000, categoryId: categoryId }],
    queryFn: PostService.getPosts
  })
  const postData = postQuery.data?.data?.data ?? []

  const categoryQuery = useQuery({
    queryKey: [CategoryService.QueryKey.GetAll, { page: 1, limit: 100 }],
    queryFn: CategoryService.getCategories
  })
  const categoryData = categoryQuery.data?.data?.data ?? []

  const deletePostMutation = useMutation({
    mutationFn: PostService.deletePost
  })

  useEffect(() => {
    setLayout({
      title: 'Posts',
      enableCreate: true,
      onCreate: () => navigate('create')
    })
  }, [setLayout, navigate])

  const handleClickEdit = (post: IPost) => {
    navigate(String(post.id))
  }
  const handleClickDelete = (id: number) => {
    confirm({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      onConfirm: () => {
        deletePostMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [PostService.QueryKey.GetAll]
          })
          swal.fire({
            icon: 'success',
            title: 'Post Deleted'
          })
        })
      }
    })
  }

  console.log('categoryId', categoryId)

  return (
    <div className="h-full">
      <div className="p-5 flex items-center gap-3">
        <ComboBox
          label="Category"
          labelPosition="side"
          menuTrigger="focus"
          selectedKey={categoryId ? String(categoryId) : null}
          onSelectionChange={(key) => {
            setCategoryId(key ? Number(key) : undefined)
          }}
          items={categoryData ?? []}
        >
          {(item) => <Item key={item.id}>{item.name}</Item>}
        </ComboBox>

        <DisallowedWords />
      </div>
      <PostTable
        rowData={postData}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />
    </div>
  )
}
