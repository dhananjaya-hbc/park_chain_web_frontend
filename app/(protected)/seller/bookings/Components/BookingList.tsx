import { Search, Calendar, User, Clock, Car, Hash, ChevronUp, ChevronDown } from "lucide-react";

// --- Types ---
export type BookingStatus = "pending" | "confirmed" | "active" | "completed";
export type PaymentStatus = "unpaid" | "processing" | "paid" | "split_completed" | "failed";

export interface Booking {
  id: string;
  spot_title: string;
  driver_name: string;
  driver_email: string;
  vehicle_type: string | null;
  vehicle_number: string | null;
  start_time: string;
  end_time: string;
  expected_duration_hours: string;
  actual_duration_hours: string | null;
  price_per_hour: string;
  total_price_xrp: string;
  admin_fee_xrp: string;
  seller_amount_xrp: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

// --- Format Helpers ---
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} • ${hours}:${minutes} ${period}`;
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${period}`;
}

export function formatDate(dateStr: string, endDateStr?: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const startFormat = `${months[date.getMonth()]} ${date.getDate()}`;

  if (!endDateStr) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const check = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (check.getTime() === today.getTime()) {
      return `Today, ${startFormat}`;
    }
    if (check.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${startFormat}`;
    }
    return `${startFormat}, ${date.getFullYear()}`;
  }

  const end = new Date(endDateStr);
  const endFormat = `${months[end.getMonth()]} ${end.getDate()}`;

  if (date.getFullYear() === end.getFullYear() &&
      date.getMonth() === end.getMonth() &&
      date.getDate() === end.getDate()) {
      
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const check = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (check.getTime() === today.getTime()) {
      return `Today, ${startFormat}`;
    }
    if (check.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${startFormat}`;
    }
    return `${startFormat}, ${date.getFullYear()}`;
  } else {
    return `${startFormat} - ${endFormat}`;
  }
}

// --- Mini UI Components ---
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
    unpaid: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    split_completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  const displayText = status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {displayText}
    </span>
  );
}

export function VehicleNumber({ value }: { value: string }) {
  return <span className="text-sm font-semibold text-gray-800 tracking-wider">{value}</span>;
}

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
];

interface Props {
  isLoading: boolean;
  error: string | null;
  filteredBookings: Booking[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  selectedBooking: Booking | null;
  setSelectedBooking: (booking: Booking | null) => void;
  fetchBookings: () => void;
}

export default function BookingList({
  isLoading, error, filteredBookings,
  searchQuery, setSearchQuery,
  activeFilter, setActiveFilter,
  selectedBooking, setSelectedBooking,
  fetchBookings
}: Props) {

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeFilter === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search spot, driver, plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin h-7 w-7 border-[3px] border-emerald-600 border-t-transparent rounded-full" />
            <p className="text-sm text-gray-500">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-center px-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-2">
              <Calendar className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No bookings found</p>
            <p className="text-xs text-gray-400 max-w-xs">
              {searchQuery || activeFilter !== "all"
                ? "Try adjusting your search or filter."
                : "When a driver books your spot, it will appear here."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const isSelected = selectedBooking?.id === booking.id;

            return (
              <div
                key={booking.id}
                className={`transition-colors duration-150 ${
                  isSelected ? "bg-gray-50" : "hover:bg-gray-50/60"
                }`}
              >
                {/* row */}
                <div
                  onClick={() => setSelectedBooking(isSelected ? null : booking)}
                  className="px-5 py-4 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Left */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={booking.booking_status} />
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {booking.spot_title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {booking.driver_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        {formatDate(booking.start_time, booking.end_time)}&nbsp;
                        {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                      </span>
                      {booking.vehicle_type && (
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {booking.vehicle_type}
                        </span>
                      )}
                      {booking.vehicle_number && (
                        <span className="font-semibold text-gray-700 tracking-wide">
                          {booking.vehicle_number}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                        Earnings
                      </p>
                      <p className="text-lg font-bold text-emerald-700">
                        {parseFloat(booking.seller_amount_xrp || "0").toFixed(2)}
                        <span className="text-xs font-semibold ml-1 text-emerald-600">XRP</span>
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 shadow-sm">
                      {isSelected ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {isSelected && (
                  <div className="px-5 pb-5">
                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-gray-100">
                        <div className="p-4 space-y-0.5">
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Driver</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.driver_name}</p>
                          <p className="text-xs text-gray-500 break-all">{booking.driver_email}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Vehicle</p>
                          {booking.vehicle_type || booking.vehicle_number ? (
                            <div className="space-y-1">
                              {booking.vehicle_type && (
                                <div className="flex items-center gap-1.5">
                                  <Car className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-800">{booking.vehicle_type}</span>
                                </div>
                              )}
                              {booking.vehicle_number && <VehicleNumber value={booking.vehicle_number} />}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not provided</span>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Duration & Rate</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {parseFloat(booking.actual_duration_hours || booking.expected_duration_hours).toFixed(1)} hrs
                          </p>
                          <p className="text-xs text-gray-500">@ {parseFloat(booking.price_per_hour).toFixed(2)} XRP/hr</p>
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                          <StatusBadge status={booking.payment_status} />
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs text-gray-500">Booked {formatDateTime(booking.created_at)}</span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-400 bg-white px-2.5 py-1 rounded-md border border-gray-200 self-start sm:self-auto">
                          <Hash className="w-3 h-3" />
                          {booking.id}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}