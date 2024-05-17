import { create } from 'zustand';
import axios from 'axios';
import { api } from '../config/config';

interface WorkSpaceData {
    workSpaceName?: string | null;
    ownerEmail?: string | null;
    emailTemplates?: string[] | null;
}

interface WorkSpaceState {
    workSpaceData: WorkSpaceData | null;
    error: any;
    checkName: (workSpaceData: WorkSpaceData) => Promise<void>;
    addWorkSpace: (workSpaceData: WorkSpaceData) => Promise<void>;
    setWorkSpaceData: (workSpaceData: WorkSpaceData) => void;
}

const useWorkSpaceStore = create<WorkSpaceState>(set => ({
    workSpaceData: null,
    error: null,

    setWorkSpaceData: (workSpaceData: WorkSpaceData) => {
        set({ workSpaceData });
    },

    addWorkSpace: async (workSpaceData: WorkSpaceData) => {
        try {
            await axios.post(`${api.url}/workspace/add-workspace`, workSpaceData);
            set({ error: null });
        } catch (err: any) {
            const error =
                err.response?.data?.message ||
                err.message ||
                'An unknown error occurred';
            set({ error });
            throw error;
        }
    },

    checkName: async (workSpaceData: WorkSpaceData) => {
        try {
            await axios.post(`${api.url}/workspace/check-name`, workSpaceData);
            set({ error: null });
        } catch (err: any) {
            const error =
                err.response?.data?.error || err.message || 'An unknown error occurred';
            set({ error });
            throw error;
        }
    },
}));

export default useWorkSpaceStore;
