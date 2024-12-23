import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";
import { login as loginApi, signUp as signUpApi, logout as logoutApi } from "../services/auth";
import type { SignInInput, SignUpInput } from "../types";

export const useAuth = () => {
  const router = useRouter();
  const { setUser, setToken, clearAuth } = useAuthStore();

  const login = useCallback(async (data: SignInInput) => {
    try {
      const response = await loginApi(data);
      setUser(response.user);
      setToken(response.token);
      toast.success("ログインしました");
      router.push("/applications/diary");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      throw error;
    }
  }, [router, setUser, setToken]);

  const signUp = useCallback(async (data: SignUpInput) => {
    try {
      const response = await signUpApi(data);
      setUser(response.user);
      setToken(response.token);
      toast.success("アカウントを作成しました");
      router.push("/applications/diary");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      throw error;
    }
  }, [router, setUser, setToken]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      clearAuth();
      toast.success("ログアウトしました");
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      throw error;
    }
  }, [router, clearAuth]);

  return {
    login,
    signUp,
    logout,
    user: useAuthStore((state) => state.user),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
  };
}; 