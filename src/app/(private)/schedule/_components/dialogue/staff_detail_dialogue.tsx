import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Edit,
  User,
  Calendar,
  MapPin,
  FileText,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface StaffDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: any | null;
}

export function StaffDetailsSheet({
  open,
  onOpenChange,
  staff,
}: StaffDetailsSheetProps) {
  if (!staff) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[800px] overflow-y-auto bg-slate-50 p-0 gap-0">
        {/*  HEADER  */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            ✕ Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <MoreHorizontal className="h-4 w-4" /> More actions
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/*  CLIENT  DATA  */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
              <User className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-500 uppercase">
                Client
              </span>
              <span className="ml-auto text-xs font-medium text-slate-400">
                Personal care
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Name</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 flex items-center justify-end gap-2">
                    Ryan Matthews
                    <span className="bg-sky-100 text-sky-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      Rebook
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Price book
                </span>
                <span className="text-sm text-slate-900">Demo Price Book</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Ratio
                </span>
                <span className="text-sm text-slate-900">
                  1:1, <span className="font-bold">Ref No. 1</span>
                </span>
              </div>
            </div>
          </div>

          {/*  TIME & LOCATION  */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-500 uppercase">
                Time & Location
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500">Time</span>
                <span className="text-sm font-bold text-slate-900">
                  09:30 am to 03:00 pm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500">Date</span>
                <div className="text-right">
                  <div className="text-sm text-slate-900">
                    Wed, 24 December 2025
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    Repeats every 1 weeks until 16 Jan 2026
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Address
                </span>
                <span className="text-sm text-slate-900 text-right w-1/2">
                  3/38 Keesing Crescent, Blackett NSW 2770, Australia
                </span>
              </div>
            </div>
          </div>

          {/*  STAFF INFGO  */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold text-slate-500 uppercase">
                Carer
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Name</span>
                <div className="flex items-center gap-2">
                  {/* Profile Image */}
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`}
                    />
                    <AvatarFallback>{staff.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-blue-600">
                    {staff.name}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Pay group
                </span>
                <span className="text-sm text-slate-900">
                  Staff member's default paygroup
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-500">Time</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">
                    09:30 am to 03:00 pm
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    5.5{" "}
                    <span className="font-normal text-slate-500">hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*   INSTRUCTIONS  */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
              <FileText className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-500 uppercase">
                Instructions
              </span>
            </div>
            <div className="p-4 text-sm text-slate-600 space-y-2">
              <p>• Do not wear your Staff ID badge</p>
              <p>• Wear semi casual Clothes</p>
              <p>• Do not force engagement/interaction go with the flow.</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
