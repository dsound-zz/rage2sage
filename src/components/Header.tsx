import issues from "@/data/issue.json";
import type { Issue } from "@/types";

interface HeaderProps {
  onOpenModal: (issue: Issue) => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  const issueColors = {
    "ICE RAIDS": "primary",
    CLIMATE: "secondary",
  };

  // Convert issue ID to display name (remove underscores)
  const getDisplayName = (issueId: string) => {
    return issueId
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (letter) => {
        return letter.toUpperCase();
      });
  };

  return (
    <header
      style={{
        background:
          "linear-gradient(135deg, var(--neutral-900) 0%, var(--neutral-800) 100%)",
        color: "white",
        padding: "3rem 0",
        textAlign: "center",
      }}
    >
      <div className="container">
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Take Action
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--neutral-300)",
            marginBottom: "3rem",
            maxWidth: "600px",
            margin: "0 auto 3rem auto",
          }}
        >
          Stay informed and make a difference in your community
        </p>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {issues.map((issue) => {
            const colorClass =
              issueColors[issue.id as keyof typeof issueColors];
            return (
              <button
                key={issue.id}
                onClick={() => {
                  return onOpenModal(issue);
                }}
                className={`btn btn-large ${
                  colorClass === "secondary" ? "btn-secondary" : "btn-primary"
                }`}
                style={{
                  minWidth: "200px",
                }}
              >
                {getDisplayName(issue.id)}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
