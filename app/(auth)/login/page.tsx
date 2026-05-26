"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2, Mail, Shield } from "lucide-react";
import { isAxiosError } from "axios";
import { axiosClient } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

import {
  AuthCard,
  AuthDivider,
  AuthFooterLink,
  AuthHeader,
} from "../_components/auth-card";
import { Button } from "@/components/ui/button";
import { AuthField } from "../_components/auth-controls";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/signin", formData);
      
      // Save token (if any frontend handling is needed, though axios handles bearer auto now)
      if (res.data?.data?.accessToken) {
        localStorage.setItem("access_token", res.data.data.accessToken);
      }

      enqueueSnackbar("Đăng nhập thành công!", { variant: "success" });
      
      // Update global user state
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      
      // Redirect to home/dashboard
      router.push("/");
    } catch (error: unknown) {
      enqueueSnackbar(
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
          : "Đăng nhập thất bại. Vui lòng thử lại.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="space-y-5">
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue to the SEAL command center."
        />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthField
            label="Email"
            name="email"
            type="email"
            placeholder="you@fpt.edu.vn"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <AuthField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Shield className="size-4" />}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#b9aaa2] sm:text-sm">
            <label className="flex items-center gap-3">
              <span className="grid size-5 place-items-center rounded-md border border-white/20 bg-white/[0.03] text-[#ff7629]">
                <Check className="size-4" />
              </span>
              Remember me
            </label>
            <Link href="/forgot-password" className="hover:text-[#ff7629]">
              Forgot password?
            </Link>
          </div>

          <Button variant="authPrimary" size="auth" className="w-full font-bold" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin mx-auto" />
            ) : (
              <>Login <ArrowRight className="size-4" /></>
            )}
          </Button>
        </form>

        <AuthDivider />

        <div className="grid gap-2 sm:grid-cols-2">
          <a href="http://localhost:3000/api/auth/google" className="block w-full">
            <Button variant="authSecondary" size="auth" type="button" className="w-full font-medium">
              <span className="text-lg font-semibold">G</span>
              Google
            </Button>
          </a>
          <Button variant="authSecondary" size="auth" type="button" className="font-medium">
            <span className="size-4 rounded-full border-[0.4rem] border-white" />
            GitHub
          </Button>
        </div>

        <AuthFooterLink
          label="Don't have an account?"
          href="/register"
          action="Register"
        />
      </div>
    </AuthCard>
  );
}
