// Types + error class shared by client and server code. Must NOT import any
// server-only module (e.g. next/headers). Server-side helpers live in lib/session.ts.

export type SessionPayload = {
  userId: string;
  hoaId: string;
  role: "resident" | "admin";
  email: string;
  name: string;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
