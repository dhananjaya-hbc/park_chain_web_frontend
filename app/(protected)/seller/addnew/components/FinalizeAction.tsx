export default function FinalizeAction() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
      <h3 className="font-semibold text-gray-800 mb-4">Finalize</h3>
      <button className="w-full bg-green-500 text-white py-2.5 rounded-lg">Submit for Review</button>
      <button className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg">Save Draft</button>
    </div>
  );
}