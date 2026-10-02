BẢN ĐỒ KHÁM PHÁ BÌNH MỸ — TRANG RIÊNG + MỤC MENU

Mục tiêu  
Thêm trang /ban-do và mục “Bản đồ” vào menu của website Bình Mỹ FarmGo. Trang hiển thị bản đồ khu vực Bình Mỹ, TP.HCM, cùng hai nhóm “Điểm bán nông sản” và “Điểm trải nghiệm”.

1. Cách nhúng bản đồ

- Dùng iframe lấy từ Google Maps qua “Chia sẻ → Nhúng bản đồ”.
- Không kết nối Google Maps Platform, không dùng Maps Embed API yêu cầu khóa, không cấu hình API key.
- Xác minh đúng khu vực Bình Mỹ tại TP.HCM, đối chiếu khu vực Củ Chi trước đây để tránh nhầm địa danh.
- Dùng đường dẫn nhúng thật do Google Maps cung cấp; không tự tạo tọa độ hoặc tham số nhúng.
- Nếu chưa lấy được đường dẫn nhúng đã xác minh, hiển thị “Bản đồ đang cập nhật”, không chèn bản đồ sai vị trí.

2. Cấu hình tập trung  
Tạo src/lib/map-config.ts hoặc file tương đương phù hợp cấu trúc dự án, gồm:

- Đường dẫn nhúng bản đồ.
- Đường dẫn mở khu vực tương ứng trên Google Maps.
- Hai danh sách địa điểm rỗng ban đầu: điểm bán nông sản và điểm trải nghiệm.

Mỗi địa điểm bổ sung sau này cần có tên, nhóm, địa chỉ hoặc tọa độ đã xác minh và đường dẫn Google Maps tương ứng. Không tự thêm địa điểm mẫu.

3. Trang /ban-do

- Tạo trang theo hệ thống định tuyến hiện có.
- Tiêu đề: “Bản đồ khám phá Bình Mỹ”.
- Mô tả: “Khám phá khu vực Bình Mỹ và tìm thông tin điểm bán nông sản, điểm tham quan tại địa phương.”
- Nhúng iframe với loading="lazy", tiêu đề hỗ trợ khả năng truy cập và chiều rộng phù hợp màn hình.
- Bản đồ có tỉ lệ khoảng 16:9 trên máy tính, gần vuông trên điện thoại.
- Giữ các điều khiển và thông tin ghi nguồn mặc định của Google Maps.
- Thêm nút “Xem trên Google Maps”, mở đường dẫn đã xác minh trong tab mới an toàn.

4. Danh sách địa điểm

- Hiển thị hai khối: “Điểm bán nông sản” và “Điểm trải nghiệm”.
- Mỗi nhóm chưa có dữ liệu hiển thị: “Danh sách địa điểm đang cập nhật”.
- Khi có dữ liệu đã xác minh, hiển thị tên, địa chỉ và nút “Xem vị trí”.
- Chỉ dùng nhãn “Chỉ đường” khi đường dẫn dẫn đến một địa điểm cụ thể.
- Bản đầu chỉ nhúng bản đồ khu vực; danh sách địa điểm bên cạnh không tự tạo dấu ghim trên iframe.
- Không trình bày các địa điểm do Google hiển thị sẵn thành đối tác đã được FarmGo xác minh.

5. Bố cục và giao diện

- Máy tính: bố cục hai cột, bản đồ lớn bên trái và danh sách bên phải.
- Điện thoại: bản đồ ở trên, danh sách ở dưới.
- Giữ màu xanh đậm, kiểu chữ, thẻ nội dung và bo góc phù hợp giao diện hiện tại.
- Thêm mục “Bản đồ” vào menu máy tính và điện thoại, có trạng thái đang chọn.
- Bảo đảm menu liên hệ nổi không che nút hoặc nội dung quan trọng.

6. Ghi chú trên trang  
“Bản đồ dùng để tham khảo vị trí. Danh sách điểm bán và điểm trải nghiệm sẽ được bổ sung sau khi xác minh. FarmGo cung cấp thông tin và kết nối; khách liên hệ trực tiếp với đơn vị cung cấp hoặc tổ chức tour.”
7. Thông tin trang  
Dùng cơ chế metadata hiện có của dự án:

- Title: “Bản đồ khám phá Bình Mỹ — Bình Mỹ FarmGo”.
- Description: “Khám phá bản đồ khu vực Bình Mỹ, TP.HCM. Thông tin điểm bán nông sản và điểm trải nghiệm được cập nhật sau khi xác minh.”
- Bổ sung og, og, og và twitter phù hợp.

8. Phạm vi

- Không yêu cầu vị trí người dùng.
- Không xây dựng hệ thống bản đồ riêng.
- Không thêm đăng ký tour, thanh toán, tài khoản hoặc cơ sở dữ liệu.
- Giữ nguyên nội dung, hình ảnh và chức năng hiện có.

9. Kiểm tra

- Trang /ban-do truy cập được từ menu trên máy tính và điện thoại.
- Bản đồ hiển thị đúng khu vực; nút mở Google Maps hoạt động đúng.
- Hai nhóm trống hiển thị đúng thông báo.
- Giao diện không tràn màn hình hoặc bị menu liên hệ che khuất.
- Nếu chưa có đường dẫn bản đồ, trang vẫn hiển thị bình thường với thông báo cập nhật.
- Bản xem trước không phát sinh lỗi biên dịch hoặc lỗi hoạt động mới.

Thực hiện trọn vẹn phạm vi trên, ưu tiên cách làm đơn giản và tận dụng thành phần sẵn có.