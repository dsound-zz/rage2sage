"use client";

import { useState, useEffect } from "react";
import type { Issue } from "@/types";
import IssueModal from "@/components/IssueModal";
import Header from "@/components/Header";
import IssueButtons from "@/components/IssueButtons";
import FeedCard from "@/components/FeedCard";

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
      <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 space-y-16 py-16">
            {/* Header Section */}
            <Header />

            {/* ZIP Code Section */}
            <section className="text-center">
              <input
                placeholder="Enter ZIP (optional)"
                value={zip}
                onChange={(e) => {
                  return setZip(e.target.value);
                }}
                className="border border-neutral-300 rounded-xl px-4 py-3 text-center w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white shadow-sm"
              />
            </section>

            {/* Issue Selection Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-neutral-900">
                Choose an issue below and make a difference
              </h2>
              <div className="border-t border-neutral-200 pt-8">
                <IssueButtons onOpenModal={openModal} trackClick={trackClick} />
              </div>
            </section>

            {/* Latest News Section */}
            <section className="space-y-8">
              <div className="border-t border-neutral-200 pt-8">
                <h2 className="text-2xl font-semibold text-center text-neutral-900 mb-8">
                  Latest News
                </h2>
                <div className="space-y-8">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-500">Loading latest news...</p>
                    </div>
                  ) : feedData.length > 0 ? (
                    feedData.map((item) => {
                      return (
                        <FeedCard
                          key={item.title}
                          item={item}
                          onOpenModal={openModal}
                          trackClick={trackClick}
                        />
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-500">
                        No news available at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-neutral-200 bg-white">
          <p className="text-neutral-500">
            Powered by outrage, fueled by hope.
          </p>
        </footer>
      </div>

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
