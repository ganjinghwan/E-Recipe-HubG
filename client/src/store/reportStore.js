import { create } from "zustand";

export const useReportStore = create((set) => ({
    isLoading: false,
    reports: [],
    error: null,


    fetchAllReports: async () => {
        const res = await fetch("/api/reports/allReports");
        const data = await res.json();
        set({ reports: data.data });
    },

}))