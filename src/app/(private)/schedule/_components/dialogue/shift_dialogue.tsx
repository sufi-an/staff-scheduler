import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStaffId: string | null;
  defaultDate: Date | null;
  staffList: any[];
  onSave: (data: any) => void;
}

export function AddShiftDialog({
  open,
  onOpenChange,
  defaultStaffId,
  defaultDate,
  staffList,
  onSave,
}: AddShiftDialogProps) {
  // --- STATE ---
  const [title, setTitle] = useState("Shift");
  const [staffId, setStaffId] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    if (open) {
      setStaffId(defaultStaffId || "");
      setStartTime("09:00");
      setEndTime("17:00");
      setTitle("Regular Shift");
    }
  }, [open, defaultStaffId, defaultDate]);

  // --- HANDLE SAVE ---
  const handleSubmit = () => {
    if (!staffId) {
      alert("Please select a staff member");
      return;
    }

  
    onSave({
      title,
      staffId,
      startTime,
      endTime,   
      date: defaultDate, //selected col
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Shift for {defaultDate ? format(defaultDate, "MMM dd, yyyy") : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Staff Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="staff" className="text-right">
              Staff
            </Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">
              Start
            </Label>
            <Input
              id="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end" className="text-right">
              End
            </Label>
            <Input
              id="end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
            Save Shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}