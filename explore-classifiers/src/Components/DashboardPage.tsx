import { useState } from "react";
import Dashboard from "./Dashboard";
import { DEFAULT_SUMMARY } from "../Constants/Common/DashboardDefaults";

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState(DEFAULT_SUMMARY);

    return (
        <Dashboard
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
    );
}
