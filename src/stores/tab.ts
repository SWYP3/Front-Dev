import { create } from "zustand";

type TabState = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const useTabStore = create<TabState>((set) => ({
  activeTab: "",
  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  }
}));
