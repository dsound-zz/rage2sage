import { Issue } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50 transition-opacity duration-300" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all duration-200 ease-out transform">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {issue.label}
                </h2>
                <p className="text-neutral-600">
                  Choose an action to make a difference:
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {issue.actions.map((action) => {
                  return (
                    <li key={action.url}>
                      <a
                        href={action.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          return trackClick(action.label, issue.id);
                        }}
                        className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {action.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={onClose}
                className="mt-6 w-full px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
