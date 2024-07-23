import axiosClient from "./axiosApi/axiosClient";

export const getLoginedCommunityList = async ({ pageParam = 0 }) => {
  const limit = 10;
  const response = await axiosClient.get(`api/community`, {
    params: {
      offset: pageParam,
      limit: limit
    }
  });
  return { posts: response.data, nextOffset: pageParam + limit };
};

export const PostCommunity = async (formData: any) => {
  const response = await axiosClient.post(`/community/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const getCommunityPost = async (postId: number) => {
  const response = await axiosClient.get(`api/community/${postId}`);
  return response.data;
};