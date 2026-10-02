# Bình Mỹ Nông Sản

Website hoạt động như một nền tảng kết nối quảng bá và phân phối nông sản tại Bình Mỹ, tập trung giới thiệu đặc sản, sản phẩm nông nghiệp và các đơn vị cung cấp địa phương gắn với hoạt động du lịch nông nghiệp. Người dùng có thể tra cứu thông tin sản phẩm, nguồn gốc, giá tham khảo, điểm bán và lựa chọn sản phẩm để gửi yêu cầu đặt mua. Website hỗ trợ kết nối người mua – đơn vị cung cấp – điểm du lịch, đồng thời cung cấp thông tin về điểm mua và hình thức giao nhận. Qua đó, giải pháp góp phần mở rộng kênh quảng bá, hỗ trợ tiêu thụ nông sản và kết hợp hoạt động mua sắm với trải nghiệm du lịch tại Bình Mỹ.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://binhmyfarmgohcm.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9c8086b6-1125-4369-bef3-83607421ec65).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Phiên bản sau cải tiến

- Logo HUTECH trong thanh điều hướng đã được thay bằng logo Bình Mỹ FarmGo mới.
- Yêu cầu mua được lưu vào Supabase, tách theo nhà cung cấp và sinh mã `BMFG-...` để tra cứu.
- Nhà cung cấp đã xác minh có thể nhận thông báo qua Zalo OA; nếu Zalo không dùng được, hệ thống có thể dùng SMS qua webhook/gateway đã cấu hình.
- Sau khi nhà cung cấp xác nhận tổng tiền và phí giao, khách tra cứu yêu cầu để nhận VietQR động đúng số tiền và nội dung chuyển khoản.
- Trang bản đồ có bộ lọc cho điểm bán nông sản, nhà vườn, điểm trải nghiệm nông nghiệp và điểm nhận hàng; chỉ địa điểm đã xác minh được hiển thị.

### Cấu hình thông báo

Sao chép `.env.example` thành `.env` hoặc cấu hình các biến tương ứng trong môi trường triển khai. Ngoài cấu hình Supabase, có thể thêm:

```env
ZALO_OA_ACCESS_TOKEN=
SMS_WEBHOOK_URL=
SMS_WEBHOOK_TOKEN=
SMS_SENDER_ID=BinhMyFarmGo
```

`SMS_WEBHOOK_URL` cần nhận `POST` JSON theo dạng `{ to, sender, message }`. Không đặt token bí mật trực tiếp trong mã nguồn phía trình duyệt.
