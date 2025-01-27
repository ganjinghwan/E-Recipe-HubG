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

    deleteReport: async (rptid) => {
        const res = await fetch(`/api/reports/${rptid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) {
            return { success: false, message: data.message };
        }
        set((state) => ({
            reports: state.reports.filter((report) => report._id !== rptid),
        }));
        return { success: true, message: "Report action being passed successfully." };
    },  

}))