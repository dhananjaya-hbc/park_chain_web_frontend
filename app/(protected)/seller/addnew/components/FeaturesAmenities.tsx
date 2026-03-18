export default function FeaturesAmenities() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Features & Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {["CCTV", "24/7 Security", "Covered"].map((feature) => (
          <label key={feature} className="flex items-center justify-between border rounded-lg p-3"><span className="text-sm">{feature}</span><input type="checkbox" /></label>
        ))}
      </div>
    </div>
  );
}