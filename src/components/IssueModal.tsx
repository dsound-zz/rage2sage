import { Issue } from "@/types";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
  zip: string;
  anonId: string;
  isLoading?: boolean;
}

export default function IssueModal({
  isOpen,
  onClose,
  issue,
  zip,
  anonId,
  isLoading = false,
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
        </TransitionChild>

        {/* Modal wrapper */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              minHeight: "100vh",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-95"
            >
              <DialogPanel
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "500px",
                  backgroundColor: "white",
                  padding: "1.5rem",
                  border: "1px solid #ccc",
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <XMarkIcon style={{ width: "20px", height: "20px" }} />
                </button>

                {/* Modal content */}
                <div>
                  <h2
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    {issue.label}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      color: "#666",
                    }}
                  >
                    Choose an action to make a difference:
                  </p>

                  {isLoading ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem 0",
                        minHeight: "200px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          border: "4px solid #f3f4f6",
                          borderTop: "4px solid #3b82f6",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <p style={{ marginTop: "1rem", color: "#6b7280" }}>
                        Finding local actions...
                      </p>
                    </div>
                  ) : (
                    <div>
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
                            className="btn btn-primary"
                            style={{
                              display: "block",
                              width: "100%",
                              marginBottom: "0.5rem",
                              textAlign: "center",
                              textDecoration: "none",
                            }}
                          >
                            {action.label}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="btn btn-secondary"
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
