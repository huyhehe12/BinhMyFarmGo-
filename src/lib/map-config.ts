/**
 * Cấu hình bản đồ khám phá Bình Mỹ — một nơi duy nhất để thay đổi.
 *
 * Đường dẫn nhúng và liên kết "Xem trên Google Maps" được lấy trực tiếp từ
 * Google Maps (Chia sẻ → Nhúng bản đồ) cho xã Bình Mỹ, TP.HCM. Không tự tạo
 * tọa độ hay tham số nhúng. Khi muốn đổi khu vực, thay bằng đường dẫn nhúng
 * Google Maps mới đã xác minh.
 */
export const mapConfig = {
  /** Mã nhúng Google Maps (phần src của iframe Google cung cấp). */
  embedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125336.89849434007!2d106.6116835!3d10.980116500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d3f6d8456fdd%3A0xa7e60df024b21cd7!2zQsOsbmggTeG7uSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2sus!4v1790683236532!5m2!1svi!2sus",
  /** Liên kết mở khu vực tương ứng trên Google Maps để xem đường đi. */
  viewOnGoogleMaps:
    "https://www.google.com/maps/place/B%C3%ACnh+M%E1%BB%B9,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.9801165,106.6116835,12z/data=!4m6!3m5!1s0x3174d3f6d8456fdd:0xa7e60df024b21cd7!8m2!3d11.0022869!4d106.5937658!16s%2Fg%2F11nbb6p71y?hl=vi",
} as const;

/** Địa điểm đã xác minh: chỉ thêm khi có tên, địa chỉ/tọa độ và liên kết Google Maps thật. */
