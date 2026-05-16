import { z } from "zod";

export const USER_ROLES = ["resident", "admin"] as const;
export type TUserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["pending", "active", "disabled"] as const;
export type TUserStatus = (typeof USER_STATUSES)[number];

export const userCreateSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(1, "Name is required").max(120),
  phone: z.string().nullable().optional(),
  role: z.enum(USER_ROLES),
  preferredLanguage: z.string().min(2).default("en"),
  password: z.string().min(8, "At least 8 characters"),
});

export type TUserCreateValues = z.infer<typeof userCreateSchema>;

export const userEditSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().nullable().optional(),
  role: z.enum(USER_ROLES),
  status: z.enum(USER_STATUSES),
  preferredLanguage: z.string().min(2),
});

export type TUserEditValues = z.infer<typeof userEditSchema>;

export type TUser = {
  id: string;
  hoaId: string;
  email: string;
  name: string;
  phone: string | null;
  role: TUserRole;
  status: TUserStatus;
  preferredLanguage: string;
  directoryOptOut: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
