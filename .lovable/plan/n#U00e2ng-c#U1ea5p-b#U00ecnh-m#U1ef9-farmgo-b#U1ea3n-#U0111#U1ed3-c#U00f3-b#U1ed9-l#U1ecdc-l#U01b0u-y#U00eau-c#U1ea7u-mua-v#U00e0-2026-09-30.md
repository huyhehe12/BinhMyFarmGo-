NÂNG CẤP BÌNH MỸ FARMGO: BẢN ĐỒ CÓ BỘ LỌC, LƯU YÊU CẦU MUA VÀ QUẢN TRỊ NHÀ CUNG CẤP

Giữ giao diện xanh, bố cục và chức năng đang hoạt động. Kiểm tra mã nguồn trước khi sửa, tận dụng các trang hiện có, không tạo trang trùng.

1. HIỆN TRẠNG

Theo kết quả kiểm tra trước:

- /ban-do đang nhúng Google Maps toàn khu vực, hai nhóm địa điểm còn trống.

- /dat-mua có form nhưng chỉ lưu trên trình duyệt, dùng mã cố định BMFG-DEMO-001 và chưa gửi đến nhà cung cấp.

- Chưa có cơ sở dữ liệu, đăng nhập, thanh toán hoặc thông báo Zalo OA/SMS.

- Thông tin liên hệ nhà cung cấp còn trống.

Kiểm tra lại các điểm này và giữ lại những phần đã được hoàn thiện.

2. BẢN ĐỒ KẾT HỢP DANH SÁCH CÓ BỘ LỌC

Nâng cấp trực tiếp trên /ban-do:

- Thêm bộ lọc: Tất cả, Điểm bán nông sản, Nhà vườn, Điểm trải nghiệm nông nghiệp, Điểm nhận hàng.

- Lấy danh sách địa điểm từ cơ sở dữ liệu.

- Chỉ công khai địa điểm được quản trị viên đánh dấu “Đã xác minh” và có địa chỉ hoặc tọa độ đã xác minh.

- Không tự tạo địa điểm, địa chỉ, tọa độ hoặc thông tin liên hệ.

- Nhóm trống hiển thị “Danh sách địa điểm đang cập nhật”.

Khi chọn địa điểm:

- Hiển thị tên, nhóm, địa chỉ và thông tin liên hệ nếu có.

- Có nút “Xem trên Google Maps”.

- Chuyển iframe sang địa điểm được chọn nếu có đường dẫn nhúng hợp lệ.

- Lưu riêng đường dẫn nhúng và đường dẫn mở Google Maps; không dùng trực tiếp link chia sẻ thông thường làm nguồn iframe.

- Chỉ chấp nhận đường dẫn nhúng Google Maps hợp lệ, không nhận mã HTML tùy ý.

- Nếu chưa có đường dẫn nhúng, giữ bản đồ khu vực và cho phép mở Google Maps bằng nút.

Không tự động lấy vị trí người dùng. Giữ loading="lazy", hiển thị phù hợp trên điện thoại và máy tính.

Giai đoạn này bộ lọc tác động vào danh sách. Việc hiển thị nhiều ghim và lọc trực tiếp trên bản đồ là nâng cấp sau, cần cấu hình Google Maps JavaScript API phù hợp. Không hiển thị như thể chức năng đó đã hoạt động.

3. CƠ SỞ DỮ LIỆU VÀ ĐĂNG NHẬP

Thiết lập Lovable Cloud để lưu:

- Nhà cung cấp và tài khoản quản lý.

- Sản phẩm.

- Địa điểm và trạng thái xác minh.

- Yêu cầu mua, chi tiết sản phẩm trong yêu cầu.

- Lịch sử cập nhật trạng thái.

- Trạng thái thanh toán và lịch sử gửi thông báo.

Nếu cần thao tác kết nối hoặc bật dịch vụ từ chủ dự án, chỉ rõ bước cần thực hiện.

Phân biệt rõ dữ liệu thật và dữ liệu thử nghiệm. Không tự chuyển sản phẩm hoặc nhà cung cấp minh họa thành dữ liệu đã xác minh.

4. YÊU CẦU MUA CÓ LƯU TRỮ

Nâng cấp /dat-mua, giữ giao diện hiện có:

- Khách nhập họ tên, số điện thoại, sản phẩm, số lượng và hình thức nhận hàng.

- Chỉ yêu cầu địa chỉ giao hàng khi khách chọn giao tận nơi.

- Kiểm tra dữ liệu bắt buộc và số lượng hợp lệ.

- Khi gửi, tách yêu cầu theo từng nhà cung cấp.

- Mỗi yêu cầu có mã riêng dạng BMFG-YYMMDD-[chuỗi ngẫu nhiên đủ dài], khó đoán và không trùng.

- Lưu thông tin sản phẩm và giá tham khảo tại thời điểm gửi; người bán xác nhận lại giá cuối cùng.

- Chỉ báo gửi thành công sau khi dữ liệu đã được lưu thành công.

- Hiển thị mã của từng yêu cầu để khách lưu lại.

- Khóa nút khi đang gửi và có cơ chế chống tạo yêu cầu trùng ở phía máy chủ.

- Nếu gửi thất bại, giữ nội dung form để khách thử lại.

Trạng thái yêu cầu:

- Chờ xác nhận.

- Đã xác nhận.

- Hoàn tất.

- Đã hủy.

Yêu cầu thuộc nhà cung cấp minh họa:

