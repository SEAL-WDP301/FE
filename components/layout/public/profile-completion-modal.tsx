/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { enqueueSnackbar } from "notistack";
import { axiosClient } from "@/lib/axios";

// Zod schemas
const studentSchema = z.object({
  studentType: z.enum(["fpt", "external"]),
  studentCode: z.string().min(1, "Mã số sinh viên là bắt buộc"),
  universityName: z.string().optional(),
  phone: z.string().optional(),
});

const stakeholderSchema = z.object({
  jobTitle: z.string().optional(),
  organization: z.string().optional(),
  experience: z.string().optional(),
  achievements: z.string().optional(),
  bio: z.string().optional(),
});

export function ProfileCompletionModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange?: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("student");
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: { studentType: "fpt", studentCode: "", universityName: "Đại học FPT", phone: "" },
  });

  const watchStudentType = studentForm.watch("studentType");

  const stakeholderForm = useForm<z.infer<typeof stakeholderSchema>>({
    resolver: zodResolver(stakeholderSchema),
    defaultValues: { jobTitle: "", organization: "", experience: "", achievements: "", bio: "" },
  });

  const onStudentSubmit = async (values: z.infer<typeof studentSchema>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        universityName: values.studentType === "fpt" ? "Đại học FPT" : values.universityName,
      };
      await axiosClient.put("/users/profile/student", payload);
      enqueueSnackbar("Cập nhật hồ sơ sinh viên thành công", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onOpenChange?.(false);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStakeholderSubmit = async (values: z.infer<typeof stakeholderSchema>) => {
    setIsSubmitting(true);
    try {
      await axiosClient.put("/users/profile/stakeholder", values);
      enqueueSnackbar("Cập nhật hồ sơ đối tác thành công", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onOpenChange?.(false);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hoàn thiện hồ sơ</DialogTitle>
          <DialogDescription>
            Vui lòng chọn vai trò và cung cấp thông tin để tiếp tục sử dụng hệ thống.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Học sinh / Sinh viên</TabsTrigger>
            <TabsTrigger value="stakeholder">Đối tác / Doanh nghiệp</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={studentForm.control}
                  name="studentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trường đại học</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trường đại học">
                              {(val: string | null) =>
                                val === "fpt" ? "Đại học FPT" :
                                  val === "external" ? "Trường khác" :
                                    "Chọn trường đại học"
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fpt" >Đại học FPT</SelectItem>
                          <SelectItem value="external">Trường khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="studentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã số sinh viên (*)</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: SE123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchStudentType === "external" && (
                  <FormField
                    control={studentForm.control}
                    name="universityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên trường Đại học (*)</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Đại học Bách Khoa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={studentForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: 0987654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu hồ sơ Sinh viên"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="stakeholder">
            <Form {...stakeholderForm}>
              <form onSubmit={stakeholderForm.handleSubmit(onStakeholderSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={stakeholderForm.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức danh</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: CEO, Manager, Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stakeholderForm.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tổ chức / Công ty</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: FPT Software" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stakeholderForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh nghiệm</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: 5 năm trong lĩnh vực AI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stakeholderForm.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành tựu</FormLabel>
                      <FormControl>
                        <Input placeholder="Các thành tựu nổi bật..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stakeholderForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiểu sử ngắn</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Vài nét về bản thân..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu hồ sơ Đối tác"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
