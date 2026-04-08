import { create } from "zustand";

interface UserProfile {
  id: string;
  displayName: string;
  slug: string;
  role: string;
  city: string;
  verificationStatus: string;
  offersSupervision: boolean;
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        set({ profile: data.profile, isLoading: false });
      } else {
        set({ profile: null, isLoading: false });
      }
    } catch {
      set({ profile: null, isLoading: false });
    }
  },
}));
