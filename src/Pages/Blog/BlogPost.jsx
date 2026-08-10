import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/content/blog/${slug}`).then((r) => setPost(r.data.post)).catch(() => setError("Post not found."));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = post.metaTitle || post.title;
    const desc = document.querySelector('meta[name="description"]') || document.createElement("meta");
    desc.setAttribute("name", "description");
    desc.setAttribute("content", post.metaDescription || post.excerpt || "");
    if (!desc.parentNode) document.head.appendChild(desc);
    return () => { document.title = "Desivdesi"; };
  }, [post]);

  if (error) return <div style={{ padding: 60, textAlign: "center" }}>{error} <Link to="/blog">Back to blog</Link></div>;
  if (!post) return <div style={{ padding: 60, textAlign: "center" }}>Loading…</div>;

  return (
    <article style={{ maxWidth: 760, margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <Link to="/blog" style={{ color: "#4f7cff", fontSize: 13.5 }}>&larr; Back to blog</Link>
      <h1>{post.title}</h1>
      <p style={{ color: "#888" }}>{new Date(post.publishedAt).toLocaleDateString("en-IN")} · {post.tags?.join(", ")}</p>
      {post.coverImage && <img src={post.coverImage} alt={post.title} style={{ width: "100%", borderRadius: 10, margin: "16px 0" }} />}
      <div style={{ lineHeight: 1.7, fontSize: 16, color: "#333" }} dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

export default BlogPost;
