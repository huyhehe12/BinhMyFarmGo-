import rauMopAsset from "@/assets/san-pham-rau-mop.webp.asset.json";
import xoai from "@/assets/san-pham-xoai.jpg";
import nhan from "@/assets/san-pham-nhan.jpg";
import oi from "@/assets/san-pham-oi.jpg";
import rauAnLa from "@/assets/san-pham-rau-an-la.jpg";
import rauThom from "@/assets/san-pham-rau-thom.jpg";
import duaLeo from "@/assets/san-pham-dua-leo.jpg";

export type Product = {
  slug: string;
  name: string;
  category: string;
  season: string;
  /** Giá tham khảo minh họa; để trống nếu chưa có dữ liệu phù hợp. */
  referencePrice: string | null;
  unit: string;
  origin: string;
  supplierId: string;
  description: string;
  pickupPoint: string;
  delivery: string;
  image: string;
  imageAlt: string;
  illustrative: boolean;
};

export const categories = [
  "Đặc sản địa phương",
  "Trái cây theo mùa",
  "Rau màu địa phương",
] as const;

export const seasons = ["Quanh năm", "Mùa mưa", "Mùa khô"] as const;

/**
 * Dữ liệu minh họa cho nguyên mẫu học tập.
 * Rau móp Bình Mỹ luôn là sản phẩm đặc trưng đầu tiên.
 */
export const products: Product[] = [
  {
    slug: "rau-mop-binh-my",
    name: "Rau móp Bình Mỹ",
    category: "Đặc sản địa phương",
    season: "Quanh năm",
    referencePrice: "25.000 – 35.000 đ",
    unit: "kg",
    origin: "Vùng đất ven sông tại Bình Mỹ",
    supplierId: "nhom-rau-ven-song",
    description:
      "Rau móp là loại rau đặc trưng của vùng đất ẩm ven sông, phần thân non được thu hái và thường dùng để muối chua hoặc nấu các món dân dã.",
    pickupPoint: "Điểm tập trung nông sản tại khu vực ven sông (minh họa)",
    delivery: "Nhận tại điểm cung cấp hoặc giao nhận theo thỏa thuận",
    image: rauMopAsset.url,
    imageAlt: "Các bó rau móp thân xanh buộc dây trong chậu nhựa đặt trên nền rơm khô",
    illustrative: true,
  },
  {
    slug: "xoai-theo-mua",
    name: "Xoài theo mùa",
    category: "Trái cây theo mùa",
    season: "Mùa khô",
    referencePrice: "20.000 – 30.000 đ",
    unit: "kg",
    origin: "Vườn cây ăn trái tại Bình Mỹ",
    supplierId: "nhom-vuon-cay-an-trai",
    description:
      "Xoài được thu hái theo mùa từ các vườn cây trong khu vực, phù hợp dùng tươi hoặc làm món tráng miệng trong chuyến tham quan.",
    pickupPoint: "Khu vực vườn cây ăn trái (minh họa)",
    delivery: "Nhận tại điểm tham quan hoặc giao nhận theo thỏa thuận",
    image: xoai,
    imageAlt: "Rổ xoài chín vàng xanh trên bàn gỗ",
    illustrative: true,
  },
  {
    slug: "nhan-theo-mua",
    name: "Nhãn theo mùa",
    category: "Trái cây theo mùa",
    season: "Mùa mưa",
    referencePrice: "30.000 – 45.000 đ",
    unit: "kg",
    origin: "Vườn cây ăn trái tại Bình Mỹ",
    supplierId: "nhom-vuon-cay-an-trai",
    description:
      "Nhãn được thu hoạch theo chùm trong mùa vụ, thường được khách tham quan chọn mua trực tiếp tại vườn.",
    pickupPoint: "Khu vực vườn cây ăn trái (minh họa)",
    delivery: "Nhận tại điểm tham quan hoặc giao nhận theo thỏa thuận",
    image: nhan,
    imageAlt: "Chùm nhãn tươi còn lá xếp trong rổ tre",
    illustrative: true,
  },
  {
    slug: "oi-vuon",
    name: "Ổi vườn",
    category: "Trái cây theo mùa",
    season: "Quanh năm",
    referencePrice: "15.000 – 25.000 đ",
    unit: "kg",
    origin: "Vườn cây ăn trái tại Bình Mỹ",
    supplierId: "nhom-vuon-cay-an-trai",
    description:
      "Ổi vườn giòn, được thu hái trong khu vực tham quan và có thể dùng ngay tại vườn hoặc mang về.",
    pickupPoint: "Khu vực vườn cây ăn trái (minh họa)",
    delivery: "Nhận tại điểm cung cấp hoặc nhận tại điểm tham quan",
    image: oi,
    imageAlt: "Những trái ổi xanh nguyên và cắt đôi trên rổ tre",
    illustrative: true,
  },
  {
    slug: "rau-an-la",
    name: "Rau ăn lá",
    category: "Rau màu địa phương",
    season: "Quanh năm",
    referencePrice: "10.000 – 18.000 đ",
    unit: "kg",
    origin: "Khu vực trồng rau tại Bình Mỹ",
    supplierId: "nhom-rau-ven-song",
    description:
      "Nhóm rau ăn lá trồng luân canh theo vụ, thu hái hằng ngày và phù hợp cho tiêu dùng gia đình hoặc bếp ăn nhỏ.",
    pickupPoint: "Điểm tập trung nông sản tại khu vực trồng rau (minh họa)",
    delivery: "Nhận tại điểm cung cấp hoặc giao nhận theo thỏa thuận",
    image: rauAnLa,
    imageAlt: "Các bó rau ăn lá tươi xếp trên bàn gỗ",
    illustrative: true,
  },
  {
    slug: "rau-thom",
    name: "Rau thơm",
    category: "Rau màu địa phương",
    season: "Quanh năm",
    referencePrice: null,
    unit: "bó",
    origin: "Khu vực trồng rau tại Bình Mỹ",
    supplierId: "nhom-trong-rau-mau",
    description:
      "Các loại rau thơm trồng xen trong vườn rau, thường được bán theo bó nhỏ dùng kèm món ăn địa phương.",
    pickupPoint: "Điểm tập trung nông sản tại khu vực trồng rau (minh họa)",
    delivery: "Nhận tại điểm cung cấp hoặc giao nhận theo thỏa thuận",
    image: rauThom,
    imageAlt: "Ba bó rau thơm gồm ngò, húng lủi và húng quế trên rổ tre",
    illustrative: true,
  },
  {
    slug: "dua-leo",
    name: "Dưa leo",
    category: "Rau màu địa phương",
    season: "Mùa khô",
    referencePrice: "12.000 – 20.000 đ",
    unit: "kg",
    origin: "Khu vực trồng rau màu tại Bình Mỹ",
    supplierId: "nhom-trong-rau-mau",
    description:
      "Dưa leo thu hái theo luống, quả non và giòn, thường được thu gom theo ngày trong mùa vụ.",
    pickupPoint: "Điểm tập trung nông sản tại khu vực trồng rau màu (minh họa)",
    delivery: "Nhận tại điểm cung cấp hoặc giao nhận theo thỏa thuận",
    image: duaLeo,
    imageAlt: "Rổ dưa leo vừa thu hoạch bên luống rau",
    illustrative: true,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(product: Product) {
  return product.referencePrice
    ? `${product.referencePrice}/${product.unit}`
    : "Chưa có dữ liệu giá xác minh";
}
