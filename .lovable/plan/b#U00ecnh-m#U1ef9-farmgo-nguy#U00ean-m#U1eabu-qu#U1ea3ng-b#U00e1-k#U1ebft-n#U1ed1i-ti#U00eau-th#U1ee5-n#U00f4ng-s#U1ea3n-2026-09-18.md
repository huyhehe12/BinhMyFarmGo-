# Bình Mỹ FarmGo — Nguyên mẫu quảng bá, kết nối tiêu thụ nông sản & du lịch nông nghiệp

Bình Mỹ FarmGo là website prototype phục vụ dự án học tập, sử dụng hoàn toàn tiếng Việt. Website không yêu cầu đăng nhập, chưa sử dụng cơ sở dữ liệu, chưa tích hợp thanh toán trực tuyến và chưa xử lý đơn hàng thật.

Dữ liệu về giá, đơn vị cung cấp, điểm nhận hàng và một số sản phẩm hiện được sử dụng dưới dạng **dữ liệu minh họa** và sẽ được thay thế bằng dữ liệu đã xác minh khi triển khai thực tế.

Mục tiêu của website là giúp người dùng dễ tra cứu nông sản, nguồn gốc, giá tham khảo, đơn vị cung cấp và thông tin du lịch nông nghiệp tại Bình Mỹ; đồng thời cho phép người dùng lựa chọn sản phẩm và gửi yêu cầu đặt mua dưới dạng mô phỏng.

## 1. Trang chủ `/`

Tiêu đề chính:

**“Khám phá đặc sản và du lịch nông nghiệp Bình Mỹ”**

Phần giới thiệu ngắn:

**“Bình Mỹ FarmGo giúp người dùng khám phá nông sản địa phương, tìm hiểu nguồn gốc, giá tham khảo, đơn vị cung cấp và kết hợp mua sắm với trải nghiệm du lịch nông nghiệp tại Bình Mỹ.”**

Trang chủ gồm các khu vực:

**“Vì sao cần Bình Mỹ FarmGo?”**

Trình bày 3 vấn đề:

- Thông tin về nông sản và điểm mua còn phân tán, khó tra cứu.
- Người mua và khách tham quan khó tìm thông tin sản phẩm, giá tham khảo và nơi mua phù hợp.
- Hoạt động quảng bá nông sản chưa được kết nối rõ ràng với trải nghiệm du lịch nông nghiệp địa phương.

Tiếp theo là phần:

**“Nông sản nổi bật”**

Trong đó:

**Rau móp Bình Mỹ phải là sản phẩm nổi bật đầu tiên.**

Sau đó có thể hiển thị thêm:

- Trái cây theo mùa.
- Rau màu địa phương.
- Một số sản phẩm minh họa phù hợp.

Tiếp theo là phần:

**“Trải nghiệm du lịch nông nghiệp”**

Giới thiệu nhanh:

- Tham quan vườn.
- Hái trái cây.
- Chèo xuồng/cano.
- Làm bánh cùng người dân.
- Thưởng thức và mua nông sản.

Có 2 nút chính:

**“Khám phá nông sản”**

**“Khám phá Bình Mỹ”**

Không hiển thị số liệu như “10 HTX”, “50 sản phẩm”, “100 điểm bán” nếu chưa có dữ liệu xác minh.

---

## 2. Trang Sản phẩm `/san-pham`

Tiêu đề:

**“Nông sản Bình Mỹ”**

Mô tả:

**“Khám phá các sản phẩm nông nghiệp địa phương, nguồn gốc, mùa vụ và giá tham khảo.”**

Các nhóm sản phẩm ưu tiên:

- Rau móp Bình Mỹ.
- Trái cây theo mùa.
- Rau màu địa phương.
- Một số sản phẩm minh họa khác nếu cần.

Có bộ lọc đơn giản theo:

- Loại nông sản.
- Mùa vụ.

Mỗi thẻ sản phẩm hiển thị:

- Ảnh riêng của sản phẩm.
- Tên sản phẩm.
- Loại sản phẩm.
- Mùa vụ.
- Giá tham khảo.
- Nguồn gốc.
- Đơn vị cung cấp.
- Nhãn **“Dữ liệu minh họa”** nếu thông tin chưa được xác minh.
- Nút **“Xem chi tiết”** hoặc **“Thêm vào yêu cầu mua”**.

### Quy định bắt buộc về hình ảnh sản phẩm

**Mỗi sản phẩm phải sử dụng một hình ảnh riêng biệt. Không được dùng lại cùng một ảnh cho hai sản phẩm khác nhau.**

Ví dụ:

