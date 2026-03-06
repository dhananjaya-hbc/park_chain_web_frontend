import ApprovalsMain from "./components/Main";

// Optional but highly recommended: Sets the browser tab title
export const metadata = {
  title: "Approvals | Park Chain",
  description: "Manage and view your verification approvals.",
};

export default function ApprovalsPage() {
  return (
    // We just return the main container here!
    <ApprovalsMain />
  );
}
