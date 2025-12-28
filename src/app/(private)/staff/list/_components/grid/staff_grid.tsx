"use client";

import { useEffect, useState } from "react";
import { Staff } from "@prisma/client";
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffCard } from "../card/staff_card";
import Link from "next/link";

export default function StaffGrid() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setStaffList(data);
        } else {
          console.error("API returned invalid format:", data);
          setStaffList([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch staff:", err);
        setStaffList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-slate-50 border-0 h-9"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 bg-white shadow-sm rounded-md"
            >
              <LayoutGrid className="h-4 w-4 text-slate-700" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-white/50"
            >
              <ListIcon className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="current" className="hidden lg:block">
          <TabsList className="bg-transparent h-9 gap-2">
            <TabsTrigger
              value="current"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-full px-4 text-slate-500"
            >
              Current Staff
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-full px-4 text-slate-500"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="onboarding"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-full px-4 text-slate-500"
            >
              Onboarding
            </TabsTrigger>
            <TabsTrigger
              value="terminated"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-full px-4 text-slate-500"
            >
              Terminated
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2 rounded-lg border-slate-200 text-slate-600"
          >
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Link href="/staff/create">
            <Button className="gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4" /> Add Staff
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400">
          Loading staff...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {staffList.map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
          {staffList.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-slate-400">
              No staff members found. Click "Add Staff" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
