import PostList from "@/components/PostList";
import MainLayout from "@/layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="mb-4 text-lg font-semibold text-gray-700">
        Welcome back!
      </div>
      <PostList />
    </MainLayout>
  );
}
