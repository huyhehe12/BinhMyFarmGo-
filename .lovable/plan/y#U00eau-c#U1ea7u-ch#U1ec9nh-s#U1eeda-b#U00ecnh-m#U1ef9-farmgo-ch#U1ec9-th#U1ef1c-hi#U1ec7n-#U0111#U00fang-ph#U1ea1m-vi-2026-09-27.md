**YÊU CẦU CHỈNH SỬA BÌNH MỸ FARMGO – CHỈ THỰC HIỆN ĐÚNG PHẠM VI SAU**

**1. Trang “Yêu cầu đặt mua”**

- Thay câu:  
**“Đơn vị cung cấp sẽ liên hệ xác nhận.”**  
bằng:  
**“Thông tin sẽ được ghi nhận dưới dạng yêu cầu mẫu trong phiên bản prototype.”**
- Sửa luôn **meta description / mô tả chia sẻ** của trang này để không còn nội dung khiến người dùng hiểu rằng yêu cầu đã được gửi thật.
- Thống nhất toàn bộ câu chữ theo hướng đây là **prototype học tập**.

**2. Giá sản phẩm “Rau thơm”**

- Nếu chưa có giá đã xác minh, hiển thị chính xác:  
**“Giá tham khảo: Chưa có dữ liệu giá xác minh”**
- Áp dụng thống nhất ở:
  - Trang danh sách nông sản.
  - Trang chi tiết Rau thơm.
  - Trang yêu cầu mua nếu sản phẩm xuất hiện tại đó.
- **Không tự tạo hoặc ước lượng giá.**
- Giữ nguyên logic tính tổng hiện tại: sản phẩm chưa có giá **không được cộng vào số tiền dự kiến**.

**3. Ngôn ngữ HTML**

- Đổi thuộc tính tài liệu:  
`lang="en"` → `lang="vi"`
- Áp dụng cho:
  - Trang chính.
  - Trang lỗi / trang fallback nếu có.
- Không thay đổi nội dung hoặc giao diện vì chỉnh sửa này.

**4. Thay logo đầu trang bằng logo HUTECH**

- Thay **riêng huy hiệu tròn chữ “BM”** ở bên trái thanh đầu trang bằng **logo HUTECH chính thức dạng ảnh tĩnh**.
- Giữ nguyên chữ **“Bình Mỹ FarmGo”** bên cạnh logo.
- Không thay đổi chiều cao header, menu, màu xanh đậm, khoảng cách hoặc bố cục hiện tại.
- Logo phải:
  - Giữ đúng tỷ lệ, không méo.
  - Hiển thị rõ trên desktop và mobile.
  - Không làm header cao hơn hoặc làm menu bị lệch.
  - Có `alt="Logo HUTECH"` để hỗ trợ khả năng tiếp cận.
- Lưu logo trực tiếp trong assets của project.
- **Không hotlink và không gọi dịch vụ/API bên ngoài để lấy logo khi website chạy.**

**5. Kiểm tra sau khi sửa**

- Kiểm tra lại trang Yêu cầu đặt mua không còn câu **“Đơn vị cung cấp sẽ liên hệ xác nhận.”**
- Kiểm tra mọi nơi hiển thị Rau thơm đều dùng đúng câu **“Chưa có dữ liệu giá xác minh”**.
- Xác nhận HTML đang dùng `lang="vi"`.
- Kiểm tra logo HUTECH trên desktop và điện thoại.
- Kiểm tra header không bị xô lệch.
- Chạy kiểm tra build/compile và sửa lỗi phát sinh **chỉ do các thay đổi trên**.
- Không thêm thanh toán online.
- Không tạo giá, địa chỉ, hộ sản xuất hoặc dữ liệu thực tế giả.
- **Không sửa bất kỳ trang, nội dung, màu sắc, layout hoặc chức năng nào ngoài phạm vi được nêu.**