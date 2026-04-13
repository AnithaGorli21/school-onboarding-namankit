// ============================================================
//  src/sections/FinalSubmit.jsx
// ============================================================
import { useState } from "react";
import ReviewPage from "./ReviewPage";

export default function FinalSubmit({ savedData, onTabChange }) {
  const [showReview,  setShowReview]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  // ── Confirm-submit dialog ────────────────────────────────
  const ConfirmDialog = () => (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #d6e0e0",
          borderRadius: 4,
          padding: "28px 32px",
          width: 420,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "#222", marginBottom: 10 }}>
          Confirm Final Submission
        </div>
        <p style={{ fontSize: 13, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to submit the data for academic year <strong>2026-2027</strong>?
          <br />
          <span style={{ color: "#cc0000" }}>
            You will <strong>not</strong> be able to edit or delete the data once submitted.
          </span>
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => setShowConfirm(false)}
            style={{
              padding: "6px 22px", fontSize: 13, borderRadius: 3,
              border: "1px solid #ccc", background: "#f5f5f5",
              cursor: "pointer", color: "#333",
            }}
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              try {
                // API call — replace with real endpoint
                await new Promise(r => setTimeout(r, 1000));
                setShowConfirm(false);
                setSubmitted(true);
              } catch {
                alert("Submission failed. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
            style={{
              padding: "6px 22px", fontSize: 13, borderRadius: 3,
              border: "none",
              background: submitting ? "#aaa" : "#5cb85c",
              color: "#fff", cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Review mode ─────────────────────────────────────────
  if (showReview) {
    return (
      <ReviewPage
        savedData={savedData}
        onBack={() => setShowReview(false)}
      />
    );
  }

  // ── Submitted success screen ─────────────────────────────
  if (submitted) {
    return (
      <div style={{ padding: "16px 20px 32px" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #d6e0e0",
            borderRadius: 3,
            padding: "48px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#3c763d", marginBottom: 8 }}>
            School Profile Submitted Successfully!
          </div>
          <p style={{ fontSize: 13, color: "#555", maxWidth: 480, margin: "0 auto 20px" }}>
            Your data for academic year <strong>2026-2027</strong> has been submitted.
            No further edits are possible.
          </p>
          <button
            onClick={() => setShowReview(true)}
            style={{
              padding: "7px 22px", fontSize: 13, borderRadius: 3,
              border: "none", background: "#1C8FB8", color: "#fff", cursor: "pointer",
            }}
          >
            View Submitted Data
          </button>
        </div>
      </div>
    );
  }

  // ── Main Final Submit screen ─────────────────────────────
  return (
    <div style={{ padding: "16px 20px 32px" }}>
      {showConfirm && <ConfirmDialog />}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #d6e0e0",
          borderRadius: 3,
          padding: "40px 20px 48px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 400, color: "#222", marginBottom: 20 }}>
          Submit School Profile
        </h2>

        <p style={{ fontSize: 13, color: "#333", maxWidth: 680, margin: "0 auto 28px", lineHeight: 1.7 }}>
          <strong>Instructions :</strong> - Do you wish to submit the data for academic year{" "}
          <strong>2026-2027</strong> ...Please note that you will not be able to edit / delete
          the data once you submit it.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Review button — view all data */}
          <button
            onClick={() => setShowReview(true)}
            style={{
              padding: "7px 26px",
              fontSize: 13,
              borderRadius: 3,
              border: "none",
              background: "#1C8FB8",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Review
          </button>

          {/* Final Submit button */}
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              padding: "7px 26px",
              fontSize: 13,
              borderRadius: 3,
              border: "none",
              background: "#5cb85c",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Final Submit
          </button>
        </div>
      </div>
    </div>
  );
}
