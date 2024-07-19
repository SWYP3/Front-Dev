import axiosTooth from "@/api/api";

export type UserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
};

export interface UserProfile {
  id: string;
  email: string;
  profileImageUrl: string;
  username: string;
}

export const postUserInfo = async (userInfo: UserInfo) => {
  const reqBody = {
    profileObj: {
      id: userInfo.id,
      picture: userInfo.picture,
      email: userInfo.email,
      name: userInfo.name
    }
  };
  const response = await axiosTooth.post(`/oauth/jwt/google`, reqBody);
  return response.data;
};

export const fetchUserInfo = async (token: string): Promise<UserInfo> => {
  const response = await axiosTooth.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosTooth.get("/api/user/profile");
  return response.data;
};
