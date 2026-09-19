# Lý Mập Food (React + Vite)

Bản chuyển đổi sang React của website gốc (HTML/Tailwind CDN/vanilla JS). Giao diện, nội dung, màu sắc, font
chữ và toàn bộ văn bản tiếng Việt được giữ nguyên 100% — chỉ thay đổi cách tổ chức code sang component React.

## Cài đặt

```bash
npm install
npm run dev
```

## Cấu trúc

- `src/pages/HomePage.jsx` — trang khách hàng (Hero, Câu chuyện, Bảo chứng, Gallery, Thực đơn, Tự Mix Calo, Liên hệ).
- `src/pages/admin/` — các trang quản trị: `AdminLogin`, `AdminIndex` (danh sách sản phẩm), `AdminCreate`,
  `AdminEdit`, `AdminOrders`.
- `src/components/` — các thành phần dùng chung của trang khách (Header, Hero, MenuSection, ProductModal, v.v.)
- `src/components/admin/` — `AdminLayout` (sidebar) và `RequireAdmin` (bảo vệ route theo `sessionStorage`, chỉ mất khi đóng tab/trình duyệt hoặc bấm Đăng xuất).
- `src/data/menuData.js` — dữ liệu thực đơn mặc định (`DEFAULT_MENU`, `DEFAULT_PRODUCTS`), y hệt bản gốc.
- `src/utils/storage.js` — đồng bộ dữ liệu qua `localStorage` (`lymap_products`), y hệt logic gốc.

## Route

| Route gốc (.html)      | Route React      |
| ----------------------- | ----------------- |
| `/index.html`            | `/`                |
| `/Admin/Login.html`      | `/Admin/Login`     |
| `/Admin/Index.html`      | `/Admin/Index`     |
| `/Admin/Create.html`     | `/Admin/Create`    |
| `/Admin/Edit.html?id=1`  | `/Admin/Edit?id=1` |
| `/Admin/Orders.html`     | `/Admin/Orders`    |

## Tính năng mới bổ sung

- **Giỏ hàng nhiều món** — thêm nhiều món vào giỏ (nút "Thêm Vào Giỏ" trên thẻ món và trong popup chi tiết), chỉnh số lượng, rồi gửi **một** tin nhắn Zalo gộp toàn bộ đơn thay vì phải nhắn từng món.
- **Mã giảm giá trong giỏ hàng** — thử các mã `LYMAP10`, `LYMAP20` (đơn từ 50.000đ), `FREESHIP` để giảm trực tiếp vào tổng đơn (sửa/thêm mã ở `src/data/menuData.js` mục `VOUCHERS`).
- **Sắp xếp & lọc thực đơn** — dropdown sắp xếp theo Bán Chạy Nhất / Giá thấp-cao / Giá cao-thấp, kết hợp với tab lọc danh mục có sẵn.
- **Gợi ý "Có Thể Bạn Cũng Thích"** — trong popup chi tiết món, hiện các món khác cùng danh mục để khách xem thêm (cross-sell).
- **Yêu thích món ăn** — bấm biểu tượng trái tim để lưu món yêu thích (lưu ở trình duyệt), có tab lọc "Yêu Thích" riêng trong Thực Đơn và icon trái tim ở Header.
- **Nút gọi điện nhanh (Hotline nổi)** — góc dưới trái màn hình, bấm gọi thẳng số Zalo/hotline của quán.
- **Đánh giá khách hàng thật** — form góp ý ở cuối trang giờ lưu đánh giá thật (localStorage), hiển thị điểm trung bình và danh sách đánh giá gần nhất thay vì chỉ hiện thông báo rồi mất.
- **Câu hỏi thường gặp (FAQ)** — mục hỏi đáp dạng accordion trước phần Liên Hệ.
- **Nút cuộn lên đầu trang** — xuất hiện khi cuộn xuống, giúp điều hướng nhanh trên trang dài.
- **Đơn hàng thật trong trang Admin** — `Admin/Orders` giờ hiển thị đúng các đơn khách đã gửi qua giỏ hàng (đồng bộ qua localStorage `lymap_orders`), có thể đổi trạng thái đơn (Chờ Xác Nhận → Đang Chuẩn Bị → Đang Giao → Hoàn Tất...), hiện luôn mã giảm giá đã áp dụng nếu có.

## Đăng nhập Admin mặc định

- Tài khoản: `admin`
- Mật khẩu: `123456`

Toàn bộ dữ liệu sản phẩm vẫn được lưu ở `localStorage` (`lymap_products`) và trạng thái đăng nhập ở
`admin_logged_in`, giống hệt bản HTML gốc.

## Admin update
Admin now includes compact navigation, daily opening hours, order/delivery settings, product availability and autosave, inventory, customer aggregation, reviews with admin replies, coupons, editable homepage content, and sales reports. Data is persisted in browser localStorage in this demo build.

## Admin v4 additions
- Website/CMS editor: header, announcement, hero, story, highlights, gallery, menu intro, FAQ, contact/reviews, footer, SEO.
- Section visibility toggles without deleting content.
- Product create/edit forms grouped by business function with instant autosave.
- Product detail storage text, batch label and availability synced to customer product modal.
- F&B checkout controls: delivery/pickup, preorder time, payment method, order note.
- Promotions support date range and usage limits.
- Dashboard alerts for low stock and unanswered reviews.
- Admin navigation grouped into primary + More to reduce density.
