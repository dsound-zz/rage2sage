import { Issue } from "@/types";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IssueModalProps {
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
}: IssueModalProps) {
  const trackClick = async (actionLabel: string, issueId: string) => {
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
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal wrapper */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl transition-all">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                {/* Modal content */}
                <div className="text-left space-y-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    {issue.label}
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    Choose an action to make a difference:
                  </p>

                  <div className="space-y-3">
                    {issue.actions.map((action) => {
                      return (
                        <a
                          key={action.url}
                          href={action.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            return trackClick(action.label, issue.id);
                          }}
                          className="block w-full rounded-md bg-blue-600 px-4 py-3 text-white text-center text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          {action.label}
                        </a>
                      );
                    })}
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-4 w-full rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
