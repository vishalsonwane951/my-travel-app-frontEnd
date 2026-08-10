import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/content/blog").then((r) => setPosts(r.data.posts)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Desivdesi Travel Blog</h1>
      {loading && <p>Loading…</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {posts.map((p) => (
          <Link key={p._id} to={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit", border: "1px solid #eee", borderRadius: 10, overflow: "hidden" }}>
            {p.coverImage && <img src={p.coverImage} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />}
            <div style={{ padding: 14 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{p.title}</h3>
              <p style={{ color: "#888", fontSize: 13.5, margin: 0 }}>{p.excerpt}</p>
            </div>
          </Link>
        ))}
        {!loading && posts.length === 0 && <p style={{ color: "#888" }}>No posts published yet — check back soon!</p>}
      </div>
    </div>
  );
};

export default BlogList;