- Gắn nhãn “Yêu cầu thử nghiệm”.

- Thông báo rõ không gửi đến người bán thật.

- Không cho thanh toán.

5. TRA CỨU YÊU CẦU

Thêm mục “Tra cứu yêu cầu” trong /dat-mua:

- Khách nhập mã yêu cầu và số điện thoại đã dùng.

- Xác thực thông tin phía máy chủ.

- Chỉ trả về thông tin tối thiểu: mã, nhà cung cấp, trạng thái và thời gian cập nhật.

- Không trả về địa chỉ, số điện thoại đầy đủ hoặc thông tin riêng của người khác.

- Không cho khách truy vấn trực tiếp bảng yêu cầu mua.

- Giới hạn số lần tra cứu để hạn chế dò mã.

- Khi thông tin không khớp, dùng thông báo chung, không tiết lộ mã hay số điện thoại nào tồn tại.

6. QUẢN TRỊ NHÀ CUNG CẤP

Tạo khu vực quản trị có đăng nhập.

Nhà cung cấp:

- Chỉ được xem yêu cầu thuộc mình.

- Xác nhận sản phẩm còn hàng, tổng tiền, phí giao hàng và cách nhận hàng.

- Cập nhật trạng thái theo quy trình hợp lệ.

- Chỉ được chỉnh sửa sản phẩm và thông tin thuộc mình.

- Không được tự đánh dấu địa điểm hoặc tài khoản nhận tiền là đã xác minh.

Quản trị viên:

- Quản lý tài khoản và phân công nhà cung cấp.

- Quản lý sản phẩm, địa điểm.

- Kiểm tra và xác minh thông tin liên hệ, địa chỉ và tài khoản nhận tiền.

- Xem lịch sử xử lý yêu cầu và thông báo.

Phân quyền phải được thực thi tại cơ sở dữ liệu và phía máy chủ, không chỉ ẩn nút trên giao diện. Người đăng ký không được tự chọn quyền quản trị hoặc tự nhận quản lý nhà cung cấp khác.

7. THÔNG BÁO ZALO OA/SMS

Chuẩn bị tích hợp thông báo khi có yêu cầu mới:

- Gửi đến đúng nhà cung cấp bằng thông tin đã xác minh.

- Khóa bí mật của dịch vụ chỉ lưu phía máy chủ.

- Ghi nhận trạng thái: Chưa gửi, Đã gửi, Gửi thất bại.

- Chưa có cấu hình thì ghi “Chưa gửi — thiếu cấu hình”.

- Chỉ ghi “Đã gửi” khi dịch vụ xác nhận gửi thành công.

- Không giả lập thông báo thành công.

- Lỗi gửi thông báo không được làm mất yêu cầu đã lưu.

- Không gửi thông báo thật cho yêu cầu thử nghiệm.

Trong thời gian chưa tích hợp:

- Nhà cung cấp xem yêu cầu trong trang quản trị.

- Khách có thể dùng nút Zalo/Gọi điện khi có thông tin thật đã xác minh.

- Không gọi nút liên hệ thủ công là thông báo tự động.

8. THANH TOÁN VÀ QR

Chỉ hiển thị thanh toán khi:

- Là yêu cầu thật.

- Người bán đã xác nhận đơn và tổng tiền, gồm phí giao hàng nếu có.

- Tài khoản nhận tiền đã được xác minh.

Tạo QR theo tài khoản ngân hàng, số tiền và mã yêu cầu:

- Hiển thị rõ người nhận, ngân hàng, số tiền và nội dung chuyển khoản.

- Mỗi nhà cung cấp có yêu cầu và khoản thanh toán riêng.

- Không tự tạo thông tin tài khoản ngân hàng.

- Không cho thanh toán yêu cầu thử nghiệm hoặc đã hủy.

Quản lý trạng thái thanh toán riêng:

- Chưa thanh toán.

- Chờ kiểm tra.

- Đã thanh toán.

Nếu chưa có đối soát tự động:

- Khách bấm “Tôi đã chuyển khoản” chỉ chuyển sang “Chờ kiểm tra”.

- Người bán kiểm tra tiền thực nhận rồi xác nhận “Đã thanh toán”.

- Lưu người xác nhận và thời gian xác nhận.

- Không coi việc tạo QR hoặc bấm nút là bằng chứng đã nhận tiền.

MoMo, VNPay, ZaloPay chỉ xuất hiện khi đã kết nối và kiểm thử thành công. Nếu chưa cấu hình thì chưa bật.

9. KIỂM TRA VÀ BÀN GIAO

Kiểm tra:

- Bộ lọc địa điểm, trạng thái danh sách trống và chọn địa điểm.

- Lưu yêu cầu, tách theo nhà cung cấp và chống gửi trùng.

- Tra cứu không làm lộ dữ liệu khách hàng.

- Nhà cung cấp không xem hoặc sửa được dữ liệu của nhau.

- Yêu cầu thử nghiệm không gửi thông báo thật và không nhận thanh toán.

- QR hiển thị đúng người nhận, số tiền và mã yêu cầu.

- Giao diện trên điện thoại và máy tính.

Sau khi hoàn tất, báo rõ:

- Những chức năng đã hoạt động thực tế.

- Những chức năng đang chờ cấu hình.

- Những tài khoản, khóa dịch vụ và dữ liệu đã xác minh tôi cần bổ sung.

Không thay đổi các chức năng hiện có ngoài phạm vi nâng cấp trên.