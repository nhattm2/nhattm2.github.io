# Tổng quan dự án — Vườn của Gạo (kid-math)

> Tài liệu sinh tự động ngày 2026-07-11 · Chế độ: initial_scan · Độ sâu: deep

## Mục đích

**Vườn của Gạo — Toán Lớp 1** là một web app dạy toán cho trẻ em (lớp 1) bằng tiếng Việt.
Bé luyện 5 phép tính — **Cộng, Trừ, Nhân, Chia, So sánh** — qua các màn hình vui nhộn với
linh vật gấu trúc **Gạo**, hình ảnh minh hoạ trực quan, hệ thống **sao** và **huy hiệu**.

Ứng dụng chạy **hoàn toàn phía client** (không backend, không tài khoản), lưu tiến độ trong
`localStorage` của trình duyệt, và deploy tĩnh lên **GitHub Pages**.

## Đặc điểm chính

- **2 chế độ chơi**: *Luyện tập* (10 câu, có gợi ý hình ảnh) và *Thử thách* (60 giây đếm giờ).
- **Chế độ Học cùng Gạo**: giải thích từng phép tính theo 5 bước có minh hoạ.
- **Gợi ý trực quan** thích ứng theo bài (count-on, make-ten, count-down, skip-count, array, inverse…).
- **Phản hồi đa giác quan**: hoạt hình linh vật theo cảm xúc, confetti, âm thanh WebAudio (không cần file asset).
- **Phần thưởng**: sao cộng dồn theo ngày (reset mỗi ngày mới), 8 huy hiệu theo cột mốc.

## Tech stack

| Hạng mục | Công nghệ | Phiên bản | Ghi chú |
|----------|-----------|-----------|---------|
| UI | React + React DOM | 18.3.1 | SPA thuần, function components |
| Ngôn ngữ | TypeScript | 5.6.3 | `strict: true` |
| Build tool | Vite | 5.4.10 | alias `@` → `src/` |
| Plugin | @vitejs/plugin-react | 4.3.4 | JSX runtime tự động |
| Deploy | gh-pages | 6.2.0 | branch `gh-pages` |
| Package manager | pnpm | — | có `pnpm-lock.yaml` |

**Không dùng**: router lib, state-management lib, CSS framework, thư viện test, ESLint/Prettier.

## Phân loại

- **Loại dự án**: web (SPA phía client)
- **Cấu trúc kho**: monolith (một phần duy nhất)
- **Kiến trúc**: component-based SPA + routing tự viết bằng discriminated union
- **Ngôn ngữ chính**: TypeScript
- **Điểm vào**: `src/main.tsx` → `src/App.tsx` → `src/GardenApp.tsx`

## Điều hướng tài liệu

- [Chỉ mục tài liệu](./index.md) — điểm vào chính cho AI/dev
- [Kiến trúc](./architecture.md)
- [Phân tích cây thư mục](./source-tree-analysis.md)
- [Kho component](./component-inventory.md)
- [Hướng dẫn phát triển](./development-guide.md)
- [Project context cho AI](../_bmad-output/project-context.md)
