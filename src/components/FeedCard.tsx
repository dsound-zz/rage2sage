"use client";

import type { Issue } from "@/types";

interface FeedItem {
  issue: string;
  title: string;
  link: string;
  image: string;
  curated?: boolean;
  priority?: number;
  source?: string;
}

interface FeedCardProps {
  item: FeedItem;
  onOpenModal: (issue: Issue) => void;
  trackClick: (action_id: string, issue: string) => Promise<void>;
}

const issueConfig = {
  "ICE RAIDS": {
    gradient: "from-red-500 to-orange-500",
    label: "ICE Raids",
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
  CLIMATE: {
    gradient: "from-blue-500 to-green-500",
    label: "Climate Crisis",
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
  CLIMATE_CRISIS: {
    gradient: "from-blue-500 to-green-500",
    label: "Climate Crisis",
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
};

export default function FeedCard({
  item,
  onOpenModal,
  trackClick,
}: FeedCardProps) {
  const issueInfo = issueConfig[item.issue as keyof typeof issueConfig];

  const handleTakeAction = () => {
    trackClick("feed_action", item.issue);
    return onOpenModal({
      id: item.issue,
      label: issueInfo.label,
      description: `Take action on ${issueInfo.label}`,
      actions: issueInfo.actions,
    });
  };

  return (
    <article className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 space-y-3">
        <h3 className="font-semibold text-lg text-neutral-900 leading-snug">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.title}
          </a>
        </h3>
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>Source: {item.source}</span>
          <button
            onClick={handleTakeAction}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
              item.issue === "ICE RAIDS"
                ? "text-red-800 bg-gradient-to-br from-red-100 to-orange-100 border-red-200 hover:from-red-200 hover:to-orange-200"
                : "text-sky-800 bg-gradient-to-br from-sky-100 to-green-100 border-sky-200 hover:from-sky-200 hover:to-green-200"
            }`}
          >
            Take Action on {issueInfo?.label || item.issue}
          </button>
        </div>
      </div>
    </article>
  );
}
