"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Bell, Calendar, MailOpen, Mail, Clock, ExternalLink, Download, AlertCircle, CheckCircle2, XCircle, Trash2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { Button } from "@/components/ui/button";

// ==========================================
// DYNAMIC TEMPLATES
// ==========================================

const TeamAssignedTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Chào bạn,</p>
    <p>
      Hệ thống thông báo có một sự thay đổi về thành viên trong đội thi của bạn. Vui lòng kiểm tra thông tin chi tiết bên dưới.
    </p>
    
    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
      <p className="text-blue-600 dark:text-blue-400 font-bold text-base mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        THÔNG TIN CẬP NHẬT
      </p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-orange-500" />
        BƯỚC TIẾP THEO
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Truy cập vào trang quản lý đội để xem chi tiết danh sách thành viên hiện tại.</li>
        <li>Nhanh chóng kết nối và phân chia công việc để chuẩn bị cho vòng thi sắp tới.</li>
      </ul>
    </div>
    
    <div className="pt-6 border-t border-border mt-8">
      <p>Trân trọng,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name || 'Hệ thống SEAL'}</p>
    </div>
  </div>
);

const RegistrationApprovedTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Kính gửi Đội trưởng,</p>
    
    <p>
      Ban tổ chức xin chúc mừng đội thi của bạn đã nộp hồ sơ đăng ký thành công!
    </p>
    
    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
      <p className="text-green-600 dark:text-green-400 font-bold text-base mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        ĐĂNG KÝ HỢP LỆ
      </p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <Download className="w-4 h-4 text-orange-500" />
        TÀI LIỆU QUAN TRỌNG
      </h3>
      <p className="mb-2">Vui lòng tải xuống và đọc kỹ các quy định của sự kiện:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li><strong>Thể lệ cuộc thi:</strong> Nắm rõ luật chơi và tiêu chí chấm điểm.</li>
        <li><strong>Hướng dẫn nền tảng:</strong> Cách sử dụng hệ thống nộp bài.</li>
      </ul>
    </div>

    <div className="pt-6 border-t border-border mt-8">
      <p>Trân trọng,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Ban tổ chức ${notification.event.name}` : 'Ban tổ chức sự kiện'}</p>
    </div>
  </div>
);

const RegistrationRejectedTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Kính gửi Đội trưởng,</p>
    
    <p>
      Ban tổ chức rất tiếc phải thông báo rằng hồ sơ đăng ký của đội bạn chưa đáp ứng đủ yêu cầu của sự kiện lần này.
    </p>
    
    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
      <p className="text-red-600 dark:text-red-400 font-bold text-base mb-2 flex items-center gap-2">
        <XCircle className="w-5 h-5" />
        LÝ DO TỪ CHỐI
      </p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        HƯỚNG DẪN KHẮC PHỤC
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Nếu sự kiện vẫn đang trong thời hạn mở đăng ký, bạn có thể bổ sung thông tin và nộp lại hồ sơ.</li>
        <li>Vui lòng kiểm tra kỹ lại thông tin thành viên và các tài liệu đính kèm.</li>
      </ul>
    </div>

    <div className="pt-6 border-t border-border mt-8">
      <p>Trân trọng,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Ban tổ chức ${notification.event.name}` : 'Ban tổ chức sự kiện'}</p>
    </div>
  </div>
);

const RoundResultTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Kính gửi Đội thi,</p>
    
    <p>
      Kết quả của vòng thi vừa qua đã chính thức được công bố. Cảm ơn các bạn đã nỗ lực hết mình!
    </p>
    
    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
      <p className="text-orange-600 dark:text-orange-400 font-bold text-base mb-2">🎉 KẾT QUẢ VÒNG THI</p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-orange-500" />
        HỖ TRỢ THÊM
      </h3>
      <p className="mb-2">Nếu có bất kỳ thắc mắc nào về kết quả chấm điểm, vui lòng liên hệ:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li><strong>Email BTC:</strong> support@seal.edu.vn</li>
        <li>Gửi câu hỏi trực tiếp thông qua hệ thống Ticket của cuộc thi.</li>
      </ul>
    </div>

    <div className="pt-6 border-t border-border mt-8">
      <p>Trân trọng,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Hội đồng Chuyên môn ${notification.event.name}` : 'Hội đồng Chuyên môn'}</p>
    </div>
  </div>
);

const GenericTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
    <p>Xin chào,</p>
    <p className="whitespace-pre-wrap">{notification.content}</p>
    <br />
    <div className="pt-6 border-t border-border mt-8">
      <p>Trân trọng,</p>
      <p className="font-bold">Hệ thống SEAL</p>
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function NotificationsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch Real Data
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const res = await axiosClient.get('/users/notifications');
      return res.data.data;
    },
  });

  const selectedNotification = notifications.find((n: any) => n.id === selectedId) || notifications[0];

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.patch(`/users/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.patch('/users/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      enqueueSnackbar("Đã đánh dấu tất cả là đã đọc", { variant: 'success' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/users/notifications/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      if (selectedId === id) setSelectedId(null);
      enqueueSnackbar("Đã xoá thông báo", { variant: 'info' });
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete('/users/notifications/all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      setSelectedId(null);
      enqueueSnackbar("Đã xoá tất cả thông báo", { variant: 'info' });
    }
  });

  const handleSelectNotification = (notif: any) => {
    setSelectedId(notif.id);
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif.id);
    }
  };

  // Helper to map type to template
  const renderTemplate = (notification: any) => {
    switch (notification.type) {
      case 'team_assigned':
        return <TeamAssignedTemplate notification={notification} />;
      case 'registration_approved':
        return <RegistrationApprovedTemplate notification={notification} />;
      case 'registration_rejected':
        return <RegistrationRejectedTemplate notification={notification} />;
      case 'round_result':
      case 'final_result':
      case 'finalist':
        return <RoundResultTemplate notification={notification} />;
      default:
        return <GenericTemplate notification={notification} />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-6 h-6 text-orange-500" />
          Hộp thư Thông báo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Cập nhật tin tức, thông báo và lịch trình mới nhất từ hệ thống và các sự kiện.</p>
      </div>

      {/* Main Inbox Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Notification List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-border bg-card/20 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tất cả thông báo</h2>
              <span className="bg-orange-500/10 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {notifications.length}
              </span>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-8 text-muted-foreground"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending || notifications.every((n: any) => n.isRead)}
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                  Đọc tất cả
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả thông báo không?")) {
                      deleteAllMutation.mutate();
                    }
                  }}
                  disabled={deleteAllMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Đang tải thông báo...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p>Bạn chưa có thông báo nào.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {notifications.map((notif: any) => {
                const isSelected = selectedNotification?.id === notif.id;
                return (
                  <div key={notif.id} className="relative group">
                    <button
                      onClick={() => handleSelectNotification(notif)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl transition-all duration-200 border border-transparent",
                        isSelected
                          ? "bg-muted shadow-sm border-border/50" 
                          : "hover:bg-muted/50",
                        !notif.isRead && !isSelected ? "bg-orange-500/5 border-orange-500/20" : ""
                      )}
                    >
                      <div className="flex justify-between items-start mb-2 pr-6">
                        <div className="flex items-center gap-2">
                          {!notif.isRead ? (
                            <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                          ) : (
                            <MailOpen className={cn("w-4 h-4 shrink-0", isSelected ? "text-orange-500" : "text-muted-foreground")} />
                          )}
                          <span className="text-xs font-semibold text-muted-foreground truncate max-w-[120px]" title={notif.event?.name || 'Hệ thống SEAL'}>
                            {notif.event?.name || 'Hệ thống SEAL'}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <h3 className={cn(
                        "text-sm line-clamp-2 leading-snug",
                        !notif.isRead ? "font-bold text-foreground" : "font-medium text-foreground/80"
                      )}>
                        {notif.title}
                      </h3>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(notif.id);
                      }}
                      className="absolute top-4 right-3 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1 rounded-md"
                      title="Xóa thông báo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed View */}
        <div className="flex-1 bg-background overflow-y-auto relative">
          {selectedNotification ? (
            <div className="max-w-4xl mx-auto p-8 md:p-12">
              
              {/* Email Header Style */}
              <div className="mb-8 pb-6 border-b border-border/50">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {selectedNotification.title}
                  </h1>
                </div>
                
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shrink-0">
                      <span className="text-orange-600 font-bold text-lg">
                        {selectedNotification.event?.name ? selectedNotification.event.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{selectedNotification.event?.name || 'Hệ thống SEAL'}</p>
                      <p className="text-xs text-muted-foreground">Tới: Bạn</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-muted-foreground">
                      {format(new Date(selectedNotification.createdAt), "dd/MM/yyyy, HH:mm")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Template Render */}
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground">
                {renderTemplate(selectedNotification)}
              </div>
              
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <MailOpen className="w-16 h-16 opacity-20 mb-4" />
              <p>Chọn một thông báo để đọc nội dung chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
