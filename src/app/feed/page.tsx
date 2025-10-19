import FeedClient from "./FeedClient";

export default function FeedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">News Feed</h1>
      <p className="text-center text-gray-600 mb-6">
        This page is deprecated. The feed is now integrated into the homepage.
      </p>
      <FeedClient items={[]} />
    </div>
  );
}