- Rau móp Bình Mỹ → sử dụng ảnh riêng về rau móp.
- Xoài → sử dụng ảnh xoài riêng.
- Nhãn → sử dụng ảnh nhãn riêng.
- Ổi → sử dụng ảnh ổi riêng.
- Rau ăn lá → sử dụng ảnh rau ăn lá riêng.
- Rau thơm → sử dụng ảnh rau thơm riêng.

Nếu chưa có ảnh phù hợp, hãy tạo một ảnh minh họa mới cho từng sản phẩm.

**Không lấy một ảnh trái cây chung rồi sử dụng cho nhiều loại trái cây khác nhau.**

Không tự tạo:

- Chứng nhận OCOP.
- Chứng nhận VietGAP.
- Giá bán chính thức.
- Tên HTX thật.
- Địa chỉ cụ thể.
- Thông tin pháp lý.

nếu chưa có nguồn xác minh.

---

## 3. Trang Chi tiết sản phẩm `/san-pham/$slug`

Mỗi trang chi tiết sản phẩm gồm:

- Ảnh lớn đúng với sản phẩm.
- Tên sản phẩm.
- Loại sản phẩm.
- Mô tả ngắn.
- Nguồn gốc.
- Mùa vụ.
- Giá tham khảo.
- Đơn vị cung cấp.
- Điểm nhận hàng minh họa.
- Hình thức giao nhận.
- Nút **“Thêm vào yêu cầu đặt mua”**.

Thêm ghi chú:

**“Thông tin và giá trong bản prototype mang tính minh họa và sẽ được cập nhật bằng dữ liệu thực tế khi triển khai.”**

Ảnh trong trang chi tiết phải đúng với sản phẩm đang xem.

**Không hiển thị ảnh của sản phẩm khác.**

---

## 4. Trang Đơn vị cung cấp `/don-vi-cung-cap`

Tiêu đề:

**“Đơn vị cung cấp”**

Mô tả:

**“Các nhóm cung cấp dưới đây được xây dựng dưới dạng dữ liệu minh họa cho nguyên mẫu.”**

Sử dụng tên mô tả chung, ví dụ:

- Nhóm trồng rau vùng ven sông.
- Nhóm vườn cây ăn trái.
- Nhóm trồng rau màu.
- Nhóm chế biến nông sản.

Mỗi đơn vị gồm:

- Tên nhóm.
- Giới thiệu ngắn.
- Nhóm sản phẩm.
- Khu vực hoạt động ở mức tổng quát.
- Danh sách sản phẩm liên kết.
- Nhãn **“Dữ liệu minh họa”**.

Không tự tạo:

- Tên HTX nghe như tổ chức có thật.
- Số điện thoại.
- Email.
- Địa chỉ chính xác.
- Số thành viên.
- Chứng nhận OCOP.
- Giấy phép.
- Thông tin pháp lý.

---

## 5. Trang Du lịch nông nghiệp `/du-lich`

Tiêu đề:

**“Du lịch nông nghiệp Bình Mỹ”**

Mô tả:

**“Khám phá các hoạt động trải nghiệm nông nghiệp, sông nước và mua sắm nông sản trong hành trình tại Bình Mỹ.”**

Hiển thị 5 trải nghiệm:

**1. Tham quan vườn và hái trái cây**

Khách tham quan tìm hiểu vườn cây, mùa vụ và trải nghiệm hái trái theo mùa.

**2. Chèo xuồng/cano trải nghiệm sông nước**

Trải nghiệm cảnh quan ven sông, kênh rạch và không gian nông nghiệp địa phương.

**3. Làm bánh cùng người dân**

Trải nghiệm các bước cơ bản trong quá trình làm bánh dân gian bằng nguyên liệu phù hợp với địa phương.

**4. Thưởng thức nông sản tại vườn**

Khách có thể thưởng thức nông sản và tìm hiểu sản phẩm ngay tại khu vực tham quan.

**5. Mua nông sản trong chuyến tham quan**

Khách lựa chọn sản phẩm và gửi yêu cầu mua để nhận tại điểm phù hợp khi triển khai thực tế.

### Quy định bắt buộc về hình ảnh du lịch

Mỗi trải nghiệm phải có **một hình ảnh riêng**.

- Hái trái cây → ảnh vườn cây hoặc người hái trái.
- Chèo xuồng/cano → ảnh xuồng, sông hoặc kênh rạch.
- Làm bánh → ảnh người đang làm bánh.
- Thưởng thức nông sản → ảnh nông sản hoặc bàn thưởng thức tại vườn.
- Mua nông sản → ảnh gian hàng hoặc khách lựa chọn sản phẩm.

**Không dùng lại ảnh giữa các trải nghiệm.**

**Không lấy ảnh sản phẩm ở trang Sản phẩm để dùng lại làm ảnh đại diện cho trải nghiệm du lịch.**

