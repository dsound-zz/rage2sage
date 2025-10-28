"use client";

import { useState, useEffect } from "react";
import issues from "@/data/issue.json";
import type { Issue, Location } from "@/types";

interface FeedItem {
  issue: string;
  title: string;
  link: string;
  image: string;
  location?: Location | null;
  curated?: boolean;
  priority?: number;
  source?: string;
}

interface HomeFeedProps {
  anonId: string;
  selectedIssue: string | null;
  onOpenModal: (issue: Issue) => void;
}

export default function HomeFeed({
  anonId,
  selectedIssue,
  onOpenModal,
}: HomeFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const issueColors = {
    "ICE RAIDS": "primary",
    CLIMATE: "secondary",
  };

  // Map feed issue names to issue data IDs
  const getIssueId = (feedIssue: string) => {
    // Normalize spaces and underscores
    if (feedIssue === "CLIMATE_CRISIS") return "CLIMATE_CRISIS";
    if (feedIssue === "ICE_RAIDS" || feedIssue === "ICE RAIDS")
      return "ICE RAIDS";
    return feedIssue;
  };

  // Convert issue ID to display name (remove underscores)
  const getDisplayName = (issueId: string) => {
    return issueId
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (letter) => {
        return letter.toUpperCase();
      });
  };

  const trackClick = async (action_id: string, issue: string) => {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue, zip: "", anon_id: anonId }),
    });
  };

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Feed data received:", data);
        // Ensure data is an array to prevent map errors
        const safeData = Array.isArray(data) ? data : [];

        // Debug: log each item's issue and location
        safeData.forEach((item) => {
          console.log(
            `UI Item: "${item.title}" - Issue: ${item.issue} - Location:`,
            item.location
          );
        });

        setItems(safeData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feed:", error);
        setLoading(false);
      });
  }, []);

  // Filter items based on selected issue
  const filteredItems = selectedIssue
    ? items.filter((item) => {
        return item.issue === selectedIssue;
      })
    : items;

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
        {filteredItems.length === 0 && !loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--neutral-500)",
            }}
          >
            No articles found for this filter.
          </div>
        ) : null}
        {filteredItems.map((item) => {
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

              {item.image && item.image !== "null" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        borderRadius: "0.75rem",
                        cursor: "pointer",
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </a>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
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
                  {item.location &&
                    (item.location.city || item.location.state) && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--neutral-700)",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(
                            [item.location.city, item.location.state]
                              .filter(Boolean)
                              .join(", ")
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          style={{
                            display: "inline-block",
                            transition: "transform 0.2s ease",
                            cursor: "pointer",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <span style={{ fontSize: "0.875rem" }}>📍</span>
                        </a>
                        <span>
                          {[item.location.city, item.location.state]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                </div>

                <button
                  onClick={async () => {
                    trackClick("feed_action", item.issue);
                    const issueId = getIssueId(item.issue);

                    // Find base issue first
                    const baseIssue = issues.find((issue) => {
                      return issue.id === issueId;
                    });

                    if (!baseIssue) return;

                    // Open modal immediately with empty actions (to show loading)
                    const loadingIssue: Issue = {
                      id: baseIssue.id,
                      label: baseIssue.label,
                      actions: [],
                    };
                    onOpenModal(loadingIssue);

                    try {
                      // Fetch location-specific actions
                      const actionsResponse = await fetch(
                        "/api/get-location-actions",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            issue: issueId,
                            location: item.location,
                          }),
                        }
                      );

                      const actionsData = await actionsResponse.json();

                      // Combine local and national actions
                      const allActions = [
                        ...(actionsData.localActions || []),
                        ...(actionsData.nationalActions || []),
                      ];

                      // Update with actual actions
                      const updatedIssue: Issue = {
                        id: baseIssue.id,
                        label: baseIssue.label,
                        actions: allActions,
                      };
                      onOpenModal(updatedIssue);
                    } catch (error) {
                      console.error("Error fetching location actions:", error);
                      // On error, use base issue actions
                      onOpenModal(baseIssue);
                    }
                  }}
                  className={`btn btn-small ${
                    issueColors[item.issue as keyof typeof issueColors] ===
                    "secondary"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  style={{
                    width: "100%",
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
