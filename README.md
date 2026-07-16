# SEAL – Software Engineering Hackathon Management System (Frontend)

Hệ thống Frontend quản lý giải chạy học thuật thường niên **SEAL Hackathon**. Được xây dựng theo tiêu chuẩn kiến trúc hiện đại, tập trung vào trải nghiệm người dùng (UX) cao cấp, thiết kế linh hoạt và khả năng tương tác thời gian thực.

---

## ⚡ Tech Stack & Architecture

Frontend được thiết kế theo mô hình **Component-Driven Architecture**, tối ưu hóa SEO và hiệu năng với Server Components của Next.js:

*   **Core Framework:** Next.js 15 (App Router) với React 19 và TypeScript. Khai thác sức mạnh của Server/Client Components để tối ưu Initial Load Time.
*   **State Management & Data Fetching:** 
    *   **TanStack Query (React Query v5):** Quản lý Server State, caching, optimistic updates và background fetching.
    *   **Zustand:** Quản lý Global Client State gọn nhẹ (ví dụ: Auth state, UI toggles).
*   **Styling & UI Components:**
    *   **Tailwind CSS:** Utility-first CSS framework cho styling cực nhanh.
    *   **shadcn/ui & Radix UI:** Hệ thống UI Components Unstyled/Accessible, có thể tùy biến sâu.
    *   **Framer Motion:** Tạo các hiệu ứng chuyển động mượt mà (Micro-animations, Page Transitions, Drag-and-drop).
*   **Form & Validation:** React Hook Form kết hợp với Zod Schema Validation đảm bảo dữ liệu toàn vẹn từ phía Client.
*   **Real-time Communication:** `socket.io-client` tích hợp lắng nghe sự kiện thời gian thực (Chat nhóm, Thông báo đẩy).
*   **API Layer:** Axios được cấu hình với Custom Interceptors tự động đính kèm Token và xử lý Refresh Token logic một cách trong suốt (Transparent).

---

## 🧠 Các Kỹ thuật Xử lý Chuyên sâu (Advanced Techniques)

### 1. Kiến trúc Bảo mật & Ủy quyền (Auth & Authorization)
*   **Silent Token Refresh:** Triển khai Axios Interceptor lắng nghe mã lỗi `401 Unauthorized`. Hệ thống tự động đẩy request vào queue, gọi API cấp lại Access Token mới bằng `HttpOnly Cookie`, sau đó tự động retry (thực hiện lại) các request bị lỗi mà người dùng không hề hay biết.
*   **Role-Based Access Control (RBAC):** Áp dụng Higher-Order Components (HOC) và Guard Layouts trong Next.js App Router. Các Route được chia theo thư mục `(student)`, `(mentor)`, `(judge)`, `(organizer)` với middleware kiểm tra quyền hạn nghiêm ngặt ở mức độ render.

### 2. Tối ưu hóa UI/UX & Dynamic Aesthetics
*   **Glassmorphism & Dynamic UI:** Xây dựng các thẻ (Cards) và Panel dưới dạng kính mờ (Backdrop-blur) mang lại cảm giác thiết kế cao cấp, hiện đại (Premium design).
*   **Micro-interactions:** Sử dụng Framer Motion `AnimatePresence` và `layout` properties để xử lý các animation phức tạp như: Mở rộng hàng của bảng (Expandable Rows), chuyển đổi mượt mà giữa các Tab, hay kéo thả danh sách (Sortable list).
*   **Theme Management:** Hệ thống hỗ trợ Dark/Light mode natively thông qua `next-themes` và sử dụng CSS Variables (Design Tokens) để đảm bảo độ tương phản màu sắc.

### 3. Tương tác Thời gian thực (Real-time Sync)
*   **WebSocket Integration:** Kết nối Socket.IO được khởi tạo dưới dạng Singleton instance qua Custom Hook. Dữ liệu tin nhắn nhóm (Team Chat) và thông báo hệ thống (Notification Center) được đồng bộ ngay lập tức mà không cần reload trang.
*   **Optimistic UI Updates:** Khi user thực hiện hành động (VD: gửi tin nhắn, đánh dấu đã đọc thông báo), giao diện lập tức phản hồi cập nhật trạng thái trong khi Mutation của React Query đang chạy ngầm lên server.

### 4. Tích hợp Quản lý File (Cloud Storage & Github)
*   **S3 Presigned URLs:** Việc tải lên file dung lượng lớn (Project Files) được xử lý trực tiếp từ Client lên AWS S3. Frontend gọi BE xin cấp `Presigned URL`, sau đó dùng Axios `PUT` thẳng file lên S3, giảm tải hoàn toàn băng thông cho Backend.
*   **GitHub OAuth & Repo Provisioning:** Tích hợp luồng xác thực GitHub để lấy định danh, tự động mapping username vào tổ chức (Organization) và hiển thị repository URL động ngay trong Workspace.

---

## 🛠️ Hướng dẫn Cài đặt & Chạy dự án (Quick Start)

### 1. Cấu hình Môi trường
Copy file `.env.example` thành `.env.local` và điền URL của Backend:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 2. Khởi chạy Ứng dụng
Chạy các lệnh sau để cài đặt và bật môi trường phát triển:
```bash
npm install
npm run dev
```

Mở trình duyệt tại [http://localhost:3001](http://localhost:3001) (hoặc port được cấp) để trải nghiệm giao diện Frontend.
