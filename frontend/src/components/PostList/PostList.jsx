import PostCard from "../PostCard/PostCard";

export default function PostList({ posts }) {
  return (
    <div className="row g-3 align-items-stretch">
      {posts.map((post) => (
        <div key={post.id} className="col-12 col-md-6 col-lg-4 d-flex">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
