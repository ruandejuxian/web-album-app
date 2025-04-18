# Hướng Dẫn Triển Khai Web Album Ảnh

Tài liệu này cung cấp hướng dẫn chi tiết về cách cài đặt, cấu hình và triển khai dự án Web Album Ảnh lên các nền tảng khác nhau.

## Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt và chạy ứng dụng](#cài-đặt-và-chạy-ứng-dụng)
3. [Cấu hình API Keys](#cấu-hình-api-keys)
4. [Xây dựng phiên bản sản xuất](#xây-dựng-phiên-bản-sản-xuất)
5. [Triển khai lên GitHub Pages](#triển-khai-lên-github-pages)
6. [Triển khai lên Netlify](#triển-khai-lên-netlify)
7. [Triển khai lên Vercel](#triển-khai-lên-vercel)
8. [Cấu trúc thư mục dự án](#cấu-trúc-thư-mục-dự-án)
9. [Khắc phục sự cố](#khắc-phục-sự-cố)

## Yêu cầu hệ thống

- Node.js (phiên bản 16.0.0 trở lên)
- npm (phiên bản 8.0.0 trở lên) hoặc yarn (phiên bản 1.22.0 trở lên)
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Tài khoản Google Cloud Platform (cho Google Vision API)
- Tài khoản Hugging Face (cho AI Album Creator)

## Cài đặt và chạy ứng dụng

### Bước 1: Clone dự án từ GitHub

```bash
git clone https://github.com/your-username/web-album-app.git
cd web-album-app
```

### Bước 2: Cài đặt các phụ thuộc

Sử dụng npm:

```bash
npm install
```

Hoặc sử dụng yarn:

```bash
yarn install
```

### Bước 3: Tạo file môi trường

Tạo file `.env.local` ở thư mục gốc của dự án với nội dung sau:

```
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_VISION_API_KEY=your_google_vision_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Bước 4: Chạy ứng dụng trong môi trường phát triển

```bash
npm run dev
```

Hoặc:

```bash
yarn dev
```

Ứng dụng sẽ chạy tại địa chỉ [http://localhost:5173](http://localhost:5173).

## Cấu hình API Keys

### Google API

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một dự án mới
3. Kích hoạt các API sau:
   - Google Drive API
   - Google Sheets API
   - Google Vision API
4. Tạo thông tin xác thực OAuth 2.0 cho ứng dụng web
5. Thêm API key vào file `.env.local`

### Hugging Face API

1. Đăng ký tài khoản tại [Hugging Face](https://huggingface.co/)
2. Truy cập [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Tạo token mới với quyền truy cập "Read"
4. Thêm token vào file `.env.local` dưới dạng `VITE_HUGGINGFACE_API_KEY`

## Xây dựng phiên bản sản xuất

Để xây dựng phiên bản sản xuất của ứng dụng:

```bash
npm run build
```

Hoặc:

```bash
yarn build
```

Kết quả build sẽ được lưu trong thư mục `dist/`.

## Triển khai lên GitHub Pages

### Bước 1: Cấu hình base URL

Chỉnh sửa file `vite.config.ts` để thêm base URL:

```typescript
export default defineConfig({
  base: '/web-album-app/', // Tên repository GitHub của bạn
  // ...
})
```

### Bước 2: Xây dựng ứng dụng

```bash
npm run build
```

### Bước 3: Triển khai lên GitHub Pages

Cách 1: Sử dụng GitHub Actions

Tạo file `.github/workflows/deploy.yml` với nội dung:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

Cách 2: Sử dụng gh-pages package

```bash
npm install --save-dev gh-pages
```

Thêm script vào `package.json`:

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Sau đó chạy:

```bash
npm run deploy
```

## Triển khai lên Netlify

### Bước 1: Tạo tài khoản Netlify

Đăng ký tại [Netlify](https://www.netlify.com/).

### Bước 2: Kết nối với GitHub

1. Nhấp vào "New site from Git"
2. Chọn GitHub và xác thực
3. Chọn repository của dự án

### Bước 3: Cấu hình triển khai

Cấu hình như sau:
- Build command: `npm run build`
- Publish directory: `dist`

### Bước 4: Cấu hình biến môi trường

Thêm các biến môi trường trong phần "Site settings > Build & deploy > Environment":
- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_VISION_API_KEY`
- `VITE_HUGGINGFACE_API_KEY`

### Bước 5: Triển khai

Nhấp vào "Deploy site". Netlify sẽ tự động xây dựng và triển khai ứng dụng.

## Triển khai lên Vercel

### Bước 1: Tạo tài khoản Vercel

Đăng ký tại [Vercel](https://vercel.com/).

### Bước 2: Cài đặt Vercel CLI (tùy chọn)

```bash
npm install -g vercel
```

### Bước 3: Triển khai

Cách 1: Sử dụng Vercel Dashboard
1. Nhấp vào "Import Project"
2. Chọn "Import Git Repository" và kết nối với GitHub
3. Chọn repository của dự án
4. Cấu hình như sau:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Thêm các biến môi trường
6. Nhấp vào "Deploy"

Cách 2: Sử dụng Vercel CLI

```bash
vercel
```

## Cấu trúc thư mục dự án

```
web-album-app/
├── public/               # Tài nguyên tĩnh
├── src/                  # Mã nguồn
│   ├── api/              # API services
│   ├── assets/           # Tài nguyên (hình ảnh, fonts)
│   ├── components/       # React components
│   │   ├── admin/        # Components quản trị
│   │   ├── ai/           # Components AI
│   │   ├── auth/         # Components xác thực
│   │   ├── gallery/      # Components thư viện ảnh
│   │   ├── layout/       # Components bố cục
│   │   ├── ui/           # UI components
│   │   └── upload/       # Components tải lên
│   ├── context/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Các trang
│   ├── styles/           # CSS/SCSS files
│   ├── utils/            # Tiện ích
│   ├── App.tsx           # Component gốc
│   └── main.tsx          # Điểm vào ứng dụng
├── .env.local            # Biến môi trường cục bộ
├── index.html            # HTML template
├── package.json          # Cấu hình npm
├── tailwind.config.js    # Cấu hình Tailwind CSS
├── tsconfig.json         # Cấu hình TypeScript
└── vite.config.ts        # Cấu hình Vite
```

## Khắc phục sự cố

### Vấn đề: API keys không hoạt động

**Giải pháp:**
- Kiểm tra xem API keys đã được thêm đúng vào file `.env.local`
- Đảm bảo rằng các API đã được kích hoạt trong Google Cloud Console
- Kiểm tra giới hạn hạn ngạch API

### Vấn đề: Ứng dụng không tải được

**Giải pháp:**
- Xóa thư mục `node_modules` và file `package-lock.json`
- Chạy lại `npm install`
- Khởi động lại ứng dụng với `npm run dev`

### Vấn đề: Lỗi CORS khi gọi API

**Giải pháp:**
- Đảm bảo rằng domain của ứng dụng đã được thêm vào danh sách cho phép trong cấu hình API
- Sử dụng proxy server trong môi trường phát triển

### Vấn đề: Lỗi khi triển khai

**Giải pháp:**
- Kiểm tra logs triển khai
- Đảm bảo rằng Node.js version trên máy chủ triển khai tương thích
- Kiểm tra cấu hình build trong `package.json`

---

Nếu bạn gặp vấn đề khác không được liệt kê ở đây, vui lòng tạo issue trên GitHub repository hoặc liên hệ với nhóm phát triển.
