"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";
import { axiosClient } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      axiosClient.get("/users/profile")
      .then(res => {
        const user = res.data?.data;
        if (!user) throw new Error("Invalid user data");
        
        // Show success snackbar
        enqueueSnackbar(
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="Avatar" 
                className="size-8 rounded-full border border-white/20 object-cover" 
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-[#ff7629]/20 text-[#ff7629] font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Đăng nhập thành công!</span>
              <span className="text-xs text-[#b9aaa2]">Chào mừng {user.name}</span>
            </div>
          </div>,
          { variant: "default", preventDuplicate: true }
        );

        queryClient.invalidateQueries({ queryKey: ['userProfile'] });

        // Redirect to Home
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        enqueueSnackbar("Lỗi khi lấy thông tin người dùng", { variant: "error" });
        router.push("/");
      });

    } else {
      enqueueSnackbar("Đăng nhập thất bại. Không tìm thấy token.", { variant: "error" });
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#0B0908] text-white">
      <Loader2 className="size-10 animate-spin text-[#ff7629]" />
      <p className="text-sm font-medium tracking-wide text-[#b9aaa2]">
        Authenticating...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#0B0908] text-white">
          <Loader2 className="size-10 animate-spin text-[#ff7629]" />
          <p className="text-sm font-medium tracking-wide text-[#b9aaa2]">
            Loading...
          </p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
