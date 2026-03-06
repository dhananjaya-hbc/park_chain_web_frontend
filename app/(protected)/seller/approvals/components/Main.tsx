import ApprovalTabs from "./ApprovalTabs";
import ApprovalTable from "./ApprovalTable";

export default function ApprovalsMain() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* 1. The Tabs (All, Pending, Verified, etc.) */}
      <ApprovalTabs />

      {/* 2. The Main Table (which holds your rows, badges, and pagination) */}
      <ApprovalTable />

    </div>
  );
}