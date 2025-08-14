import { useState } from "react";
import { getImageDimensions } from "@/utils/globalFunction";
import { usePostStore } from "../stores/usePostStore";
import Icons from "@/components/Icons";

export default function PostCard({ data, onOpenModal, onLike }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [liked, setLiked] = useState(data.liked || false);
  const [likesCount, setLikesCount] = useState(data.likes_count || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { width, height } = getImageDimensions(data?.id, 0);
  const imageUrl = `https://picsum.photos/${width}/${height}?random=${data?.id * 13}`;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // animation duration
    onLike(data.id);
  };

  const avatarSeed = data.user?.id || data.id || Math.floor(Math.random() * 1000);
  const avatarUrl = `https://robohash.org/${avatarSeed}.png`;

  return (
    <div
      className="break-inside-avoid bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer relative"
      onClick={() => onOpenModal(data)}
    >
      {/* Post image */}
      <div
        className="bg-gray-100 overflow-hidden"
        style={{ height: data.imageHeight }}
      >
        {!isImageLoaded && <div className="w-full h-full shimmer" />}
        <img
          src={imageUrl}
          alt={data.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      <div className="p-3 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={avatarUrl}
            alt={data.user?.name || "Anonymous"}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium truncate max-w-[calc(100%-2rem)]">
            {data.user?.name || "Anonymous"}
          </span>
        </div>
        <p className="text-sm text-gray-800 mb-2 truncate max-w-[calc(100%-2rem)]">
          {data.title}
        </p>
      </div>

      {/* Like button */}
      <div
        className={`absolute bottom-3 right-3 flex items-center gap-1 text-xs select-none cursor-pointer p-1 rounded-full transition-colors`}
        onClick={handleLikeClick}
      >
        <span
          className={`transition-transform duration-300 ${
            isAnimating ? "scale-150" : "scale-100"
          }`}
        >
          {liked ? <Icons.Heart color="red" /> : <Icons.HeartOutline />}
        </span>
        {likesCount > 0 && <span>{likesCount}</span>}
      </div>
    </div>
  );
}
