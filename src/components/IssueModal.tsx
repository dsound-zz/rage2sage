import { Issue } from "@/types";
import { Dialog } from "@headlessui/react";

interface IssueModal {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
  zip: string;
  anonId: string;
}

export default function IssueModal({
  isOpen,
  onClose,
  issue,
  zip,
  anonId,
}: IssueModal) {
  const trackClick = async (actionLabel: string, issueId: string) => {
    // Create a meaningful action_id from the label
    const action_id = actionLabel
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_");

    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id, issue: issueId, zip, anon_id: anonId }),
    });
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="mx-auto max-w-md rounded bg-white p-6">
          <h2 className="text-xl font-bold">{issue.label}</h2>
          <ul className="mt-4 space-y-2">
            {issue.actions.map((action) => (
              <li key={action.url}>
                <a
                  href={action.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick(action.label, issue.id)}
                  className="text-blue-600 underline"
                >
                  {action.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="mt-4 w-full rounded bg-gray-100 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
