# Gạo học Toán

Trang web tĩnh giúp bé lớp 1 luyện tập phép cộng và trừ với giao diện dễ thương. Có thể triển khai dễ dàng lên GitHub Pages.

## Tính năng
- Luyện tập cộng (+), trừ (−) hoặc ngẫu nhiên (±)
- Chọn phạm vi số: <10, 20, 100, >100
- Tránh kết quả âm cho phép trừ (phù hợp lớp 1)
- Phản hồi ngay, tính điểm đúng/sai, chuỗi liên tiếp, và sao thưởng
- Giao diện dễ thương, responsive, không cần backend

## Chạy cục bộ
Chỉ cần mở file `index.html` trong trình duyệt.

## Triển khai lên GitHub Pages
1. Đưa toàn bộ mã nguồn này lên một repository GitHub (ví dụ: `gao-math`).
2. Vào Settings → Pages.
3. Phần "Build and deployment":
   - Source: chọn `Deploy from a branch`.
   - Branch: chọn `main` (hoặc `master`) và thư mục `/ (root)`.
4. Nhấn Save. Đợi vài phút, đường dẫn sẽ có dạng: `https://<tên-người-dùng>.github.io/<tên-repo>/`.

Nếu bạn dùng tên repo đặc biệt `username.github.io`, trang sẽ được phục vụ ở root `https://username.github.io/`.

## Tuỳ chỉnh
- Mặc định lựa chọn `<10` sẽ sinh số trong khoảng 0..9, đảm bảo tổng không vượt phạm vi và phép trừ không âm.
- Bạn có thể tinh chỉnh màu sắc, font trong `styles.css`.
- Logic sinh bài toán nằm trong `script.js` (hàm `generateProblem`).

Chúc các bé học vui! 🐣🧮
