"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface ClickData {
  id: number;
  action_id: string;
  issue: string;
  zip: string;
  anon_id: string;
  created_at: string;
}

interface IssueStats {
  issue: string;
  count: number;
  [key: string]: string | number;
}

interface DailyStats {
  date: string;
  clicks: number;
}

interface CuratedArticle {
  id: string;
  title: string;
  link: string;
  image_url: string | null;
  issue: string;
  priority: number;
  source: string;
  created_at: string;
}

interface FeedArticle {
  issue: string;
  title: string;
  link: string;
  image: string | null;
  curated?: boolean;
  priority?: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "curation">(
    "analytics"
  );
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [issueStats, setIssueStats] = useState<IssueStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch stats");

      setClicks(data.clicks);
      setTotalClicks(data.totalClicks);
      setUniqueUsers(data.uniqueUsers);
      setIssueStats(data.issueStats);
      setDailyStats(data.dailyStats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your news feed and analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("curation")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "curation"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                News Curation
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "analytics" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Clicks
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalClicks}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Unique Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {uniqueUsers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Clicks/User
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {uniqueUsers > 0
                        ? (totalClicks / uniqueUsers).toFixed(1)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Issue Distribution Bar Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Clicks by Issue
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={issueStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="issue" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Issue Distribution Pie Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Issue Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={issueStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ issue, percent }) =>
                        `${issue} ${((percent as number) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {issueStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Activity Line Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Activity (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Clicks Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Clicks
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ZIP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clicks.slice(0, 10).map((click) => (
                      <tr key={click.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {click.issue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {click.action_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {click.zip || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(click.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "curation" && <NewsCurationTab />}
      </div>
    </div>
  );
}

// News Curation Component
function NewsCurationTab() {
  const [curatedArticles, setCuratedArticles] = useState<CuratedArticle[]>([]);
  const [availableArticles, setAvailableArticles] = useState<FeedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({
    title: "",
    link: "",
    image_url: "",
    issue: "ICE_RAIDS" as "ICE_RAIDS" | "CLIMATE",
    priority: 0,
  });

  useEffect(() => {
    fetchCuratedArticles();
    fetchAvailableArticles();
  }, []);

  const fetchCuratedArticles = async () => {
    try {
      const response = await fetch("/api/admin/curated-articles");
      const data = await response.json();
      setCuratedArticles(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching curated articles:", error);
      setLoading(false);
    }
  };

  const fetchAvailableArticles = async () => {
    try {
      const response = await fetch("/api/feed");
      const data = await response.json();
      setAvailableArticles(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching available articles:", error);
      setLoading(false);
    }
  };

  const addToCurated = async (article: FeedArticle) => {
    try {
      await fetch("/api/admin/curated-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          link: article.link,
          image_url: article.image,
          issue: article.issue,
          priority: 0,
          source: "automated",
        }),
      });
      fetchCuratedArticles();
    } catch (error) {
      console.error("Error adding curated article:", error);
    }
  };

  const addNewArticle = async () => {
    if (!newArticle.title || !newArticle.link || !newArticle.issue) {
      alert("Please fill in title, link, and issue");
      return;
    }

    try {
      await fetch("/api/admin/curated-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newArticle.title,
          link: newArticle.link,
          image_url: newArticle.image_url || null,
          issue: newArticle.issue,
          priority: newArticle.priority,
          source: "manual",
        }),
      });

      // Reset form
      setNewArticle({
        title: "",
        link: "",
        image_url: "",
        issue: "ICE_RAIDS",
        priority: 0,
      });

      fetchCuratedArticles();
    } catch (error) {
      console.error("Error adding curated article:", error);
    }
  };

  const removeFromCurated = async (id: string) => {
    try {
      await fetch(`/api/admin/curated-articles?id=${id}`, {
        method: "DELETE",
      });
      fetchCuratedArticles();
    } catch (error) {
      console.error("Error removing curated article:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Article Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Article
          </h3>
          <p className="text-sm text-gray-600">
            Manually add articles to your curated feed
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={newArticle.title}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article URL *
              </label>
              <input
                type="url"
                value={newArticle.link}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, link: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/article"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={newArticle.image_url}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, image_url: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Category *
              </label>
              <select
                value={newArticle.issue}
                onChange={(e) =>
                  setNewArticle({
                    ...newArticle,
                    issue: e.target.value as "ICE_RAIDS" | "CLIMATE",
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ICE_RAIDS">ICE Raids / Immigration</option>
                <option value="CLIMATE">Climate Crisis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={newArticle.priority}
                onChange={(e) =>
                  setNewArticle({
                    ...newArticle,
                    priority: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Regular</option>
                <option value={1}>Featured</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={addNewArticle}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Articles */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Curated Articles ({curatedArticles.length})
          </h3>
          <p className="text-sm text-gray-600">
            Hand-picked articles that appear in your feed
          </p>
        </div>
        <div className="p-6">
          {curatedArticles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No curated articles yet. Add some using the form above.
            </p>
          ) : (
            <div className="space-y-4">
              {curatedArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-600">{article.issue}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      {article.priority === 1 && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          FEATURED
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Added{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCurated(article.id)}
                    className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Articles */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Articles ({availableArticles.length})
          </h3>
          <p className="text-sm text-gray-600">
            Articles from Guardian API and RSS feeds - click to curate
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {availableArticles.map((article, index) => {
              const isCurated = curatedArticles.some(
                (ca) => ca.link === article.link
              );
              return (
                <div
                  key={`${article.link}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900">
                        {article.title}
                      </h4>
                      {article.curated && (
                        <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                          ✨ CURATED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{article.issue}</p>
                  </div>
                  <button
                    onClick={() => addToCurated(article)}
                    disabled={isCurated}
                    className={`ml-4 px-3 py-1 text-sm rounded ${
                      isCurated
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isCurated ? "Added" : "Add to Curated"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
