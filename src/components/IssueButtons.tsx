"use client";

import type { Issue } from "@/types";

interface IssueButtonsProps {
  onOpenModal: (issue: Issue) => void;
  trackClick: (action_id: string, issue: string) => Promise<void>;
}

const issues = [
  {
    id: "ICE_RAIDS",
    label: "ICE Raids",
    gradient: "from-red-500 to-orange-500",
    description: "Stand up for immigrant families",
    actions: [
      {
        label: "Contact Your Representative",
        url: "https://www.house.gov/representatives/find-your-representative",
      },
      {
        label: "Support Immigrant Rights Organizations",
        url: "https://www.aclu.org/issues/immigrants-rights",
      },
      {
        label: "Learn About Your Rights",
        url: "https://www.immigrationadvocates.org/resources/",
      },
    ],
  },
  {
    id: "CLIMATE_CRISIS",
    label: "Climate Crisis",
    gradient: "from-blue-500 to-green-500",
    description: "Fight for our planet",
    actions: [
      {
        label: "Join Climate Action Groups",
        url: "https://www.sunrisemovement.org/",
      },
      {
        label: "Support Green Energy Policies",
        url: "https://www.sierraclub.org/",
      },
      {
        label: "Reduce Your Carbon Footprint",
        url: "https://www.carbonfootprint.com/",
      },
    ],
  },
];

export default function IssueButtons({
  onOpenModal,
  trackClick,
}: IssueButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {issues.map((issue) => {
        const isIceRaids = issue.id === "ICE_RAIDS";
        return (
          <button
            key={issue.id}
            onClick={() => {
              trackClick("view_issue", issue.id);
              return onOpenModal({
                id: issue.id,
                label: issue.label,
                description: issue.description,
                actions: issue.actions,
              });
            }}
            className={`
              flex-1 rounded-xl py-8 px-6 text-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md
              ${
                isIceRaids
                  ? "text-red-800 bg-gradient-to-br from-red-100 to-orange-100 border border-red-200 hover:from-red-200 hover:to-orange-200"
                  : "text-sky-800 bg-gradient-to-br from-sky-100 to-green-100 border border-sky-200 hover:from-sky-200 hover:to-green-200"
              }
            `}
          >
            <div className="space-y-2">
              <div className="text-xl font-semibold">{issue.label}</div>
              <p className="text-sm font-normal">{issue.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
