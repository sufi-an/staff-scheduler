"use client";

import { Staff } from "@prisma/client";
import {
  MoreHorizontal,
  Heart,
  Briefcase,
  Globe,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    case "Onboarding":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
    case "Suspended":
      return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export function StaffCard({ staff }: { staff: Staff }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`}
            />
            <AvatarFallback>
              {staff.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              {staff.name}
            </h3>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Job Title */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="w-5 flex justify-center">
            <Briefcase className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Job Title
            </span>
            <span className="font-medium">
              {staff.jobTitle || "Not specified"}
            </span>
          </div>
        </div>

        {/* Nationality */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="w-5 flex justify-center">
            <Globe className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Nationality
            </span>
            <span className="font-medium flex items-center gap-2">
              {staff.nationality}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="w-5 flex justify-center">
            <MapPin className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Location
            </span>
            <span className="font-medium flex items-center gap-2">
              {staff.location}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 text-sm pt-1">
          <div className="w-5 flex justify-center" />
          <Badge
            variant="outline"
            className={`${getStatusColor(
              staff.status
            )} rounded-full px-3 py-0.5 border-0`}
          >
            {staff.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
