import { z } from "zod";

export const boardMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  role: z.string().min(1, "Role is required").max(60),
  email: z.string().email("Enter a valid email").nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  termEnd: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
});

export type TBoardMemberFormValues = z.infer<typeof boardMemberSchema>;

export type TBoardMember = TBoardMemberFormValues & {
  id: string;
  hoaId: string;
  createdAt: string;
};