Mỗi trải nghiệm có nhãn:

**“Dữ liệu minh họa”**

Thêm ghi chú cuối trang:

**“Nội dung trải nghiệm được xây dựng theo định hướng du lịch nông nghiệp tại Bình Mỹ và dùng để minh họa cho nguyên mẫu. Lịch trình thực tế cần được xác nhận trước khi triển khai.”**

Không tự tạo:

- Giờ mở cửa.
- Giá vé.
- Địa chỉ chính xác.
- Lịch hoạt động.
- Số điện thoại đặt tour.

nếu chưa có dữ liệu xác minh.

---

## 6. Trang Yêu cầu đặt mua `/dat-mua`

Tiêu đề:

**“Yêu cầu đặt mua”**

Đây là chức năng mô phỏng, chưa phải hệ thống đặt hàng thật.

Người dùng có thể:

- Xem sản phẩm đã chọn.
- Thay đổi số lượng.
- Xóa sản phẩm.
- Nhập họ tên.
- Nhập số điện thoại.
- Chọn hình thức nhận hàng.
- Nhập ghi chú.

Các hình thức nhận hàng có thể để ở mức chung:

- Nhận tại điểm cung cấp.
- Nhận tại điểm tham quan.
- Giao nhận theo thỏa thuận.

Sau khi nhấn gửi:

Hiển thị:

**“Yêu cầu của bạn đã được ghi nhận. Trong phiên bản triển khai thực tế, đơn vị cung cấp sẽ xác nhận sản phẩm, số lượng, giá và hình thức nhận hàng.”**

Sau đó tạo một mã yêu cầu mẫu, ví dụ:

**BM-2026-0143**

Mã này chỉ mang tính mô phỏng.

Sau khi xác nhận:

- Xóa sản phẩm trong giỏ.
- Không lưu dữ liệu lên Cloud.
- Không gửi thông tin đến tổ chức thật.
- Không xử lý thanh toán.

**Không được hiển thị cùng một thông báo hoặc cùng một nội dung hai lần trên trang này.**

---

## 7. Trang Giới thiệu `/gioi-thieu`

Tiêu đề:

**“Giới thiệu Bình Mỹ FarmGo”**

Nội dung giới thiệu:

**“Bình Mỹ FarmGo là nguyên mẫu nền tảng hỗ trợ quảng bá và kết nối tiêu thụ nông sản tại Bình Mỹ, đồng thời gắn hoạt động mua sắm với trải nghiệm du lịch nông nghiệp địa phương.”**

### Mục tiêu

- Hỗ trợ quảng bá nông sản Bình Mỹ.
- Giúp người dùng dễ tra cứu sản phẩm và nguồn gốc.
- Cung cấp giá tham khảo và thông tin điểm mua.
- Hỗ trợ kết nối người mua với đơn vị cung cấp.
- Gắn tiêu thụ nông sản với hoạt động du lịch nông nghiệp.

### Cách hoạt động

Chỉ đánh số **một lần**:

1. Xem thông tin nông sản và trải nghiệm du lịch.
2. Chọn sản phẩm muốn mua.
3. Nhập thông tin và gửi yêu cầu đặt mua.
4. Nhận màn hình xác nhận và mã yêu cầu mẫu.

Không để lỗi:

`1. 1.`  
`2. 2.`  
`3. 3.`

### Định hướng nâng cấp trong tương lai

- Xây dựng cơ sở dữ liệu sản phẩm.
- Cơ sở dữ liệu đơn vị cung cấp.
- Lưu và quản lý yêu cầu đặt mua.
- Trang quản trị dành cho hợp tác xã/đơn vị cung cấp.
- Cập nhật sản phẩm và giá.
- Theo dõi trạng thái yêu cầu.
- Bản đồ điểm bán.
- Mã QR tại điểm du lịch và điểm bán.
- Có thể tích hợp thanh toán trực tuyến khi triển khai thực tế.

Cuối trang ghi:

**“Bình Mỹ FarmGo là nguyên mẫu dự án học tập. Dữ liệu về giá, đơn vị cung cấp, điểm nhận hàng và một số sản phẩm hiện mang tính minh họa và sẽ được xác minh trước khi triển khai thực tế.”**

Không hiển thị số điện thoại hoặc email giả.

---

# Cách hoạt động của prototype

Quy trình người dùng:

**Truy cập website → Khám phá nông sản → Xem chi tiết → Chọn sản phẩm → Gửi yêu cầu đặt mua → Nhận xác nhận.**

Bản prototype hiện tại:

