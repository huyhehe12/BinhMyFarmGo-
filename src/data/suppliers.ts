export type Supplier = {
  id: string;
  name: string;
  intro: string;
  productGroup: string;
  area: string;
  illustrative: boolean;
};

/** Dữ liệu minh họa: chỉ dùng tên mô tả chung, không phải tổ chức có thật. */
export const suppliers: Supplier[] = [
  {
    id: "nhom-rau-ven-song",
    name: "Nhóm trồng rau vùng ven sông",
    intro:
      "Nhóm hộ trồng rau trên vùng đất ẩm ven sông, thu hái theo ngày và tập trung vào rau đặc trưng địa phương.",
    productGroup: "Rau móp, rau ăn lá",
    area: "Khu vực ven sông tại Bình Mỹ",
    illustrative: true,
  },
  {
    id: "nhom-vuon-cay-an-trai",
    name: "Nhóm vườn cây ăn trái",
    intro:
      "Nhóm vườn trồng cây ăn trái theo mùa, kết hợp đón khách tham quan và trải nghiệm hái trái.",
    productGroup: "Trái cây theo mùa",
    area: "Khu vực vườn cây tại Bình Mỹ",
    illustrative: true,
  },
  {
    id: "nhom-trong-rau-mau",
    name: "Nhóm trồng rau màu",
    intro:
      "Nhóm hộ canh tác rau màu luân canh theo vụ, cung cấp rau thơm và rau củ cho nhu cầu tiêu dùng trong khu vực.",
    productGroup: "Rau màu, rau thơm",
    area: "Khu vực trồng rau màu tại Bình Mỹ",
    illustrative: true,
  },
];

export function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}
