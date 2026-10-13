// Dev-only impersonation store — switches the mock API user role for demo purposes
import { create } from "zustand";
import type { UserWithRoles } from "@teamconnect/shared-types";
import { SEED_USERS } from "@/lib/mocks/seed-data";

interface ImpersonateStore {
  activeUserId: string;
  activeUser:   UserWithRoles;
  setUser:      (id: string) => void;
}

export const useImpersonateStore = create<ImpersonateStore>((set) => ({
  activeUserId: SEED_USERS[0]?._id ?? "",
  activeUser:   SEED_USERS[0]!,
  setUser: (id) => {
    const user = SEED_USERS.find((u) => u._id === id) ?? SEED_USERS[0]!;
    set({ activeUserId: id, activeUser: user });
  },
}));