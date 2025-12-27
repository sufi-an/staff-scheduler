'use client'

import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

export function AddShiftDialog({ 
  open, 
  onOpenChange, 
  defaultStaffId, 
  defaultDate,
  staffList,
  onSave
}: any) {
  
  const { register, handleSubmit, setValue, reset } = useForm()

  useEffect(() => {
    if (open && defaultStaffId && defaultDate) {
      setValue("staffId", defaultStaffId)
      setValue("date", format(defaultDate, "yyyy-MM-dd"))
      setValue("startTime", "09:00")
      setValue("endTime", "17:00")
    }
  }, [open, defaultStaffId, defaultDate, setValue])

  const onSubmit = (data: any) => {
    // Construct ISO strings for the parent component
    const startIso = new Date(`${data.date}T${data.startTime}`).toISOString()
    const endIso = new Date(`${data.date}T${data.endTime}`).toISOString()
    
    onSave({
      title: data.title || "New Shift",
      staffId: data.staffId,
      startTime: startIso,
      endTime: endIso
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Shift</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Staff</Label>
            <div className="col-span-3">
              <Select 
                disabled={!!defaultStaffId} 
                defaultValue={defaultStaffId || ""}
                onValueChange={(v) => setValue("staffId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Shift Title</Label>
            <Input id="title" placeholder="e.g. Morning Shift" className="col-span-3" {...register("title")} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Input type="date" className="col-span-3" {...register("date")} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Time</Label>
            <div className="col-span-3 flex gap-2">
              <Input type="time" {...register("startTime")} />
              <span className="self-center">-</span>
              <Input type="time" {...register("endTime")} />
            </div>
          </div>

          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
             <Button type="submit">Save Shift</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}