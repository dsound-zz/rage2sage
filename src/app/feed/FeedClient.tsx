"use client";

import { useState } from "react";
import Image from "next/image";

interface FeedItem {
  issue: string;
  title: string;
  link: string;
  image: string;
}

interface FeedClientProps {
  items: FeedItem[];
}

export default function FeedClient({ items }: FeedClientProps) {
  const [anonId] = useState(() => crypto.randomUUID());

  const trackClick = async (action_id: string, issue: string) => {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue, zip: "", anon_id: anonId }),
    });
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {items.map((item) => (
        <article key={item.link} className="border rounded p-4">
          <a href={item.link} target="_blank" className="underline">
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={200}
              className="rounded"
            />
          </a>

          <h2 className="font-semibold text-lg">{item.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            <a href={item.link} target="_blank" className="underline">
              Read story
            </a>
          </p>
          <button
            onClick={() => trackClick("feed_action", item.issue)}
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Take Action on {item.issue}
          </button>
        </article>
      ))}
    </main>
  );
}
