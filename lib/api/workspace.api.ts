import { axiosClient } from "../axios";

export interface StudentMyEvent {
  teamId: number;
  teamName: string;
  teamStatus: string;
  event: {
    id: number;
    name: string;
    season: string;
    year: number;
    status: string;
  };
}

export const workspaceApi = {
  getMyEvents: async (): Promise<StudentMyEvent[]> => {
    const response = await axiosClient.get("/student/teams/my-events");
    return response.data?.data ?? [];
  },

  getWorkspaceOverview: async (eventId: number) => {
    const response = await axiosClient.get(`/student/teams/my-team/workspace`, {
      params: { eventId },
    });
    return response.data;
  },

  submitProject: async (formData: FormData) => {
    const response = await axiosClient.post(
      `/student/teams/my-team/submissions`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
