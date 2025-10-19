"use client";

import { useState, useEffect } from "react";
import issues from "@/data/issue.json";
import type { Issue } from "@/types";
import Image from "next/image";

interface FeedItem {
  issue: string;
  title: string;
  link: string;
  image: string;
  curated?: boolean;
  priority?: number;
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
      .then((res) => res.json())
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
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Latest News</h2>
        <div className="text-center py-8">Loading news...</div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.link}
            className={`border rounded p-4 mb-5 ${
              item.curated
                ? "border-yellow-400 bg-yellow-50 shadow-lg"
                : "border-gray-200"
            }`}
          >
            {item.curated && (
              <div className="flex items-center mb-2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                  ✨ CURATED
                </span>
                {item.priority === 1 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    FEATURED
                  </span>
                )}
              </div>
            )}
            {item.image && (
              <Image
                src={item.image}
                width={500}
                height={500}
                alt={`Image of ${item.title}`}
                onError={(e) => {
                  console.log("Image failed to load:", item.image);
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-2">
              <a href={item.link} target="_blank" className="underline">
                Read story
              </a>
            </p>
            <button
              onClick={() => {
                trackClick("feed_action", item.issue);
                const issue = issues.find((issue) => issue.id === item.issue);
                if (issue) onOpenModal(issue);
              }}
              className="mt-3 bg-blue-600 text-white px-3 py-1  hover:bg-gray-100 hover:cursor-pointer rounded"
            >
              Take Action on {item.issue}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
