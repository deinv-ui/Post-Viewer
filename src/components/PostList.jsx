import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostsWithUsers, likePost } from "@/utils/api.js";
import PostCard from "@/components/Card.jsx";
import { getImageDimensions } from "@/utils/globalFunction";

export default function PostList() {
  const queryClient = useQueryClient();

  // Fetch posts
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPostsWithUsers(20),
    staleTime: 1000 * 60, // 1 min before considering stale
    cacheTime: 1000 * 60 * 5, // keep in cache for 5 mins
    retry: 2, // retry failed fetches twice
  });

  const likeMutation = useMutation({
    mutationFn: ({ postId, currentLikeState, currentCount }) =>
      likePost(postId, currentLikeState, currentCount),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["posts"], (oldPosts) =>
        oldPosts.map((post) =>
          post.id === variables.postId ? { ...post, ...data } : post
        )
      );
    },
  });

  if (isLoading) {
    const mockPosts = Array.from({ length: 10 }).map((_, i) => {
      const { height } = getImageDimensions(i + 1);
      return { id: i + 1, imageHeight: height };
    });

    return (
      <div className="p-4">
        <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-5 gap-4 space-y-4">
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-200 shimmer rounded-lg"
              style={{ height: post.imageHeight }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 font-semibold">
          Error: {error.message || "Failed to load posts"}
        </p>
        <button
          onClick={() => queryClient.invalidateQueries(["posts"])}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleOpenModal = (post) => {
    console.log("Open modal for", post);
  };

  const handleLike = (id) => {
    likeMutation.mutate({ postId: id });
  };

  return (
    <div className="p-4">
      {isFetching && <p className="text-sm text-gray-500 mb-2">Refreshing…</p>}

      <div className="columns-2 sm:columns-3 md:columns-4 xl:columns-5 gap-4 space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            data={post}
            onOpenModal={handleOpenModal}
            onLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
}
