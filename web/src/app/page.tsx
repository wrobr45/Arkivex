"use client";

import React, { useState } from "react";
import LandingPage from "./landing/page";
import ExecutiveDashboard from "./dashboard/page";

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("landing");

  if (viewMode === "landing") {
    return <LandingPage />;
  }

  return <ExecutiveDashboard />;
}
