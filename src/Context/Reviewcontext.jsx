// Context/ReviewContext.jsx
//
// Global context for Reviews & Q&A.
// Wraps your app (or just the pages that need it) with ReviewProvider.
//
// Usage in a component:
//   const { reviews, qa, submitReview, submitQuestion, submitAnswer, markHelpful } = useReviews();
//
// Usage in ItineraryPage / ReviewsAndQA:
//   <ReviewProvider packageId={pkg._id}>
//     <ReviewsAndQA />
//     <ContributeSection />
//   </ReviewProvider>
//
// All four backend operations are exposed:
//   submitReview(payload)          → POST /api/reviews
//   fetchReviews(packageId)        → GET  /api/reviews/:packageId
//   submitQuestion(payload)        → POST /api/qa
//   submitAnswer(questionId, text) → POST /api/qa/:questionId/answer
//   markHelpful(reviewId)          → POST /api/reviews/:reviewId/helpful

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api from "../utils/api";  // your existing axios instance

// ─── Helpers ────────────────────────────────────────────────────────────────
const getAuthHeader = () => {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Context ────────────────────────────────────────────────────────────────
const ReviewContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
/**
 * ReviewProvider
 *
 * Props:
 *   packageId  {string}  – MongoDB _id of the package being viewed.
 *                          When this changes the context re-fetches automatically.
 *   children   {node}
 */
export function ReviewProvider({ packageId, children }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [reviews,         setReviews]         = useState([]);
  const [qa,              setQa]              = useState([]);
  const [reviewsLoading,  setReviewsLoading]  = useState(false);
  const [qaLoading,       setQaLoading]       = useState(false);
  const [reviewsError,    setReviewsError]    = useState(null);
  const [qaError,         setQaError]         = useState(null);
  const [helpfulPending,  setHelpfulPending]  = useState({}); // reviewId → bool
  const [submitPending,   setSubmitPending]   = useState(false);
  const [submitError,     setSubmitError]     = useState(null);

  // Prevent fetch on unmounted component
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // ── Fetch reviews ──────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async (pkgId) => {
    if (!pkgId) return;
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const res = await api.get(`/reviews/${pkgId}`);
      if (mounted.current) setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (mounted.current)
        setReviewsError(err?.response?.data?.message || "Failed to load reviews.");
    } finally {
      if (mounted.current) setReviewsLoading(false);
    }
  }, []);

  // ── Fetch Q&A ──────────────────────────────────────────────────────────────
  const fetchQA = useCallback(async (pkgId) => {
    if (!pkgId) return;
    setQaLoading(true);
    setQaError(null);
    try {
      const res = await api.get(`/qa/${pkgId}`);
      if (mounted.current) setQa(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (mounted.current)
        setQaError(err?.response?.data?.message || "Failed to load Q&A.");
    } finally {
      if (mounted.current) setQaLoading(false);
    }
  }, []);

  // Auto-fetch whenever packageId changes
  useEffect(() => {
    if (!packageId) return;
    fetchReviews(packageId);
    fetchQA(packageId);
  }, [packageId, fetchReviews, fetchQA]);

  // ── Submit review ──────────────────────────────────────────────────────────
  /**
   * submitReview
   * @param {{ rating, title, text, tripType, name, location }} payload
   * @returns {Promise<Object>} saved review from server
   */
  const submitReview = useCallback(async (payload) => {
    setSubmitPending(true);
    setSubmitError(null);
    try {
      const res = await api.post(
        "/reviews",
        { packageId, ...payload },
        { headers: getAuthHeader() }
      );
      const saved = res.data?.review || res.data;
      // Optimistic prepend — the server version has _id, timestamps, etc.
      if (mounted.current) setReviews((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit review.";
      if (mounted.current) setSubmitError(msg);
      throw new Error(msg);
    } finally {
      if (mounted.current) setSubmitPending(false);
    }
  }, [packageId]);

  // ── Mark review helpful ────────────────────────────────────────────────────
  /**
   * markHelpful
   * @param {string} reviewId – MongoDB _id of the review
   */
  const markHelpful = useCallback(async (reviewId) => {
    if (helpfulPending[reviewId]) return; // already in-flight or done
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        (r._id || r.id) === reviewId
          ? { ...r, helpful: (r.helpful || 0) + 1 }
          : r
      )
    );
    setHelpfulPending((p) => ({ ...p, [reviewId]: true }));
    try {
      await api.post(
        `/reviews/${reviewId}/helpful`,
        {},
        { headers: getAuthHeader() }
      );
    } catch {
      // Roll back optimistic update on failure
      if (mounted.current) {
        setReviews((prev) =>
          prev.map((r) =>
            (r._id || r.id) === reviewId
              ? { ...r, helpful: Math.max(0, (r.helpful || 1) - 1) }
              : r
          )
        );
        setHelpfulPending((p) => ({ ...p, [reviewId]: false }));
      }
    }
  }, [helpfulPending]);

  // ── Submit question ────────────────────────────────────────────────────────
  /**
   * submitQuestion
   * @param {{ question, authorName }} payload
   * @returns {Promise<Object>} saved Q&A item from server
   */
  const submitQuestion = useCallback(async (payload) => {
    setSubmitPending(true);
    setSubmitError(null);
    try {
      const res = await api.post(
        "/qa",
        { packageId, ...payload },
        { headers: getAuthHeader() }
      );
      const saved = res.data?.qa || res.data;
      if (mounted.current) setQa((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit question.";
      if (mounted.current) setSubmitError(msg);
      throw new Error(msg);
    } finally {
      if (mounted.current) setSubmitPending(false);
    }
  }, [packageId]);

  // ── Submit answer ──────────────────────────────────────────────────────────
  /**
   * submitAnswer
   * @param {string} questionId – MongoDB _id of the Q&A document
   * @param {string} answerText
   * @returns {Promise<Object>} updated Q&A item from server
   */
  const submitAnswer = useCallback(async (questionId, answerText) => {
    setSubmitPending(true);
    setSubmitError(null);
    try {
      const res = await api.post(
        `/qa/${questionId}/answer`,
        { answer: answerText },
        { headers: getAuthHeader() }
      );
      const updated = res.data?.qa || res.data;
      // Merge updated item into local state
      if (mounted.current)
        setQa((prev) =>
          prev.map((q) =>
            (q._id || q.id) === questionId ? { ...q, ...updated } : q
          )
        );
      return updated;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit answer.";
      if (mounted.current) setSubmitError(msg);
      throw new Error(msg);
    } finally {
      if (mounted.current) setSubmitPending(false);
    }
  }, []);

  // ── Context value ──────────────────────────────────────────────────────────
  const value = {
    // Data
    reviews,
    qa,
    // Loading states
    reviewsLoading,
    qaLoading,
    submitPending,
    // Error states
    reviewsError,
    qaError,
    submitError,
    setSubmitError,    // lets components clear the error banner
    // Helpful map  { [reviewId]: true }  so UI can disable the button
    helpfulPending,
    // Actions
    fetchReviews,
    fetchQA,
    submitReview,
    markHelpful,
    submitQuestion,
    submitAnswer,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * useReviews()
 * Must be called inside a <ReviewProvider>.
 */
export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) {
    throw new Error("useReviews must be used inside <ReviewProvider>.");
  }
  return ctx;
}

export default ReviewContext;