- Không yêu cầu đăng nhập.
- Chưa sử dụng Cloud.
- Chưa có cơ sở dữ liệu thật.
- Chưa có trang quản trị.
- Chưa có thanh toán trực tuyến.
- Giỏ sản phẩm có thể lưu tạm bằng `localStorage`.

---

# Nguyên tắc nội dung bắt buộc

- **Rau móp Bình Mỹ luôn là sản phẩm đặc trưng đầu tiên.**
- Dữ liệu chưa xác minh phải ghi **“Dữ liệu minh họa”**.
- Không tự tạo tên HTX hoặc tổ chức có vẻ như đơn vị thật.
- Không tạo số điện thoại hoặc email giả.
- Không tạo chứng nhận OCOP hoặc chứng nhận khác.
- Không tạo địa chỉ chính xác nếu chưa xác minh.
- Không ghi giá là “giá niêm yết chính thức”; chỉ sử dụng **“Giá tham khảo”**.
- Nếu chưa có giá phù hợp, hiển thị **“Giá tham khảo: đang cập nhật”**.
- Không tạo thông tin pháp lý.
- Không tạo số lượng thành viên của đơn vị cung cấp.
- Không hiển thị dữ liệu minh họa theo cách khiến người xem hiểu nhầm đó là thông tin chính thức.

---

# Quy định hình ảnh bắt buộc

**Đây là yêu cầu quan trọng.**

Mỗi sản phẩm phải có ảnh riêng.

Mỗi trải nghiệm du lịch phải có ảnh riêng.

Không sử dụng cùng một ảnh cho hai sản phẩm.

Không sử dụng cùng một ảnh cho hai trải nghiệm.

Không lấy ảnh một sản phẩm để đại diện cho sản phẩm khác.

Không lấy ảnh sản phẩm để dùng lại cho trải nghiệm du lịch nếu nội dung ảnh không phù hợp.

Nếu thiếu ảnh:  
**tạo ảnh minh họa mới phù hợp thay vì sử dụng lại ảnh cũ.**

Ảnh cần:

- Rõ nét.
- Tỷ lệ đồng đều.
- Phù hợp với nội dung.
- Không có watermark.
- Không sử dụng hình ảnh có vấn đề bản quyền.

---

# Thiết kế giao diện

Phong cách:

**Nông nghiệp – sinh thái – du lịch ven sông Bình Mỹ.**

Màu chủ đạo:

- Xanh lá.
- Vàng lúa.
- Nâu đất.
- Nền sáng.

Giao diện cần:

- Sạch sẽ.
- Hiện đại.
- Dễ đọc.
- Thân thiện.
- Khoảng trắng hợp lý.
- Thẻ sản phẩm đồng đều.
- Hình ảnh rõ và đẹp.
- Tối ưu cho điện thoại.
- Tối ưu cho máy tính.
- Không làm giao diện quá giống các sàn thương mại điện tử lớn.

Trang chủ nên ưu tiên hình ảnh lớn và trực quan, nhưng vẫn phải làm rõ được:

**Nông sản Bình Mỹ + Kết nối tiêu thụ + Du lịch nông nghiệp.**

---

# Yêu cầu kỹ thuật

Sử dụng TanStack Start.

Các route:

`/`

`/san-pham`

`/san-pham/$slug`

`/don-vi-cung-cap`

`/du-lich`

`/dat-mua`

`/gioi-thieu`

Dữ liệu mẫu tập trung trong:

`src/data/*`

Giỏ yêu cầu đặt mua sử dụng:

**React Context + localStorage**

Màu sắc và font được quản lý tập trung trong:

`src/styles.css`

Không hard-code màu sắc rải rác trong component nếu không cần thiết.

---

# Yêu cầu kiểm tra trước khi hoàn thành

Trước khi hoàn thành website, hãy tự kiểm tra toàn bộ các trang và sửa nếu phát hiện:

- Ảnh bị trùng.
- Ảnh không đúng sản phẩm.
- Ảnh không đúng trải nghiệm.
- Nội dung bị lặp.
- Tiêu đề bị lặp.
- Danh sách bị đánh số hai lần.
- Nút không dẫn đúng trang.
- Sản phẩm không mở được trang chi tiết.
- Giỏ yêu cầu không hoạt động.
- Nội dung tràn màn hình điện thoại.
- Dữ liệu mẫu nhưng không có nhãn “Dữ liệu minh họa”.

**Không tự bổ sung tên tổ chức, HTX, chứng nhận, số điện thoại, địa chỉ, giá chính thức hoặc thông tin thực tế ngoài những nội dung được yêu cầu.**

**Không thay đổi cấu trúc hoặc thêm chức năng phức tạp nếu không cần thiết.**

**Ưu tiên website hoạt động ổn định, dễ hiểu, đẹp và phù hợp để trình bày như một prototype dự án học tập.**