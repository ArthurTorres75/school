import { SignUp } from "@/interfaces/auth.interface";
import { ApiAxiosInstance } from "./axios.config";

export const AuthService = {
  signUp: async (signUpData: SignUp) => {
    try {
      const response = await ApiAxiosInstance.post("/auth/signup", {
        data: {
          email: signUpData.email,
          password: signUpData.password,
          role: signUpData.role,
        },
      });
      return response.data;
      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(signUpData),
      //   }
      // );
      // return await response.json();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sign up");
    }
  },
  signIn: async (signInData: any) => {
    try {
      const response = await ApiAxiosInstance.post("/auth/signin", {
        signInData,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sign in");
    }
  },
  validateToken: () => {
    // Implementation
  },
};
