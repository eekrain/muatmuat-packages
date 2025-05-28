import Button from "@/components/Button/Button";
import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";

function ExampleSwr() {
  const {
    data: posts,
    error,
    isLoading,
    mutate: refetchPosts,
  } = useSWRHook("/posts/1");
  const { trigger: createPost, isMutating: isCreating } = useSWRMutateHook(
    "/posts",
    "POST"
  );

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      )}

      <Button
        onClick={() =>
          createPost({ title: "New Post" }).then((res) => {
            // refetch posts after creating new post
            refetchPosts();
            console.log(res);
          })
        }
      >
        {isCreating ? "Creating..." : "Create Post"}
      </Button>
    </div>
  );
}

export default ExampleSwr;
