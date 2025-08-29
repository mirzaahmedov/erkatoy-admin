import { useLayoutStore } from "@/features/layout/store";
import { PostService } from "@/features/post/api";
import { PostForm } from "@/features/post/components/PostForm";
import { swal } from "@/lib/swal";
import { Button, ButtonGroup } from "@adobe/react-spectrum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PostViewPage = () => {
  const id = useParams().id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const postDataQuery = useQuery({
    queryKey: [PostService.QueryKey.GetById, id],
    queryFn: () => PostService.getPostId(Number(id)),
    enabled: !!id && id !== "create",
  });
  const createPostMutation = useMutation({
    mutationFn: PostService.createPost,
  });
  const updatePostMutation = useMutation({
    mutationFn: (formData: FormData) =>
      PostService.updatePost(Number(id), formData),
  });

  useEffect(() => {
    if (id === "create") {
      setLayout({
        title: "Create Post",
        breadcrumbs: [{ title: "Posts", to: "/post" }],
        enableCreate: false,
      });
    } else {
      setLayout({
        title: "Edit Post",
        breadcrumbs: [{ title: "Posts", to: "/post" }],
        enableCreate: false,
      });
    }
  }, [id, setLayout]);

  const postData = postDataQuery.data?.data;

  const handleSubmit = (formData: FormData) => {
    if (postData) {
      updatePostMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [PostService.QueryKey.GetAll],
        });
        swal.fire({
          icon: "success",
          title: "Post Updated",
        });
        navigate(-1);
      });
    } else {
      createPostMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [PostService.QueryKey.GetAll],
        });
        swal.fire({
          icon: "success",
          title: "Post Created",
        });
        navigate(-1);
      });
    }
  };

  return (
    <div className="p-5 overflow-y-auto h-full">
      <PostForm
        isPending={createPostMutation.isPending || updatePostMutation.isPending}
        onSubmit={handleSubmit}
        postData={postData ?? undefined}
        actions={(form) => (
          <ButtonGroup alignSelf="end">
            <Button
              variant="secondary"
              onPress={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cta"
              isDisabled={!form.formState.isDirty}
              isPending={
                createPostMutation.isPending || updatePostMutation.isPending
              }
            >
              {postData ? "Update" : "Create"}
            </Button>
          </ButtonGroup>
        )}
      />
    </div>
  );
};
