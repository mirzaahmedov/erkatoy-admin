import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { IPost } from "@/entities/post";
import { PostService } from "@/features/post/api";
import { PostTable } from "@/features/post/components/PostTable";
import { swal } from "@/lib/swal";
import { useConfirm } from "@/features/confirm/useConfirm";
import { useEffect } from "react";
import { useLayoutStore } from "@/features/layout/store";
import { useNavigate } from "react-router-dom";

export const PostPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const postQuery = useQuery({
    queryKey: [PostService.QueryKey.GetAll, { page: 1, limit: 10000 }],
    queryFn: PostService.getPosts,
  });
  const postData = postQuery.data?.data?.data ?? [];

  const deletePostMutation = useMutation({
    mutationFn: PostService.deletePost,
  });

  useEffect(() => {
    setLayout({
      title: "Posts",
      enableCreate: true,
      onCreate: () => navigate("create"),
    });
  }, [setLayout, navigate]);

  const handleClickEdit = (post: IPost) => {
    navigate(String(post.id));
  };
  const handleClickDelete = (id: number) => {
    confirm({
      title: "Delete Post",
      message: "Are you sure you want to delete this post?",
      onConfirm: () => {
        deletePostMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [PostService.QueryKey.GetAll],
          });
          swal.fire({
            icon: "success",
            title: "Post Deleted",
          });
        });
      },
    });
  };

  return (
    <div className="h-full">
      <PostTable
        rowData={postData}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />
    </div>
  );
};
