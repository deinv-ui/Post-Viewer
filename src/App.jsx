import Counter from "@/components/Counter";
import PostList from "@/components/PostList";

export default function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-6 space-y-6 max-w-full">
        <h1 className="text-xl font-bold">Post Viewer App</h1>
        <PostList />
      </div>
    </div>
  );
}
