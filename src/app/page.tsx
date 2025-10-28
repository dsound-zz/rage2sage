"use client";

import { useState } from "react";
import type { Issue } from "@/types";
import IssueModal from "@/components/IssueModal";
import Header from "@/components/Header";
import HomeFeed from "@/components/HomeFeed";

export default function Home() {
  const [zip] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedIssueFilter, setSelectedIssueFilter] = useState<string | null>(
    null
  );
  const [anonId] = useState(() => {
    return crypto.randomUUID();
  });

  const openModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsOpen(true);
  };

  return (
    <>
      <Header
        selectedIssue={selectedIssueFilter}
        onSelectIssue={setSelectedIssueFilter}
      />

      <main style={{ padding: "3rem 0" }}>
        <div className="container">
          <HomeFeed
            anonId={anonId}
            selectedIssue={selectedIssueFilter}
            onOpenModal={openModal}
          />
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
          isLoading={selectedIssue.actions.length === 0}
        />
      )}
    </>
  );
}
