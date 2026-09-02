---
project_name: 'kid-math'
user_name: 'Cyrus'
date: '2026-07-11'
sections_completed:
  - technology_stack
  - language_specific
  - framework_specific
  - code_organization
  - data_persistence
  - testing
  - development_workflow
  - critical_dont_miss
existing_patterns_found: 12
status: 'complete'
rule_count: 33
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **React** 18.3.1 + **react-dom** 18.3.1 — SPA thuần
- **TypeScript** 5.6.3 — `strict: true` (xem rule bên dưới)
- **Vite** 5.4.10 + **@vitejs/plugin-react** 4.3.4 — bundler, alias `@` → `src/`
- **Package manager**: pnpm (có `pnpm-lock.yaml`) — KHÔNG dùng npm/yarn
- **Deploy**: gh-pages 6.2 → branch `gh-pages` (static, GitHub Pages)
- **KHÔNG có**: test framework, state-management lib, router lib, CSS framework, ESLint/Prettier
- Target ES2022, module ESNext, `moduleResolution: bundler`

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

- Bật `strict` + `noUnusedLocals` + `noUnusedParameters` + `noFallthroughCasesInSwitch` + `noUncheckedSideEffectImports` → KHÔNG để biến/tham số thừa; mọi `switch` phải xử lý hết case.
- **LUÔN import bằng alias `@/...`**, không dùng relative `../../`. (Alias khai báo cả ở tsconfig `paths` và vite.)
- Dùng `import type { ... }` cho import chỉ-type (codebase dùng nhất quán).
- KHÔNG dùng `any`. Ưu tiên **discriminated union** (`Route`, `Answer = number | Relation`).
- **Immutability**: cập nhật state/`Progress` bằng spread, KHÔNG mutate tại chỗ.

### Framework-Specific Rules (React)

- **Routing tự viết**: điều hướng qua `Route` (discriminated union) + state trong `GardenApp`; lịch sử lưu bằng `useRef<Route[]>`, có `navigate`/`back`. **KHÔNG thêm react-router.**
- **State cục bộ** với `useState`/`useRef`. KHÔNG thêm Redux/Zustand/Context global. `Progress` đọc/ghi qua `lib/storage`.
- **Component = function + named export** (không `default export`, không `React.FC`). File `.tsx` trùng tên component.
- `screens/` nhận props (`onNavigate`, `progress`…); `ui/` là component presentational thuần.
- Pattern `<GardenApp key={appKey} … />`: tăng `appKey` để remount ⇒ reset tiến trình. Giữ nguyên cách này.

### Code Organization & Style Rules

- **Ranh giới lớp (giữ nghiêm)**: `src/lib/` = logic thuần, KHÔNG phụ thuộc React (`math-engine`, `storage`, `sounds`); `src/components/screens/` = màn hình; `src/components/ui/` = UI tái dùng.
- **Styling**: CSS thuần trong `src/styles/` + CSS variables (`var(--bg)`, `var(--ink)`), vài inline style cho container. KHÔNG thêm Tailwind/styled-components.
- **Naming**: component `PascalCase`; file lib `kebab-case.ts`; hằng `UPPER_SNAKE` (`OPS`, `LEVELS`, `BADGES`, `STORAGE_KEY`).
- **Toàn bộ text UI là tiếng Việt cho trẻ em** (Toán lớp 1); app `lang="vi"`. Mọi chuỗi hiển thị viết tiếng Việt.

### Data & Persistence Rules

- localStorage key **`kidmath_progress_v1`** (đã versioned). Đổi shape `Progress` ⇒ cân nhắc bump version key.
- Mọi truy cập localStorage bọc `try/catch`, degrade êm — KHÔNG để lỗi storage ném ra UI.
- **Reset sao theo ngày**: `lastDate` = `YYYY-MM-DD` (local). Sang ngày mới ⇒ `stars` về 0, NHƯNG `badges` và `totalCorrect` giữ nguyên. Đừng phá invariant này.

### Testing Rules

- Hiện KHÔNG có test nào. **Đừng giả định có test** khi refactor.
- Nếu thêm test: ưu tiên **Vitest** (đồng bộ Vite); test logic thuần trong `lib/` trước (`math-engine`, `storage`).

### Development Workflow Rules

- Scripts: `pnpm dev` · `pnpm build` (`tsc -b && vite build`) · `pnpm typecheck` · `pnpm deploy` (build + gh-pages).
- **Không có CI/lint gate** → chạy `pnpm typecheck` trước khi coi task là xong.
- Commit theo Conventional Commits, mô tả tiếng Việt được chấp nhận (`feat: …`, `fix: …`).

### Critical Don't-Miss Rules

- **KHÔNG thêm dependency nặng** (router, state lib, UI kit, CSS framework) — project cố ý tối giản để deploy tĩnh lên GitHub Pages.
- `pickHintMethod` trong `math-engine.ts` có **ràng buộc toán học** (ghi rõ trong comment): vd `make-ten` chỉ hợp lệ khi cả hai số < 10 và tổng > 10; `subtract-from-ten` chỉ khi `a ∈ (10, 20]` và `b < 10`. Giữ điều kiện hợp lệ khi sửa gợi ý.
- `cmp` (so sánh) có đáp án là **`Relation` (`<`/`>`/`=`)**, không phải số — nhánh xử lý riêng ở `genProblem`/`genChoices`.
- **Đề bài ẩn 1 trong 3 ô** (`Problem.slot`): `result`, `a` hoặc `b` (`? + 7 = 12`). Đáp án đúng lấy qua `answerOf(problem)`, **không** đọc trực tiếp `problem.result`; gợi ý cho ô `a`/`b` đi qua `hintProblem()` để đổi sang phép ngược.
- **Phạm vi đề bài bắt đầu từ 10** (`MIN_TARGET` trong `math-engine.ts`): không sinh phép toán nằm hoàn toàn dưới 10; add/sub không còn mức "Trong 10". Ví dụ minh hoạ ở `LearnScreen` (`makeExample`) vẫn dùng số nhỏ để đếm được bằng hình.
- Build ra `dist/`; deploy dùng `-t` (kèm dotfiles) lên branch `gh-pages`.

---

## Usage Guidelines

**Dành cho AI Agent:**

- Đọc file này TRƯỚC khi viết bất kỳ code nào.
- Tuân thủ ĐÚNG mọi rule ở trên.
- Khi phân vân, chọn phương án hạn chế/tối giản hơn (project cố ý gọn nhẹ).
- Cập nhật file này khi phát hiện pattern mới.

**Dành cho người (Cyrus):**

- Giữ file lean, chỉ chứa thứ agent cần.
- Cập nhật khi tech stack hoặc pattern thay đổi.
- Rà soát định kỳ, bỏ rule đã trở nên hiển nhiên.

Last Updated: 2026-07-11

