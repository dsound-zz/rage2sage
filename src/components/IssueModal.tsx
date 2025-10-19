import { Issue } from "@/types";
import { Dialog } from "@headlessui/react";

interface IssueModal {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
}

export default function IssueModal({ isOpen, onClose, issue }: IssueModal) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="mx-auto max-w-md rounded bg-white p-6">
          <h2 className="text-xl font-bold">{issue.label}</h2>
          <ul className="mt-4 space-y-2">
            {issue.actions.map((a) => (
              <li key={a.url}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {a.label}
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
