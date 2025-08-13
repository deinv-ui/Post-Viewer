import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: {}, 

  toggleLike: (id) =>
    set((state) => {
      const current = state.posts[id] || { liked: false, likesCount: 0 };
      const liked = !current.liked;
      const likesCount = liked
        ? current.likesCount + 1
        : current.likesCount - 1;
      return { posts: { ...state.posts, [id]: { liked, likesCount } } };
    }),

  setPost: (id, data) =>
    set((state) => ({ posts: { ...state.posts, [id]: data } })),
}));
