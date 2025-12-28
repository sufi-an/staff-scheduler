import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
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

interface EditShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: any | null;
  staffList: any[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export function EditShiftDialog({
  open,
  onOpenChange,
  shift,
  staffList,
  onUpdate,
  onDelete,
}: EditShiftDialogProps) {
  const [title, setTitle] = useState("");
  const [staffId, setStaffId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (open && shift) {
      setTitle(shift.title);
      setStaffId(shift.staffId);
    
      setStartTime(shift.startTime.slice(11, 16)); // 
      setEndTime(shift.endTime.slice(11, 16));
    }
  }, [open, shift]);

  const handleUpdate = () => {
    if (!shift) return;
    onUpdate(shift.id, {
      title,
      staffId,
      startTime,
      endTime,
      date: new Date(shift.startTime), 
    });
  };

  const handleDelete = () => {
    if (shift ) {
      onDelete(shift.id);
    }
  };

  if (!shift) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">Title</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-staff" className="text-right">Staff</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {staffList.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-start" className="text-right">Start</Label>
            <Input type="time" id="edit-start" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-end" className="text-right">End</Label>
            <Input type="time" id="edit-end" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="col-span-3" />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
          <Button onClick={handleUpdate} className="bg-purple-600 hover:bg-purple-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}