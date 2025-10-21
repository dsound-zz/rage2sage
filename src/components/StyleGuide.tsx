"use client";

import { useState } from "react";

export default function StyleGuide() {
  const [activeTab, setActiveTab] = useState("colors");

  const tabs = [
    { id: "colors", label: "Colors", icon: "🎨" },
    { id: "typography", label: "Typography", icon: "✍️" },
    { id: "components", label: "Components", icon: "🧩" },
    { id: "spacing", label: "Spacing", icon: "📏" },
    { id: "effects", label: "Effects", icon: "✨" },
  ];

  const colorPalettes = {
    primary: [
      {
        name: "Rage Red",
        class: "bg-red-500",
        hex: "#ef4444",
        usage: "Primary actions, urgent calls",
      },
      {
        name: "Deep Rage",
        class: "bg-red-700",
        hex: "#b91c1c",
        usage: "Hover states, emphasis",
      },
      {
        name: "Light Rage",
        class: "bg-red-100",
        hex: "#fee2e2",
        usage: "Backgrounds, subtle highlights",
      },
    ],
    action: [
      {
        name: "Action Blue",
        class: "bg-blue-500",
        hex: "#3b82f6",
        usage: "Secondary actions, links",
      },
      {
        name: "Deep Action",
        class: "bg-blue-700",
        hex: "#1d4ed8",
        usage: "Hover states, focus",
      },
      {
        name: "Light Action",
        class: "bg-blue-100",
        hex: "#dbeafe",
        usage: "Backgrounds, info states",
      },
    ],
    neutral: [
      {
        name: "Charcoal",
        class: "bg-gray-900",
        hex: "#111827",
        usage: "Text, headers",
      },
      {
        name: "Steel",
        class: "bg-gray-600",
        hex: "#4b5563",
        usage: "Secondary text",
      },
      {
        name: "Silver",
        class: "bg-gray-200",
        hex: "#e5e7eb",
        usage: "Borders, dividers",
      },
      {
        name: "Cloud",
        class: "bg-gray-50",
        hex: "#f9fafb",
        usage: "Backgrounds, cards",
      },
    ],
    semantic: [
      {
        name: "Success Green",
        class: "bg-green-500",
        hex: "#10b981",
        usage: "Success states, confirmations",
      },
      {
        name: "Warning Orange",
        class: "bg-orange-500",
        hex: "#f97316",
        usage: "Warnings, cautions",
      },
      {
        name: "Error Red",
        class: "bg-red-600",
        hex: "#dc2626",
        usage: "Errors, destructive actions",
      },
    ],
  };

  const typography = [
    {
      name: "Hero",
      class: "text-6xl font-black",
      example: "RAGE TO SAGE",
      usage: "Main headlines",
    },
    {
      name: "Display",
      class: "text-4xl font-bold",
      example: "Feel enraged?",
      usage: "Section headers",
    },
    {
      name: "Headline",
      class: "text-2xl font-semibold",
      example: "Latest News",
      usage: "Component titles",
    },
    {
      name: "Body Large",
      class: "text-lg font-normal",
      example: "Turn your outrage into real action.",
      usage: "Important content",
    },
    {
      name: "Body",
      class: "text-base font-normal",
      example: "Choose an issue below and make a difference.",
      usage: "Regular content",
    },
    {
      name: "Caption",
      class: "text-sm font-medium",
      example: "The Guardian",
      usage: "Labels, metadata",
    },
    {
      name: "Code",
      class: "text-sm font-mono bg-gray-100 px-2 py-1 rounded",
      example: "space-y-12",
      usage: "Code snippets",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-7xl font-black text-white mb-6 tracking-tight">
            RAGE TO SAGE
          </h1>
          <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
            Design System & Style Guide
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Live Design System</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8 py-4">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    return setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-red-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Color Palette
              </h2>
              <p className="text-xl text-gray-600">
                Colors that evoke emotion and drive action
              </p>
            </div>

            {Object.entries(colorPalettes).map(([category, colors]) => {
              return (
                <div key={category} className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">
                    {category} Colors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colors.map((color, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <div
                            className={`${color.class} w-full h-20 rounded-lg mb-4 shadow-sm`}
                          ></div>
                          <h4 className="font-bold text-gray-900 mb-1">
                            {color.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 font-mono">
                            {color.hex}
                          </p>
                          <p className="text-sm text-gray-500">{color.usage}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Color Combinations */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Color Combinations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-8 text-white">
                  <h4 className="text-2xl font-bold mb-2">Rage to Action</h4>
                  <p className="text-red-100">
                    Perfect for hero sections and call-to-actions
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white">
                  <h4 className="text-2xl font-bold mb-2">Calm to Sage</h4>
                  <p className="text-blue-100">
                    Great for informational content and secondary actions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === "typography" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Typography Scale
              </h2>
              <p className="text-xl text-gray-600">
                Typography that commands attention and guides action
              </p>
            </div>

            <div className="space-y-8">
              {typography.map((type, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {type.name}
                      </h3>
                      <code className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">
                        {type.class}
                      </code>
                    </div>
                    <div className={`${type.class} text-gray-900 mb-3`}>
                      {type.example}
                    </div>
                    <p className="text-sm text-gray-600">{type.usage}</p>
                  </div>
                );
              })}
            </div>

            {/* Font Showcase */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">Font Showcase</h3>
              <div className="space-y-4">
                <p className="text-2xl font-light">
                  Light: Inter brings clarity and warmth
                </p>
                <p className="text-2xl font-normal">
                  Regular: Perfect for body text and readability
                </p>
                <p className="text-2xl font-medium">
                  Medium: Great for emphasis and subheadings
                </p>
                <p className="text-2xl font-semibold">
                  Semibold: Strong for headings and labels
                </p>
                <p className="text-2xl font-bold">
                  Bold: Commands attention for important content
                </p>
                <p className="text-2xl font-black">
                  Black: Maximum impact for hero text
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Components Tab */}
        {activeTab === "components" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Components
              </h2>
              <p className="text-xl text-gray-600">
                Building blocks for our interface
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Buttons</h3>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      Primary Actions
                    </h4>
                    <button className="btn-primary w-full">
                      Take Action Now
                    </button>
                    <button className="btn-primary w-full opacity-75">
                      Disabled State
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      Secondary Actions
                    </h4>
                    <button className="btn-action w-full">Learn More</button>
                    <button className="btn-action w-full opacity-75">
                      Disabled State
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      Tertiary Actions
                    </h4>
                    <button className="btn-secondary w-full">Cancel</button>
                    <button className="btn-secondary w-full opacity-75">
                      Disabled State
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="font-bold text-lg mb-2">Standard Card</h4>
                  <p className="text-gray-600 mb-4">
                    This is a standard card with padding and shadow.
                  </p>
                  <button className="btn-action text-sm">Action</button>
                </div>
                <div className="card-hover">
                  <h4 className="font-bold text-lg mb-2">Hover Card</h4>
                  <p className="text-gray-600 mb-4">
                    This card has hover effects for interactivity.
                  </p>
                  <button className="btn-primary text-sm">Primary</button>
                </div>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Form Elements
              </h3>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Input Field
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Textarea
                    </label>
                    <textarea
                      placeholder="Your message..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacing Tab */}
        {activeTab === "spacing" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Spacing System
              </h2>
              <p className="text-xl text-gray-600">
                Consistent spacing for better rhythm and flow
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  name: "space-y-2",
                  size: "8px",
                  usage: "Tight spacing between small elements",
                },
                {
                  name: "space-y-4",
                  size: "16px",
                  usage: "Standard spacing between elements",
                },
                {
                  name: "space-y-6",
                  size: "24px",
                  usage: "Comfortable spacing for readability",
                },
                {
                  name: "space-y-8",
                  size: "32px",
                  usage: "Section spacing for mobile",
                },
                {
                  name: "space-y-12",
                  size: "48px",
                  usage: "Standard section spacing",
                },
                {
                  name: "space-y-16",
                  size: "64px",
                  usage: "Large section spacing",
                },
                {
                  name: "space-y-20",
                  size: "80px",
                  usage: "Extra large spacing",
                },
                {
                  name: "space-y-24",
                  size: "96px",
                  usage: "Hero spacing for impact",
                },
              ].map((space, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {space.name}
                      </h3>
                      <span className="text-sm text-gray-600 font-mono">
                        {space.size}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-red-500 rounded"></div>
                        <div className="h-4 bg-blue-500 rounded"></div>
                        <div className="h-4 bg-green-500 rounded"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{space.usage}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === "effects" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Effects & Animations
              </h2>
              <p className="text-xl text-gray-600">
                Visual effects that enhance user experience
              </p>
            </div>

            {/* Shadows */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Shadows</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h4 className="font-semibold mb-2">Soft Shadow</h4>
                  <p className="text-sm text-gray-600">shadow-sm</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-md">
                  <h4 className="font-semibold mb-2">Medium Shadow</h4>
                  <p className="text-sm text-gray-600">shadow-md</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h4 className="font-semibold mb-2">Large Shadow</h4>
                  <p className="text-sm text-gray-600">shadow-lg</p>
                </div>
              </div>
            </div>

            {/* Animations */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-8 shadow-sm animate-fade-in">
                  <h4 className="font-semibold mb-2">Fade In</h4>
                  <p className="text-sm text-gray-600">animate-fade-in</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-sm animate-slide-up">
                  <h4 className="font-semibold mb-2">Slide Up</h4>
                  <p className="text-sm text-gray-600">animate-slide-up</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-sm animate-pulse-slow">
                  <h4 className="font-semibold mb-2">Slow Pulse</h4>
                  <p className="text-sm text-gray-600">animate-pulse-slow</p>
                </div>
              </div>
            </div>

            {/* Special Effects */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Special Effects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-xl p-8 text-white">
                  <h4 className="font-bold text-xl mb-2">Gradient Text</h4>
                  <p className="text-red-100">
                    Perfect for hero text and emphasis
                  </p>
                </div>
                <div className="glass-effect rounded-xl p-8">
                  <h4 className="font-bold text-xl mb-2">Glass Effect</h4>
                  <p className="text-gray-700">Modern backdrop blur effect</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
