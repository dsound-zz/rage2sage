"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Latest News
      </h2>
      <div className="space-y-6">
        {items.map((item) => {
          return (
            <article
              key={item.title}
              className={`card-hover ${
                item.curated ? "ring-2 ring-yellow-300 bg-yellow-50" : ""
              }`}
            >
              {" "}
              <a href={item.link} target="_blank" className="block group">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </a>
              <div className="flex flex-col md:flex-row gap-4">
                {item.image && (
                  <div className="md:w-48 flex-shrink-0">
                    <Image
                      src={item.image}
                      width={200}
                      height={150}
                      alt={`Image of ${item.title}`}
                      className="rounded-lg object-cover w-full h-32 md:h-full"
                      onError={(e) => {
                        console.log("Image failed to load:", item.image);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.source || "Unknown"}
                    </span>
                    {item.curated && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ✨ Curated
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => {
                        trackClick("feed_action", item.issue);
                        const issue = issues.find((issue) => {
                          return issue.id === item.issue;
                        });
                        if (issue) onOpenModal(issue);
                      }}
                      className="btn-action-fixed"
                    >
                      Take Action on {item.issue}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
