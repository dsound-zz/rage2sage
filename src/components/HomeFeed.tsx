"use client";

import { useState, useEffect } from "react";
import issues from "@/data/issue.json";
import type { Issue } from "@/types";

interface FeedItem {
  issue: string;
  title: string;
  link: string;
  image: string;
  curated?: boolean;
  priority?: number;
  source?: string;
}

interface HomeFeedProps {
  anonId: string;
  onOpenModal: (issue: Issue) => void;
}

export default function HomeFeed({ anonId, onOpenModal }: HomeFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const issueColors = {
    ICE_RAIDS: "primary",
    CLIMATE: "secondary",
  };

  // Convert issue ID to display name
  const getDisplayName = (issueId: string) => {
    return issueId.replace(/_/g, " ");
  };

  const trackClick = async (action_id: string, issue: string) => {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue, zip: "", anon_id: anonId }),
    });
  };

  useEffect(() => {
    fetch("/api/curated-feed")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Curated feed data received:", data);
        // Ensure data is an array to prevent map errors
        const safeData = Array.isArray(data) ? data : [];
        setItems(safeData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching curated feed:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest News</h2>
        <div className="text-center py-8">Loading news...</div>
      </section>
    );
  }

  return (
    <section>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          fontSize: "2.5rem",
          fontFamily: "Playfair Display, serif",
          fontWeight: "600",
          color: "var(--neutral-900)",
        }}
      >
        Latest News
      </h2>
      <div
        style={{
          display: "grid",
          gap: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {items.map((item) => {
          return (
            <article
              key={item.title}
              style={{
                background: "white",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: "1px solid var(--neutral-200)",
                transition: "all 0.2s ease",
              }}
            >
              <a
                href={item.link}
                target="_blank"
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: "600",
                    fontSize: "1.5rem",
                    lineHeight: "1.3",
                    color: "var(--neutral-900)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
              </a>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--neutral-500)",
                    fontStyle: "italic",
                  }}
                >
                  {item.source || "Unknown"}
                </div>

                <button
                  onClick={() => {
                    trackClick("feed_action", item.issue);
                    const issue = issues.find((issue) => {
                      return issue.id === item.issue;
                    });
                    if (issue) onOpenModal(issue);
                  }}
                  className={`btn btn-small ${
                    issueColors[item.issue as keyof typeof issueColors] ===
                    "secondary"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  style={{
                    flexShrink: 0,
                  }}
                >
                  Take Action on {getDisplayName(item.issue)}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
