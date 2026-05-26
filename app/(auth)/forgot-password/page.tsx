/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { axiosClient } from "@/lib/axios";
import { enqueueSnackbar } from "notistack";

import { Button } from "@/components/ui/button";
import { AuthCard, AuthFooterLink, AuthHeader } from "../_components/auth-card";
import { AuthField } from "../_components/auth-controls";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });
      enqueueSnackbar(res.data?.message || "Đã gửi yêu cầu khôi phục!", { variant: "success" });
      setEmail(""); // clear the input
    } catch (error: any) {
      const errMessage = error.response?.data?.message;
      const displayMessage = Array.isArray(errMessage) ? errMessage[0] : errMessage;

      enqueueSnackbar(
        displayMessage || "Đã có lỗi xảy ra. Vui lòng thử lại.",
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
          title="Quên mật khẩu"
          subtitle="Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục."
        />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthField
            label="Email"
            type="email"
            placeholder="you@fpt.edu.vn"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button variant="authPrimary" size="auth" className="w-full font-bold" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin mx-auto" />
            ) : (
              <>Gửi link khôi phục <ArrowRight className="size-4" /></>
            )}
          </Button>
        </form>

        <Link href="/login" className="block">
          <Button variant="authSecondary" size="auth" type="button" className="mx-auto w-full font-medium sm:w-auto">
            <ArrowLeft className="size-4" />
            Quay lại trang Đăng nhập
          </Button>
        </Link>

        <AuthFooterLink
          label="Chưa có tài khoản?"
          href="/register"
          action="Đăng ký ngay"
        />
      </div>
    </AuthCard>
  );
}
