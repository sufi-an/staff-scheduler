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
  addHours,
  eachHourOfInterval,
  isSameHour,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddShiftDialog } from "../dialogue/shift_dialogue";

// --- TYPES ---
type ViewMode = "day" | "week" | "month";

type Staff = {
  id: string;
  name: string;
  job_title: string;
};

type Shift = {
  id: string;
  staffId: string;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
};

export function SchedulerView() {
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  // Dialog State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // 1. Fetch Staff from API
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/staff");
        if (!res.ok) throw new Error("Failed to fetch staff");
        const data = await res.json();
        setStaffList(data);
      } catch (error) {
        console.error("Error loading staff:", error);
      }
    };

    fetchStaff();

    // // 2. Keep Mock Shifts (or replace with /api/shifts later)
    // setShifts([
    //   {
    //     id: "s1",
    //     staffId: "1", // Note: Ensure this matches a real ID from your DB to appear!
    //     title: "Morning Shift",
    //     startTime: new Date().toISOString(),
    //     endTime: addDays(new Date(), 0).toISOString(),
    //     color: "bg-blue-100 border-blue-200 text-blue-700",
    //   },
    // ]);
  }, []);

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
        // Returns 24 columns (00:00 to 23:00)
        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);
        return eachHourOfInterval({ start: dayStart, end: dayEnd });

      case "month":
        // Returns ~30 columns (1st to 31st)
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });

      case "week":
      default:
        // Returns 7 columns (Mon to Sun)
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
        // In daily view, match the specific HOUR
        return isSameHour(shiftStart, colDate);
      } else {
        // In week/month view, match the DAY
        return isSameDay(shiftStart, colDate);
      }
    });
  };

  /* submit */
  // 1. Define this handler function inside your component
  const handleSaveShift = async (formData: any) => {
    try {
      // PREPARE DATA:
      // Ensure startTime and endTime are full ISO strings.
      // If your Dialog gives you separate date + time strings, combine them here.
      // Example: const startISO = new Date(`${formData.date}T${formData.startTime}`).toISOString();

      const payload = {
        title: formData.title,
        staffId: formData.staffId,
        startTime: formData.startTime, // Must be ISO String
        endTime: formData.endTime, // Must be ISO String
      };

      // SEND TO API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const savedBooking = await response.json();

      // HANDLE ERRORS (Specifically Overlaps)
      if (!response.ok) {
        if (response.status === 409) {
          alert(` Schedule Conflict!\n\n${savedBooking.error}`);
          return; // Stop here, don't close modal
        }
        throw new Error(savedBooking.error || "Failed to create booking");
      }

      // SUCCESS: Update local state with the REAL data from DB
      setShifts((prev) => [
        ...prev,
        {
          ...savedBooking, // Contains the real DB ID and createdAt
          // Keep your frontend-only styling props if they aren't in DB
          color: "bg-purple-100 border-purple-300 text-purple-700",
        },
      ]);

      // Close the modal only on success
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Something went wrong saving the shift.");
    }
  };

  // Helper for formatting header dates
  const formatHeader = (date: Date) => {
    if (viewMode === "day") return format(date, "HH:mm");
    if (viewMode === "month") return format(date, "d");
    return format(date, "d"); // Weekly view shows day number
  };

  const formatSubHeader = (date: Date) => {
    if (viewMode === "day") return "";
    return format(date, "EEE"); // Mon, Tue, Wed
  };

  // Calculate cell width based on view mode
  const getCellMinWidth = () => {
    if (viewMode === "month") return "min-w-[50px]";
    if (viewMode === "day") return "min-w-[80px]";
    return "min-w-[140px]"; // Weekly is widest
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* --- 1. HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-slate-200 gap-4">
        {/* Date Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8 hover:bg-white shadow-sm"
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
              className="h-8 w-8 hover:bg-white shadow-sm"
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

        {/* View Toggles (Daily / Weekly / Monthly) */}
        <div className="flex items-center gap-4">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="hidden md:block"
          >
            <TabsList>
              {/* <TabsTrigger value="day">Daily</TabsTrigger> */}
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="h-9 bg-purple-600 hover:bg-purple-700 gap-2">
            <Plus className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Add Shift</span>
          </Button>
        </div>
      </div>

      {/* --- 2. SCROLLABLE GRID --- */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-white shadow-sm">
              <tr>
                {/* Fixed Staff Column Header */}
                <th className="sticky left-0 z-30 w-64 p-4 text-left border-b border-r border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Staff Members
                  </span>
                </th>

                {/* Dynamic Date Columns */}
                {columns.map((date, i) => {
                  const isToday = isSameDay(date, new Date());
                  return (
                    <th
                      key={i}
                      className={`${getCellMinWidth()} border-b border-r border-slate-200 p-2 text-center bg-white`}
                    >
                      <div
                        className={`text-[10px] uppercase font-bold mb-1 ${
                          isToday ? "text-purple-600" : "text-slate-400"
                        }`}
                      >
                        {formatSubHeader(date)}
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          isToday
                            ? "bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                            : "text-slate-700"
                        }`}
                      >
                        {formatHeader(date)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="group hover:bg-slate-50/50">
                  {/* Fixed Staff Column */}
                  <td className="sticky left-0 z-10 p-3 border-b border-r border-slate-200 bg-white group-hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`}
                        />
                        <AvatarFallback>
                          {staff.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {staff.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {staff.job_title}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dynamic Cells */}
                  {columns.map((date, i) => {
                    const cellShifts = getShiftsForCell(staff.id, date);
                    const isToday = isSameDay(date, new Date());

                    return (
                      <td
                        key={i}
                        onClick={() => {
                          setSelectedStaffId(staff.id);
                          setSelectedDate(date);
                          setIsAddModalOpen(true);
                        }}
                        className={`
                          border-b border-r border-slate-200 p-1 relative h-16 transition-colors cursor-pointer
                          ${isToday ? "bg-purple-50/10" : ""}
                          hover:bg-slate-100
                        `}
                      >
                        {/* Render Shifts in Cell */}
                        <div className="space-y-1 h-full overflow-y-auto max-h-[100px]">
                          {cellShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`
                                 text-[10px] p-1 rounded border-l-2 shadow-sm truncate
                                 ${
                                   shift.color ||
                                   "bg-blue-50 border-blue-400 text-blue-700"
                                 }
                               `}
                              title={`${shift.title} (${format(
                                parseISO(shift.startTime),
                                "HH:mm"
                              )} - ${format(
                                parseISO(shift.endTime),
                                "HH:mm"
                              )})`}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Editing ${shift.title}`);
                              }}
                            >
                              {viewMode === "day"
                                ? shift.title
                                : format(parseISO(shift.startTime), "HH:mm")}
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

      <AddShiftDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        defaultStaffId={selectedStaffId}
        defaultDate={selectedDate}
        staffList={staffList}
        onSave={handleSaveShift}
      />
    </div>
  );
}
