"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
  isSameHour,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddShiftDialog } from "../dialogue/shift_dialogue";
import { EditShiftDialog } from "../dialogue/edit_shift_dialogue";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { StaffDetailsSheet } from "../dialogue/staff_detail_dialogue";
// --- TYPES ---
type ViewMode = "day" | "week" | "month";

type Staff = {
  id: string;
  name: string;
  jobTitle: string;
};

type Shift = {
  id: string;
  staffId: string;
  title: string;
  startTime: string; // ISO String from DB
  endTime: string; // ISO String from DB
  color?: string;
};

export function SchedulerView() {
  const MySwal = withReactContent(Swal);
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStaffSheetOpen, setIsStaffSheetOpen] = useState(false);
  const [viewedStaff, setViewedStaff] = useState<Staff | null>(null);

  // Dialog State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null); // The shift being edited
  // --- API FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Send the current date so backend knows which month to fetch
        const dateStr = format(currentDate, "yyyy-MM-dd");
        const res = await fetch(`/api/staff/booking?month=${dateStr}`);

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        // The API returns { staff: [], shifts: [] }
        setStaffList(data.staff);

        // Map DB data to Frontend Shift structure
        // (Adding default colors since DB might not have them)
        const mappedShifts = data.shifts.map((s: any) => ({
          ...s,
          color: "bg-blue-100 border-blue-200 text-blue-700", // Default style
        }));

        setShifts(mappedShifts);
      } catch (error) {
        console.error("Error loading scheduler data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentDate]); // <--- Re-run when user changes date

  // --- DATE LOGIC ---
  const handlePrev = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, -1));
    if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
    if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
  };

  // Generate Columns (The "Grid" X-Axis)
  const columns = useMemo(() => {
    switch (viewMode) {
      case "day":
        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);
        return eachHourOfInterval({ start: dayStart, end: dayEnd });

      case "month":
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });

      case "week":
      default:
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    }
  }, [currentDate, viewMode]);

  // Helper to check if a shift belongs in a cell
  const getShiftsForCell = (staffId: string, colDate: Date) => {
    return shifts.filter((s) => {
      const shiftStart = parseISO(s.startTime);

      if (s.staffId !== staffId) return false;

      if (viewMode === "day") {
        return isSameHour(shiftStart, colDate);
      } else {
        return isSameDay(shiftStart, colDate);
      }
    });
  };

  // --- SAVE HANDLER (From previous steps) ---
  const handleSaveShift = async (formData: any) => {
    try {
      // 1. Create the Local Date (e.g., 09:00 Local)
      const localDate = new Date(formData.date);
      const [startHour, startMinute] = formData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);

      const startDate = new Date(localDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(localDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // --- MAGICAL FIX HERE ---
      // We add 6 hours (your timezone offset) to the time.
      // So 09:00 becomes 15:00 internally.
      // When .toISOString() subtracts 6 hours later, it lands back on 09:00.

      const toUtcDate = (date: Date) => {
        // getTimezoneOffset() returns -360 for GMT+6.
        // We subtract it to add the minutes back.
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      };
      console.log(formData);

      const payload = {
        title: formData.title,
        staffId: formData.staffId,
        // Now using the helper to preserve local numbers
        startTime: toUtcDate(startDate).toISOString(),
        endTime: toUtcDate(endDate).toISOString(),
      };

      console.log("Sending to DB:", payload);
      // Now it should show: "2025-12-24T09:00:00.000Z"

      // ... rest of your fetch logic
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const savedBooking = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          await MySwal.fire({
            title: "Conflict",
            text: "Staff already booked in this time",
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        throw new Error(savedBooking.error || "Failed to create booking");
      }

      // Success Logic...
      setShifts((prev) => [
        ...prev,
        {
          ...savedBooking,
          color: "bg-purple-100 border-purple-300 text-purple-700",
        },
      ]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Something went wrong saving the shift.");
    }
  };
  // --- DELETE HANDLER ---
  const handleDeleteShift = async (id: string) => {
    // 1. Show Confirmation Modal
    console.log("fdoes come here");
    setIsEditModalOpen(false);
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for delete
      cancelButtonColor: "#3085d6", // Blue for keep
      confirmButtonText: "Yes, delete it!",
    });
    console.log(result);

    // 2. If user clicked "Cancel", stop here
    if (!result.isConfirmed) return;

    // 3. Proceed with API Call
    try {
      const res = await fetch(`/api/booking/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed");

      // 4. Success Feedback
      await MySwal.fire({
        title: "Deleted!",
        text: "The shift has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Remove from UI
      setShifts((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
      MySwal.fire(
        "Error!",
        "Something went wrong deleting the shift.",
        "error"
      );
    }
  };

  // --- UPDATE HANDLER ---
  const handleUpdateShift = async (id: string, formData: any) => {
    try {
      // 1. RE-CALCULATE TIME (Same logic as Create)
      const localDate = new Date(formData.date);
      const [startHour, startMinute] = formData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);

      const startDate = new Date(localDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(localDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);

      // Cancel Timezone
      const toUtcDate = (date: Date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000);

      const payload = {
        title: formData.title,
        staffId: formData.staffId,
        startTime: toUtcDate(startDate).toISOString(),
        endTime: toUtcDate(endDate).toISOString(),
      };

      // 2. SEND PATCH REQUEST
      const response = await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const updatedData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert(`❌ Conflict: ${updatedData.error}`);
          return;
        }
        throw new Error(updatedData.error);
      }

      // 3. UPDATE LOCAL STATE
      setShifts((prev) =>
        prev.map((s) => (s.id === id ? { ...updatedData, color: s.color } : s))
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };
  // custom formatters
  const formatHeader = (date: Date) => {
    if (viewMode === "day") return format(date, "HH:mm");
    if (viewMode === "month") return format(date, "d");
    return format(date, "d");
  };

  const formatSubHeader = (date: Date) => {
    if (viewMode === "day") return "";
    return format(date, "EEE");
  };

  const getCellMinWidth = () => {
    if (viewMode === "month") return "min-w-[50px]";
    if (viewMode === "day") return "min-w-[80px]";
    return "min-w-[140px]";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 font-semibold text-sm min-w-[140px] text-center">
              {viewMode === "day"
                ? format(currentDate, "MMMM d, yyyy")
                : format(currentDate, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            className="h-9"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {isLoading && (
            <span className="text-xs text-slate-400">Loading...</span>
          )}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            className="h-9 bg-purple-600 hover:bg-purple-700 gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Add Shift</span>
          </Button>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-20 bg-white shadow-sm">
              <tr>
                <th className="sticky left-0 z-30 w-64 p-4 text-left border-b border-r border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Staff Members
                  </span>
                </th>
                {columns.map((date, i) => (
                  <th
                    key={i}
                    className={`${getCellMinWidth()} border-b border-r border-slate-200 p-2 text-center bg-white`}
                  >
                    <div className="text-[10px] uppercase font-bold mb-1 text-slate-400">
                      {formatSubHeader(date)}
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        isSameDay(date, new Date())
                          ? "bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                          : "text-slate-700"
                      }`}
                    >
                      {formatHeader(date)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="group hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 p-3 border-b border-r border-slate-200 bg-white group-hover:bg-slate-50/50">
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" // Add cursor pointer
                      onClick={() => {
                        setViewedStaff(staff); // 1. Set the staff
                        setIsStaffSheetOpen(true); // 2. Open the sidebar
                      }}
                    >
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`}
                        />
                        <AvatarFallback>
                          {staff.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {staff.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {staff.jobTitle}{" "}
                        </div>
                      </div>
                    </div>
                  </td>
                  {columns.map((date, i) => {
                    const cellShifts = getShiftsForCell(staff.id, date);
                    const isPast =
                      date < new Date() && !isSameDay(date, new Date());
                    return (
                      <td
                        key={i}
                        onClick={() => {
                          if (isPast) return;
                          setSelectedStaffId(staff.id);
                          setSelectedDate(date);
                          setIsAddModalOpen(true);
                        }}
                        className={` border-b border-r border-slate-200 p-1 relative h-16 transition-colors
                          ${
                            isPast
                              ? "bg-slate-100 cursor-not-allowed opacity-60"
                              : "cursor-pointer hover:bg-slate-100"
                          }`}
                      >
                        <div className="space-y-1 h-full overflow-y-auto max-h-[100px]">
                          {cellShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`text-[10px] p-1 rounded border-l-2 shadow-sm truncate ${shift.color}`}
                              title={`${shift.title} `}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentShift(shift);
                                setIsEditModalOpen(true);
                              }}
                            >
                              {shift.startTime.slice(11, 16)}-
                              {shift.endTime.slice(11, 16)}
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DIALOGUE */}
      <AddShiftDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        defaultStaffId={selectedStaffId}
        defaultDate={selectedDate}
        staffList={staffList}
        onSave={handleSaveShift}
      />

      {/* 2. EDIT DIALOG */}
      <EditShiftDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        shift={currentShift}
        staffList={staffList}
        onUpdate={handleUpdateShift}
        onDelete={handleDeleteShift}
      />
      {/* Staff detail */}
      <StaffDetailsSheet
        open={isStaffSheetOpen}
        onOpenChange={setIsStaffSheetOpen}
        staff={viewedStaff}
      />
    </div>
  );
}
