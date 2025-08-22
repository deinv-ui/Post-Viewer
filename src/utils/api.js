import useAuthStore from "@/stores/authStore";

const getToken = () => useAuthStore.getState().token;

// Generic fetch wrapper
export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const text = await response.text();

  try {
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) throw new Error(data.error || "API request failed");
    return data;
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error("Server returned non-JSON response");
  }
};

const BASE_URL = "http://localhost:4000/api";
// const BASE_URL = "https://blink-1m6m.onrender.com";
export const fetchTopGainers = async () => {
  return apiFetch(`${BASE_URL}/finance/top-gainers`);
};

export const fetchHighDividend = async () => {
  return apiFetch(`${BASE_URL}/finance/high-dividend`);
};

export const fetchStableStocks = async () => {
  return apiFetch(`${BASE_URL}/finance/stable-stocks`);
};
export const searchStocks = async (query) => {
  if (!query) return []; // empty query = no results
  return apiFetch(`${BASE_URL}/finance/search?q=${encodeURIComponent(query)}`);
};

//Auth
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getUsers = async () => {
  return apiFetch("/api/users"); // middleware will check token
};

// Helper to generate random image dimensions
function getRandomImageDimensions() {
  const width = Math.floor(Math.random() * 200) + 300; // 300–500
  const height = Math.floor(Math.random() * 400) + 200; // 200–600
  return { width, height };
}

function getRandomAvatar(seed) {
  const styles = ["avataaars", "bottts", "gridy", "micah"];
  const style = styles[Math.floor(Math.random() * styles.length)];
  // Add ?format=png to get a PNG image
  return `https://avatars.dicebear.com/api/${style}/${seed}.png`;
}

// Helper to generate random post text
function getRandomText(baseText) {
  const emojis = ["😎", "🔥", "✨", "💯", "🎉", "📸"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const extraText = Math.random() > 0.5 ? " " + randomEmoji : "";
  return baseText + extraText;
}

export async function getPostsWithUsers(limit = 5) {
  try {
    // Fetch posts
    const postRes = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
    );
    const postData = await postRes.json();

    // Fetch users
    const userRes = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const userData = await userRes.json();

    return postData.map((post) => {
      const user = userData[(post.userId - 1) % userData.length];

      // Random dimensions for post image
      const { width, height } = getRandomImageDimensions();

      // Random avatar for user
      const avatar = getRandomAvatar(
        user.id + Math.floor(Math.random() * 1000)
      );

      // Random post image
      const postImage = `https://source.unsplash.com/${width}x${height}/?nature,tech,${post.id}`;

      return {
        ...post,
        user: {
          name: user.name,
          avatar,
        },
        postImage,
        likes_count: Math.floor(Math.random() * 500),
        likes_exists: Math.random() > 0.5,
        imageWidth: width,
        imageHeight: height,
        title: getRandomText(post.title),
        body: getRandomText(post.body),
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * Mock "like" or "unlike" a post
 */
export async function likePost(postId, currentLikeState, currentCount) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const updatedLikeState = !currentLikeState;
  const updatedCount = updatedLikeState ? currentCount + 1 : currentCount - 1;
  return { likes_count: updatedCount, likes_exists: updatedLikeState };
}
