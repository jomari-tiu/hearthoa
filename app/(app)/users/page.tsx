import { Suspense } from "react";
import { UsersList } from "./_components/UsersList";

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersList />
    </Suspense>
  );
}
