# Báo cáo NG ERP · 불량 등록 현황

Trang báo cáo NG ERP: Tổng quan lũy kế · Báo cáo ngày · Hiệu quả cải tiến. Đây là một file HTML tự chứa, nằm trong `public/index.html`.

## Cấu trúc

```
public/index.html              # báo cáo (đã kèm dữ liệu đến 10/11/2026)
public/_headers                # Cloudflare: không cache index.html → cập nhật hiện ngay
.github/workflows/deploy.yml   # tự deploy lên Cloudflare Pages mỗi lần push lên main
wrangler.toml                  # cấu hình Cloudflare Pages
update.bat                     # Windows: lấy file HTML mới nhất trong Downloads → push
```

## Thiết lập lần đầu

### 1. Tạo repo GitHub và push
```bash
git init -b main
git add -A
git commit -m "Bao cao NG ERP"
git remote add origin https://github.com/<tai-khoan>/ng-erp-report.git
git push -u origin main
```
Nên tạo repo ở chế độ **Private** vì dữ liệu là số liệu sản xuất nội bộ.

### 2. Kết nối Cloudflare Pages (chọn 1 trong 2 cách)

**Cách A – Kết nối Git trực tiếp (dễ nhất)**
1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → chọn repo `ng-erp-report`.
2. Framework preset: **None** · Build command: *(để trống)* · Build output directory: `public`.
3. Bấm **Save and Deploy**. Trang sẽ ở `https://ng-erp-report.pages.dev`.
4. Với cách này, hãy **xóa file `.github/workflows/deploy.yml`** để không deploy 2 lần.

**Cách B – GitHub Actions (đã có sẵn workflow)**
1. Cloudflare → **My Profile → API Tokens → Create Token** → mẫu **"Edit Cloudflare Workers"** (có quyền *Cloudflare Pages: Edit*).
2. Tạo project 1 lần: `npx wrangler pages project create ng-erp-report --production-branch=main`
3. GitHub repo → **Settings → Secrets and variables → Actions** → thêm:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID` (xem ở góc phải trang Overview của Cloudflare)
4. Mỗi lần push lên `main`, Actions sẽ tự deploy.

### 3. (Khuyến nghị) Giới hạn người xem
Cloudflare → **Zero Trust → Access → Applications → Add (Self-hosted)** → domain `ng-erp-report.pages.dev` → Policy: chỉ cho email công ty (VD `*@congty.com`) đăng nhập bằng mã OTP qua email.

## Cập nhật báo cáo hằng ngày
1. Mở báo cáo → upload file Excel gốc → bấm **↓ Tải HTML mới nhất**.
2. Chạy **`update.bat`** (nhấp đúp). Script lấy file `NG_ERP_Report_*.html` mới nhất trong Downloads, chép vào `public/index.html`, rồi commit và push.
3. Khoảng 1 phút sau, trang Cloudflare tự cập nhật.

## Lưu ý
- Dữ liệu nhập trên trang web chỉ lưu trong **trình duyệt của từng người** (localStorage). Muốn mọi người cùng thấy, phải tải HTML mới nhất rồi push lại như trên.
- Thư viện Chart.js và SheetJS tải từ CDN, nên máy xem cần có Internet.
