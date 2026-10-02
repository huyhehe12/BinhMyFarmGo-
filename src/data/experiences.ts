import haiTrai from "@/assets/du-lich-hai-trai.jpg";
import cheoXuong from "@/assets/du-lich-cheo-xuong.jpg";
import lamBanh from "@/assets/du-lich-lam-banh.jpg";
import thuongThuc from "@/assets/du-lich-thuong-thuc.jpg";
import gianHang from "@/assets/du-lich-gian-hang.jpg";

export type Experience = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

/** Mỗi trải nghiệm dùng một ảnh riêng, không trùng với ảnh sản phẩm. */
export const experiences: Experience[] = [
  {
    id: "tham-quan-vuon",
    title: "Tham quan vườn và hái trái cây",
    description:
      "Khách tham quan tìm hiểu vườn cây, mùa vụ và trải nghiệm hái trái theo mùa.",
    image: haiTrai,
    imageAlt: "Khách tham quan hái trái trong vườn cây",
  },
  {
    id: "cheo-xuong",
    title: "Chèo xuồng/cano trải nghiệm sông nước",
    description:
      "Trải nghiệm cảnh quan ven sông, kênh rạch và không gian nông nghiệp địa phương.",
    image: cheoXuong,
    imageAlt: "Xuồng nhỏ đi trên kênh rạch hai bên là hàng dừa nước",
  },
  {
    id: "lam-banh",
    title: "Làm bánh cùng người dân",
    description:
      "Trải nghiệm các bước cơ bản trong quá trình làm bánh dân gian bằng nguyên liệu phù hợp với địa phương.",
    image: lamBanh,
    imageAlt: "Người dân hướng dẫn khách làm bánh dân gian",
  },
  {
    id: "thuong-thuc-nong-san",
    title: "Thưởng thức nông sản tại vườn",
    description:
      "Khách có thể thưởng thức nông sản và tìm hiểu sản phẩm ngay tại khu vực tham quan.",
    image: thuongThuc,
    imageAlt: "Bàn thưởng thức trái cây và trà trong vườn",
  },
  {
    id: "mua-nong-san",
    title: "Mua nông sản trong chuyến tham quan",
    description:
      "Khách lựa chọn sản phẩm và gửi yêu cầu mua để nhận tại điểm phù hợp khi triển khai thực tế.",
    image: gianHang,
    imageAlt: "Gian hàng nông sản với khách đang lựa chọn sản phẩm",
  },
];

export const deliveryOptions = [
  "Nhận tại điểm cung cấp",
  "Nhận tại điểm tham quan",
  "Giao nhận theo thỏa thuận",
] as const;
