import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const Moderation = () => {
  const [tab, setTab] = useState("Reviews");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answerText, setAnswerText] = useState({});

  const loadReviews = async () => setReviews((await adminApi.get("/moderation/reviews")).data.reviews);
  const loadQuestions = async () => setQuestions((await adminApi.get("/moderation/qa")).data.questions);

  useEffect(() => { tab === "Reviews" ? loadReviews() : loadQuestions(); }, [tab]);

  const moderate = async (r, status) => {
    await adminApi.put(`/moderation/reviews/${r.packageId}/${r.reviewId}/status`, { status });
    loadReviews();
  };
  const removeReview = async (r) => {
    if (!window.confirm("Delete this review?")) return;
    await adminApi.delete(`/moderation/reviews/${r.packageId}/${r.reviewId}`);
    loadReviews();
  };
  const submitAnswer = async (q) => {
    const text = answerText[q.questionId];
    if (!text?.trim()) return;
    await adminApi.post(`/moderation/qa/${q.packageId}/${q.questionId}/answer`, { text });
    setAnswerText({ ...answerText, [q.questionId]: "" });
    loadQuestions();
  };
  const removeQuestion = async (q) => {
    if (!window.confirm("Delete this question?")) return;
    await adminApi.delete(`/moderation/qa/${q.packageId}/${q.questionId}`);
    loadQuestions();
  };

  return (
    <div>
      <h2>Reviews & Q&A Moderation</h2>
      <div className="admin-tabs">
        {["Reviews", "Q&A"].map((t) => <div key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>)}
      </div>

      {tab === "Reviews" && (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Package</th><th>Name</th><th>Rating</th><th>Review</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.reviewId}>
                  <td>{r.packageTitle}</td><td>{r.name}</td><td>{r.rating}★</td>
                  <td style={{ maxWidth: 280 }}>{r.title && <strong>{r.title}<br /></strong>}{r.text}</td>
                  <td><span className={`admin-badge badge-${r.status}`}>{r.status}</span></td>
                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.status !== "approved" && <button className="admin-btn secondary" onClick={() => moderate(r, "approved")}>Approve</button>}
                    {r.status !== "rejected" && <button className="admin-btn secondary" onClick={() => moderate(r, "rejected")}>Reject</button>}
                    <button className="admin-btn danger" onClick={() => removeReview(r)}>Delete</button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No reviews yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Q&A" && (
        <div>
          {questions.map((q) => (
            <div key={q.questionId} className="admin-card" style={{ marginBottom: 12 }}>
              <p style={{ color: "#888", fontSize: 12.5, margin: 0 }}>{q.packageTitle} · asked by {q.askedBy}</p>
              <p style={{ fontWeight: 600, margin: "6px 0" }}>{q.question}</p>
              {(q.answers || []).map((a, i) => (
                <div key={i} style={{ background: "#f7f8fb", padding: "8px 12px", borderRadius: 6, marginBottom: 6, fontSize: 13.5 }}>
                  <strong>{a.authorName}{a.isOfficial ? " (Official)" : ""}:</strong> {a.text}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input className="admin-input" style={{ flex: 1 }} placeholder="Write an answer…" value={answerText[q.questionId] || ""} onChange={(e) => setAnswerText({ ...answerText, [q.questionId]: e.target.value })} />
                <button className="admin-btn" onClick={() => submitAnswer(q)}>Answer</button>
                <button className="admin-btn danger" onClick={() => removeQuestion(q)}>Delete</button>
              </div>
            </div>
          ))}
          {questions.length === 0 && <p style={{ color: "#888" }}>No questions yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Moderation;
