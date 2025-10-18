"use client";

import { useState } from "react";

const ISSUES = [
  { id: "ICE_RAIDS", label: "ICE Raids" },
  { id: "HOUSING", label: "Housing Injustice" },
  { id: "CLIMATE", label: "Climate Crisis" },
  { id: "DEMOCRACY", label: "Democracy & Voting" },
];

export default function Home() {
  const [zip, setZip] = useState("");
  const [anonId] = useState(() => crypto.randomUUID());

  const trackClick = async (action_id: string, issue: string) => {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue, zip, anon_id: anonId }),
    });
  };

  return (
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
        {ISSUES.map((issue) => (
          <button
            key={issue.id}
            onClick={() => trackClick("view_issue", issue.id)}
            className="border rounded-lg p-6 text-lg font-semibold hover:bg-gray-100"
          >
            {issue.label}
          </button>
        ))}
      </section>

      {/* later: feed section + action modals */}
    </main>
  );
}
