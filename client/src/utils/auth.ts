import { SignUp } from "@/interfaces/auth.interface";
import { ApiAxiosInstance } from "./axios.config";

export const AuthService = {
  signUp: async (signUpData: SignUp) => {
    return await ApiAxiosInstance.post("/auth/signup", {
      email: signUpData.email,
      password: signUpData.password,
      role: signUpData.role,
    });
    // try {
    //   const response = await ApiAxiosInstance.post("/auth/signup", {
    //     email: signUpData.email,
    //     password: signUpData.password,
    //     role: signUpData.role,
    //   });
    //   console.log("response: ", response);
    //   return response.data;
    // } catch (error: any) {
    //   //return new Error(error.response?.data?.message || "Failed to sign up");
    //   throw new Error(error.response?.data?.message || "Failed to sign up");
    // }
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
