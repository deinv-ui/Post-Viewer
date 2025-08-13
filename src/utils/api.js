// utils/api.js
import { getImageDimensions } from "./globalFunction";

export async function getPostsWithUsers(limit = 5) {
  try {
    const postRes = await fetch(`https://dummyjson.com/posts?limit=${limit}`);
    const postData = await postRes.json();

    const userRes = await fetch(`https://randomuser.me/api/?results=${limit}`);
    const userData = await userRes.json();

    return postData.posts.map((post, index) => {
      const { width, height } = getImageDimensions(post.id);

      return {
        ...post,
        user: {
          name: `${userData.results[index].name.first} ${userData.results[index].name.last}`,
          avatar: userData.results[index].picture.medium,
        },
        likes_count: Math.floor(Math.random() * 500),
        likes_exists: Math.random() > 0.5,
        imageWidth: width,
        imageHeight: height,
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * Mock "like" or "unlike" a post
 * @param {number} postId - The ID of the post
 * @param {boolean} currentLikeState - Whether the post is currently liked
 * @param {number} currentCount - Current like count
 * @returns {Promise<{ likes_count: number, likes_exists: boolean }>}
 */
export async function likePost(postId, currentLikeState, currentCount) {
  console.log(`Simulating API call to like/unlike post ${postId}...`);

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Toggle like state and adjust count
  const updatedLikeState = !currentLikeState;
  const updatedCount = updatedLikeState ? currentCount + 1 : currentCount - 1;

  return {
    likes_count: updatedCount,
    likes_exists: updatedLikeState,
  };
}
