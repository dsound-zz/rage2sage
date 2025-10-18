"use client";

import { useState } from "react";
import issues from "@/data/issue.json";
import type { Issue } from "@/types";

export default function Home() {
  const [zip, setZip] = useState("");
  const [anonId] = useState(() => crypto.randomUUID());

  const typedIssues = issues as Issue[];

  const trackClick = async (action_id: string, issue: string) => {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue, zip, anon_id: anonId }),
    });
  };

  return (
    <>
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold">Feel enraged? Do something.</h1>
          <p className="text-gray-600 mt-2">
            Turn your outrage into real action. Choose an issue below.
          </p>
          <input
            placeholder="Enter ZIP (optional)"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="mt-4 border rounded p-2 text-center w-32"
          />
        </section>

        <section className="grid grid-cols-2 gap-4">
          {typedIssues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => trackClick("view_issue", issue.id)}
              className="border rounded-lg p-6 text-lg font-semibold hover:bg-gray-100 hover:cursor-pointer"
            >
              {issue.label}
            </button>
          ))}
        </section>

        {/* later: feed section + action modals */}
      </main>
      <footer className="text-xs text-center text-gray-400 mt-8">
        v{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local"}
      </footer>
    </>
  );
}
