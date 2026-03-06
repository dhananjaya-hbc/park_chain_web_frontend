"use client";

export default function ApprovalTablePagination() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">1</span> to <span className="font-semibold text-gray-700">5</span> of <span className="font-semibold text-gray-700">12</span> pending results
      </p>
      <div className="flex items-center gap-3">
        <button type="button" className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Previous
        </button>
        <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-[#4CAF50] border border-[#4CAF50] rounded-md hover:bg-[#43a047] transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}