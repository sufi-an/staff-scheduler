import * as yup from "yup"

export const staffSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  jobTitle: yup
    .string()
    .required("Job title is required"),
  nationality: yup
    .string()
    .required("Nationality is required"),
  location: yup
    .string()
    .required("Location is required"),
  status: yup
    .string()
    .oneOf(["Active", "Inactive", "Pending", "Suspended"], "Invalid status")
    .required("Status is required"),
}).required()

export type StaffFormValues = yup.InferType<typeof staffSchema>