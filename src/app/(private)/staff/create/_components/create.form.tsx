"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staffSchema, StaffFormValues } from "./create.schema";

export function CreateStaffForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: yupResolver(staffSchema),
    defaultValues: {
      status: "Active",
    },
  });

  const onSubmit = async (data: StaffFormValues) => {
    setLoading(true);
    setServerError("");

    try {
      console.log(data);

      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create staff");
      }

      router.push("/staff");
      router.refresh();
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (value: string) => {
    setValue("status", value as any, { shouldValidate: true });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {serverError && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="Senior Designer"
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <p className="text-xs text-red-500">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              placeholder="e.g. American, Japanese"
              {...register("nationality")}
            />
            {errors.nationality && (
              <p className="text-xs text-red-500">
                {errors.nationality.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, USA"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Status  */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              onValueChange={handleSelectChange}
              defaultValue={watch("status")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Staff Member
          </Button>
        </div>
      </form>
    </div>
  );
}
