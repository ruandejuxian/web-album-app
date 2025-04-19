# Hướng Dẫn Triển Khai Web Album Ảnh

Tài liệu này cung cấp hướng dẫn chi tiết về cách cài đặt, cấu hình và triển khai dự án Web Album Ảnh lên GitHub Pages.

## Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt và chạy ứng dụng](#cài-đặt-và-chạy-ứng-dụng)
3. [Cấu hình API Keys](#cấu-hình-api-keys)
4. [Xây dựng phiên bản sản xuất](#xây-dựng-phiên-bản-sản-xuất)
5. [Triển khai lên GitHub Pages](#triển-khai-lên-github-pages)
6. [Khắc phục sự cố](#khắc-phục-sự-cố)

## Yêu cầu hệ thống

- Node.js (phiên bản 16.0.0 trở lên)
- npm (phiên bản 8.0.0 trở lên) hoặc yarn (phiên bản 1.22.0 trở lên)
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Tài khoản GitHub (để triển khai lên GitHub Pages)

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

### Bước 1: Cấu hình base URL trong vite.config.ts

Đảm bảo rằng file `vite.config.ts` đã được cấu hình với base URL chính xác:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/web-album-app/', // Tên repository GitHub của bạn
  // Các cấu hình khác...
})
```

### Bước 2: Cấu hình GitHub Actions

Đảm bảo rằng bạn có file `.github/workflows/deploy.yml` với nội dung sau:

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
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Create empty package-lock.json if it doesn't exist
        run: |
          if [ ! -f package-lock.json ]; then
            echo "{}" > package-lock.json
          fi

      - name: Build
        run: |
          npm run build || (echo "Build failed, checking TypeScript errors" && npx tsc --noEmit && exit 1)

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

### Bước 3: Đẩy code lên GitHub

```bash
git add .
git commit -m "Cập nhật cấu hình triển khai"
git push origin main
```

### Bước 4: Cấu hình GitHub Pages

1. Truy cập repository của bạn trên GitHub
2. Vào phần "Settings" > "Pages"
3. Trong phần "Source", chọn "GitHub Actions"
4. GitHub Actions sẽ tự động triển khai trang web mỗi khi bạn đẩy code lên nhánh main

### Bước 5: Truy cập trang web

Sau khi triển khai thành công, trang web của bạn sẽ có thể truy cập tại:
```
https://your-username.github.io/web-album-app/
```

## Khắc phục sự cố

### Vấn đề: Lỗi TypeScript khi build

**Giải pháp:**
- Đảm bảo rằng tất cả các file TypeScript đều có cú pháp hợp lệ
- Kiểm tra các lỗi cú pháp bằng cách chạy `npx tsc --noEmit`
- Sửa các lỗi được báo cáo trong terminal

### Vấn đề: Lỗi "npm ci" trong GitHub Actions

**Giải pháp:**
- Sử dụng `npm install` thay vì `npm ci` trong workflow
- Hoặc tạo file package-lock.json trước khi chạy `npm ci`
- Đảm bảo rằng file package.json có định dạng hợp lệ

### Vấn đề: Trang trắng sau khi triển khai

**Giải pháp:**
- Kiểm tra console trong DevTools của trình duyệt để xem lỗi
- Đảm bảo rằng `base` trong vite.config.ts khớp với tên repository
- Kiểm tra xem các tài nguyên tĩnh có được tải đúng không

### Vấn đề: API keys không hoạt động

**Giải pháp:**
- Đảm bảo rằng các API keys đã được cấu hình đúng trong file .env.local
- Trong môi trường sản xuất, bạn cần cấu hình các biến môi trường trong GitHub repository

---

Nếu bạn gặp vấn đề khác không được liệt kê ở đây, vui lòng tạo issue trên GitHub repository hoặc liên hệ với nhóm phát triển.
