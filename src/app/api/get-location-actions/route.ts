import { NextResponse } from "next/server";
import issues from "@/data/issue.json";

interface Location {
  city?: string;
  state?: string;
  zip?: string;
}

// Helper function to generate local action links
function getLocalActions(
  issue: string,
  location: Location
): Array<{ label: string; url: string }> {
  const actions: Array<{ label: string; url: string }> = [];

  const locationQuery = [location.city, location.state]
    .filter((loc) => {
      return Boolean(loc);
    })
    .join(", ");

  if (!locationQuery) {
    return [];
  }

  // Generate search URLs for local resources
  if (issue === "ICE RAIDS") {
    actions.push({
      label: `Find Immigration Services in ${locationQuery}`,
      url: `https://www.google.com/search?q=immigration+help+${encodeURIComponent(
        locationQuery
      )}`,
    });
    actions.push({
      label: `Contact Local Representatives`,
      url: `https://www.house.gov/representatives/find-your-representative`,
    });
    actions.push({
      label: `Find Local Protests in ${location.state || locationQuery}`,
      url: `https://www.google.com/search?q=immigration+protests+${encodeURIComponent(
        location.state || locationQuery
      )}`,
    });
  } else if (issue === "CLIMATE") {
    actions.push({
      label: `Find Climate Organizations in ${locationQuery}`,
      url: `https://www.google.com/search?q=climate+organizations+${encodeURIComponent(
        locationQuery
      )}`,
    });
    actions.push({
      label: `Join Local Climate Action`,
      url: `https://www.google.com/search?q=climate+action+groups+${encodeURIComponent(
        locationQuery
      )}`,
    });
    actions.push({
      label: `Contact Local Representatives`,
      url: `https://www.house.gov/representatives/find-your-representative`,
    });
  }

  return actions;
}

// Helper function to get national actions from issue.json
function getNationalActions(
  issue: string
): Array<{ label: string; url: string }> {
  const issueData = issues.find((i) => {
    return i.id === issue;
  });
  return issueData?.actions || [];
}

export async function POST(req: Request) {
  try {
    const { issue, location } = await req.json();

    if (!issue) {
      return NextResponse.json({ error: "Issue is required" }, { status: 400 });
    }

    // Get both local and national actions
    const localActions = location
      ? getLocalActions(issue, location as Location)
      : [];
    const nationalActions = getNationalActions(issue);

    return NextResponse.json({
      localActions,
      nationalActions,
    });
  } catch (error) {
    console.error("Error getting location actions:", error);
    return NextResponse.json(
      { error: "Failed to get location actions" },
      { status: 500 }
    );
  }
}
