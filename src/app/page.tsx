"use client";

import { useState, useEffect } from "react";
import type { Issue } from "@/types";
import IssueModal from "@/components/IssueModal";
import Header from "@/components/Header";
import HomeFeed from "@/components/HomeFeed";

interface FeedItem {
  issue: string;
  title: string;
  link: string;
  image: string;
  curated?: boolean;
  priority?: number;
  source?: string;
}

export default function Home() {
  const [zip, setZip] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonId] = useState(() => {
    return crypto.randomUUID();
  });

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await fetch("/api/curated-feed");
        const data = await response.json();
        setFeedData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching curated feed:", error);
        setFeedData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  const openModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsOpen(true);
  };

  const trackClick = async (action_id: string, issue: string) => {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue, zip, anon_id: anonId }),
    });
  };

  return (
    <>
      <Header onOpenModal={openModal} />

      <main style={{ padding: "3rem 0" }}>
        <div className="container">
          <HomeFeed anonId={anonId} onOpenModal={openModal} />
        </div>
      </main>

      {/* Issue Modal */}
      {isOpen && selectedIssue && (
        <IssueModal
          isOpen={isOpen}
          onClose={() => {
            return setIsOpen(false);
          }}
          issue={selectedIssue}
          zip={zip}
          anonId={anonId}
        />
      )}
    </>
  );
}
