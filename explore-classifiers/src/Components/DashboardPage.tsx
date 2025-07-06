import { useState } from "react";
import Dashboard from "./Dashboard";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("default");

  return (
    <Dashboard
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
}
