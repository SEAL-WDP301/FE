export function getScoringLockState(
  roundStatus?: string | null,
  submissionDeadline?: string | null,
): { locked: boolean; reason: string | null } {
  if (!roundStatus) {
    return { locked: true, reason: "Đang tải thông tin round..." };
  }

  if (roundStatus === "results_published") {
    return {
      locked: true,
      reason: "Vòng này đã công bố kết quả — chỉ được xem điểm, không chỉnh sửa.",
    };
  }

  if (roundStatus === "not_started") {
    return { locked: true, reason: "Vòng này chưa bắt đầu." };
  }

  if (roundStatus === "closed") {
    return { locked: false, reason: null };
  }

  if (roundStatus === "open") {
    const deadlinePassed =
      submissionDeadline && new Date(submissionDeadline) <= new Date();

    if (!deadlinePassed) {
      const deadlineLabel = submissionDeadline
        ? new Date(submissionDeadline).toLocaleString("vi-VN")
        : "chưa có";
      return {
        locked: true,
        reason: `Round đang mở — chấm được sau deadline nộp bài (${deadlineLabel}) hoặc khi organizer đóng round (Closed).`,
      };
    }

    return { locked: false, reason: null };
  }

  return { locked: true, reason: "Không thể chấm điểm ở trạng thái round hiện tại." };
}
