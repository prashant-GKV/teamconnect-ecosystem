import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar:    () => void;
  setSidebarCollapsed: (v: boolean) => void;

  // Theme (persisted in next-themes, but mirror here for SSR)
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;

  // Table density
  tableDensity: "compact" | "default" | "comfortable";
  setTableDensity: (d: "compact" | "default" | "comfortable") => void;

  // Task view mode per scope
  categoryTaskView: "list" | "board";
  projectTaskView:  "list" | "board";
  setCategoryTaskView: (v: "list" | "board") => void;
  setProjectTaskView:  (v: "list" | "board") => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed:    false,
      toggleSidebar:       () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      theme:    "system",
      setTheme: (t) => set({ theme: t }),

      tableDensity:    "default",
      setTableDensity: (d) => set({ tableDensity: d }),

      categoryTaskView:    "list",
      projectTaskView:     "list",
      setCategoryTaskView: (v) => set({ categoryTaskView: v }),
      setProjectTaskView:  (v) => set({ projectTaskView: v }),
    }),
    {
      name:    "tc-ui-state",
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        theme:            s.theme,
        tableDensity:     s.tableDensity,
        categoryTaskView: s.categoryTaskView,
        projectTaskView:  s.projectTaskView,
      }),
    }
  )
);