// src/lib/tuvi/algorithms/anSao.ts
import { ThienCan, DiaChi, NguHanh, Cung, ChinhTinh, SaoTrangThai, Sao, CungInfo, LasoTuVi } from '../types/core';
import { getNguHanhTuCanChi, getThienCanTuGioChi, getAmDuongTuCanChi } from '../utils/canChi';

/**
 * An sao Tử Vi
 * @param namSinh Năm sinh (Can Chi)
 * @param thangSinh Tháng sinh (âm lịch)
 * @param ngaySinh Ngày sinh (âm lịch)
 * @param gioSinh Giờ sinh (Chi)
 * @param gioiTinh Giới tính ('nam' | 'nu')
 * @returns Mảng các cung với sao đã được an
 */
export function anSao(
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number,
  gioSinh: { can: ThienCan; chi: DiaChi },
  gioiTinh: 'nam' | 'nu'
): CungInfo[] {
  // Khởi tạo 12 cung
  const cungInfos = khaiTao12Cung(namSinh, thangSinh, ngaySinh, gioSinh, gioiTinh);
  
  // Xác định vị trí sao Tử Vi
  const tuViPosition = tinhViTriTuVi(namSinh, thangSinh, ngaySinh);
  anSaoTuVi(cungInfos, tuViPosition);
  
  // An các sao chính khác
  anLiemTrinh(cungInfos, tuViPosition);
  anThienDong(cungInfos, tuViPosition);
  anVuKhuc(cungInfos, tuViPosition);
  anThaiDuong(cungInfos, tuViPosition);
  anThaiAm(cungInfos, tuViPosition);
  anThamLang(cungInfos, tuViPosition);
  anCuMon(cungInfos, tuViPosition);
  anThatSat(cungInfos, tuViPosition);
  anPhaQuan(cungInfos, tuViPosition);
  
  // An các phụ tinh
  anTaPhu(cungInfos, namSinh, thangSinh, ngaySinh);
  anHuuBat(cungInfos, namSinh, thangSinh, ngaySinh);
  anQuanPhuc(cungInfos, namSinh, thangSinh, ngaySinh);
  anThienKhoi(cungInfos, namSinh.can);
  anThienViet(cungInfos, namSinh.can);
  
  // An các sao theo giờ
  anThienMa(cungInfos, namSinh.chi);
  anDaoHoa(cungInfos, namSinh.chi);
  anHongLoan(cungInfos, namSinh.chi);
  anThienHy(cungInfos, namSinh.chi);
  
  // An các sao theo tháng
  anThaiTue(cungInfos, namSinh.chi);
  anLongTri(cungInfos, namSinh.chi);
  anPhongCao(cungInfos, namSinh.chi);
  
  // An các sao theo năm
  anVanXuong(cungInfos, namSinh.chi);
  anVanKhuc(cungInfos, namSinh.chi);
  
  // Xử lý trạng thái sao (Vượng, Bình, Hãm)
  xacDinhTrangThaiSao(cungInfos);
  
  return cungInfos;
}

/**
 * Khởi tạo 12 cung cơ bản
 */
function khaiTao12Cung(
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number,
  gioSinh: { can: ThienCan; chi: DiaChi },
  gioiTinh: 'nam' | 'nu'
): CungInfo[] {
  // Tính vị trí cung Mệnh dựa trên tháng sinh và giờ sinh
  const menhCungPosition = tinhViTriCungMenh(thangSinh, gioSinh.chi, gioiTinh);
  
  // Tạo danh sách 12 cung theo thứ tự từ cung Mệnh
  const cungList: CungInfo[] = [];
  
  const diaChiOrder: DiaChi[] = [
    DiaChi.TY, DiaChi.SUU, DiaChi.DAN, DiaChi.MAO, 
    DiaChi.THIN, DiaChi.TI, DiaChi.NGO, DiaChi.MUI, 
    DiaChi.THAN, DiaChi.DAU, DiaChi.TUAT, DiaChi.HOI
  ];
  
  const cungOrder: Cung[] = [
    Cung.MENH, Cung.PHU_THE, Cung.PHUC_DUC, Cung.DIEN_TRACH,
    Cung.QUAN_LOC, Cung.NHAN_DI, Cung.TAI_BACH, Cung.TU_TUC,
    Cung.TAT_ACH, Cung.THIEN_DI, Cung.PHUC, Cung.MENH_THAN
  ];
  
  // Khởi tạo 12 cung với Địa Chi tương ứng
  for (let i = 0; i < 12; i++) {
    const diaChiIndex = (menhCungPosition + i) % 12;
    
    cungList.push({
      viTri: cungOrder[i],
      diaChi: diaChiOrder[diaChiIndex],
      daiHan: [],
      tieuHan: [],
      sao: []
    });
  }
  
  return cungList;
}

/**
 * Tính vị trí cung Mệnh dựa trên tháng sinh và giờ sinh
 */
function tinhViTriCungMenh(thangSinh: number, gioSinh: DiaChi, gioiTinh: 'nam' | 'nu'): number {
  // Quy đổi giờ sinh sang chỉ số từ 0-11
  const gioIndex = Object.values(DiaChi).indexOf(gioSinh);
  
  // Công thức tính cung Mệnh theo Tử Vi Đẩu Số
  // (Thực tế có nhiều phương pháp tính khác nhau, đây là một phương pháp phổ biến)
  let menhPosition = (thangSinh - 1) * 2 + (gioIndex % 12);
  menhPosition = menhPosition % 12;
  
  // Nếu là nữ, đảo ngược chiều (từ Mệnh đến Phụ Thê là ngược chiều kim đồng hồ)
  if (gioiTinh === 'nu') {
    menhPosition = (12 - menhPosition) % 12;
  }
  
  return menhPosition;
}

/**
 * Tính vị trí sao Tử Vi
 */
function tinhViTriTuVi(
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number
): number {
  // Tính âm dương của năm
  const namAmDuong = getAmDuongTuCanChi(namSinh.can, namSinh.chi);
  
  // Quy đổi ngày sinh sang chỉ số từ 1-30
  const ngayChiSo = ngaySinh % 30 === 0 ? 30 : ngaySinh % 30;
  
  // Tính chỉ số của sao Tử Vi dựa trên ngày sinh và cục
  const cuc = tinhCuc(namSinh, thangSinh, ngaySinh);
  const tuViChiSo = ngayChiSo + cuc.giaTriCuc;
  
  // Áp dụng công thức theo Tử Vi Đẩu Số cổ điển
  let tuViPosition;
  if (tuViChiSo <= 12) {
    tuViPosition = tuViChiSo - 1;
  } else if (tuViChiSo <= 24) {
    tuViPosition = tuViChiSo - 13;
  } else if (tuViChiSo <= 36) {
    tuViPosition = tuViChiSo - 25;
  } else if (tuViChiSo <= 48) {
    tuViPosition = tuViChiSo - 37;
  } else if (tuViChiSo <= 60) {
    tuViPosition = tuViChiSo - 49;
  } else {
    tuViPosition = tuViChiSo - 61;
  }
  
  // Hiệu chỉnh dựa trên âm dương của năm
  if (namAmDuong === 'Âm') {
    tuViPosition = (12 - tuViPosition) % 12;
  }
  
  return tuViPosition;
}

/**
 * Tính ngũ hành cục
 */
function tinhCuc(
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number
): { nguHanh: NguHanh, giaTriCuc: number } {
  // Tính ngũ hành năm sinh
  const nguHanhNam = getNguHanhTuCanChi(namSinh.can, namSinh.chi);
  
  // Tính mệnh cục dựa trên ngũ hành năm sinh và Địa Chi của tháng
  // Đây là tính theo phương pháp đơn giản, thực tế có nhiều yếu tố khác cần xét
  let nguHanhCuc: NguHanh;
  let giaTriCuc: number;
  
  // Quy đổi tháng âm sang Địa Chi tương ứng
  const thangChi = Object.values(DiaChi)[thangSinh - 1];
  
  // Logic xác định cục
  // Thực tế cần bảng tra chi tiết hơn
  if (
    (nguHanhNam === NguHanh.HOA && [DiaChi.DAN, DiaChi.MAO, DiaChi.THIN].includes(thangChi)) ||
    (nguHanhNam === NguHanh.THO && [DiaChi.TI, DiaChi.NGO, DiaChi.MUI].includes(thangChi))
  ) {
    nguHanhCuc = NguHanh.MOC;
    giaTriCuc = 3; // Mộc tam cục
  } else if (
    (nguHanhNam === NguHanh.MOC && [DiaChi.TI, DiaChi.NGO, DiaChi.MUI].includes(thangChi)) ||
    (nguHanhNam === NguHanh.THUY && [DiaChi.THAN, DiaChi.DAU, DiaChi.TUAT].includes(thangChi))
  ) {
    nguHanhCuc = NguHanh.HOA;
    giaTriCuc = 6; // Hỏa lục cục
  } else if (
    (nguHanhNam === NguHanh.HOA && [DiaChi.THAN, DiaChi.DAU, DiaChi.TUAT].includes(thangChi)) ||
    (nguHanhNam === NguHanh.THO && [DiaChi.HOI, DiaChi.TY, DiaChi.SUU].includes(thangChi))
  ) {
    nguHanhCuc = NguHanh.THO;
    giaTriCuc = 5; // Thổ ngũ cục
  } else if (
    (nguHanhNam === NguHanh.MOC && [DiaChi.HOI, DiaChi.TY, DiaChi.SUU].includes(thangChi)) ||
    (nguHanhNam === NguHanh.THUY && [DiaChi.DAN, DiaChi.MAO, DiaChi.THIN].includes(thangChi))
  ) {
    nguHanhCuc = NguHanh.KIM;
    giaTriCuc = 4; // Kim tứ cục
  } else {
    nguHanhCuc = NguHanh.THUY;
    giaTriCuc = 2; // Thủy nhị cục
  }
  
  return { nguHanh: nguHanhCuc, giaTriCuc };
}

/**
 * An sao Tử Vi vào cung
 */
function anSaoTuVi(cungInfos: CungInfo[], tuViPosition: number): void {
  // Tìm cung tương ứng với vị trí Tử Vi
  const cungTuVi = cungInfos.find((cung) => Object.values(DiaChi).indexOf(cung.diaChi) === tuViPosition);
  
  if (cungTuVi) {
    cungTuVi.sao.push({
      ten: ChinhTinh.TU_VI,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.THO,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Liêm Trinh
 */
function anLiemTrinh(cungInfos: CungInfo[], tuViPosition: number): void {
  // Liêm Trinh cách Tử Vi 4 cung theo chiều thuận
  const liemTrinhPosition = (tuViPosition + 4) % 12;
  
  const cungLiemTrinh = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === liemTrinhPosition
  );
  
  if (cungLiemTrinh) {
    cungLiemTrinh.sao.push({
      ten: ChinhTinh.LIEM_TRINH,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thiên Đồng
 */
function anThienDong(cungInfos: CungInfo[], tuViPosition: number): void {
  // Thiên Đồng cách Tử Vi 11 cung theo chiều thuận
  const thienDongPosition = (tuViPosition + 11) % 12;
  
  const cungThienDong = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thienDongPosition
  );
  
  if (cungThienDong) {
    cungThienDong.sao.push({
      ten: ChinhTinh.THIEN_DONG,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Vũ Khúc
 */
function anVuKhuc(cungInfos: CungInfo[], tuViPosition: number): void {
  // Vũ Khúc cách Tử Vi 2 cung theo chiều thuận
  const vuKhucPosition = (tuViPosition + 2) % 12;
  
  const cungVuKhuc = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === vuKhucPosition
  );
  
  if (cungVuKhuc) {
    cungVuKhuc.sao.push({
      ten: ChinhTinh.VU_KHUC,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.KIM,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thái Dương
 */
function anThaiDuong(cungInfos: CungInfo[], tuViPosition: number): void {
  // Thái Dương cách Tử Vi 3 cung theo chiều thuận
  const thaiDuongPosition = (tuViPosition + 3) % 12;
  
  const cungThaiDuong = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thaiDuongPosition
  );
  
  if (cungThaiDuong) {
    cungThaiDuong.sao.push({
      ten: ChinhTinh.THAI_DUONG,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thái Âm
 */
function anThaiAm(cungInfos: CungInfo[], tuViPosition: number): void {
  // Thái Âm cách Tử Vi 9 cung theo chiều thuận
  const thaiAmPosition = (tuViPosition + 9) % 12;
  
  const cungThaiAm = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thaiAmPosition
  );
  
  if (cungThaiAm) {
    cungThaiAm.sao.push({
      ten: ChinhTinh.THAI_AM,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Âm' as AmDuong
    });
  }
}

/**
 * An sao Tham Lang
 */
function anThamLang(cungInfos: CungInfo[], tuViPosition: number): void {
  // Tham Lang cách Tử Vi 1 cung theo chiều nghịch
  const thamLangPosition = (tuViPosition - 1 + 12) % 12;
  
  const cungThamLang = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thamLangPosition
  );
  
  if (cungThamLang) {
    cungThamLang.sao.push({
      ten: ChinhTinh.THAM_LANG,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Cự Môn
 */
function anCuMon(cungInfos: CungInfo[], tuViPosition: number): void {
  // Cự Môn cách Tử Vi 1 cung theo chiều thuận
  const cuMonPosition = (tuViPosition + 1) % 12;
  
  const cungCuMon = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === cuMonPosition
  );
  
  if (cungCuMon) {
    cungCuMon.sao.push({
      ten: ChinhTinh.CU_MON,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Âm' as AmDuong
    });
  }
}

/**
 * An sao Thất Sát
 */
function anThatSat(cungInfos: CungInfo[], tuViPosition: number): void {
  // Thất Sát cách Tử Vi 7 cung theo chiều thuận
  const thatSatPosition = (tuViPosition + 7) % 12;
  
  const cungThatSat = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thatSatPosition
  );
  
  if (cungThatSat) {
    cungThatSat.sao.push({
      ten: ChinhTinh.THAT_SAT,
      loai: 'ChinhTinh',
      nguHanh: NguHanh.KIM,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Phá Quân
 */
function anPhaQuan(cungInfos: CungInfo[], tuViPosition: number): void {
  // Phá Quân cách Tử Vi 5 cung theo chiều nghịch
  const phaQuanPosition = (tuViPosition - 5 + 12) % 12;
  
  const cungPhaQuan = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === phaQuanPosition
  );
  
  if (cungPhaQuan) {
    cungPhaQuan.sao.push({
      ten: 'Phá Quân',
      loai: 'ChinhTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Tả Phụ
 */
function anTaPhu(
  cungInfos: CungInfo[], 
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number
): void {
  // Tính vị trí Tả Phụ theo công thức dựa trên Can Chi năm sinh
  const canIndex = Object.values(ThienCan).indexOf(namSinh.can);
  const taPhuPosition = (canIndex + thangSinh + ngaySinh) % 12;
  
  const cungTaPhu = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === taPhuPosition
  );
  
  if (cungTaPhu) {
    cungTaPhu.sao.push({
      ten: 'Tả Phụ',
      loai: 'PhuTinh',
      nguHanh: NguHanh.THO,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Hữu Bật
 */
function anHuuBat(
  cungInfos: CungInfo[], 
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number
): void {
  // Tính vị trí Hữu Bật theo công thức dựa trên Can Chi năm sinh
  const canIndex = Object.values(ThienCan).indexOf(namSinh.can);
  const huuBatPosition = (canIndex + thangSinh + ngaySinh + 4) % 12;
  
  const cungHuuBat = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === huuBatPosition
  );
  
  if (cungHuuBat) {
    cungHuuBat.sao.push({
      ten: 'Hữu Bật',
      loai: 'PhuTinh',
      nguHanh: NguHanh.THO,
      amDuong: 'Âm' as AmDuong
    });
  }
}

/**
 * An sao Quan Phúc
 */
function anQuanPhuc(
  cungInfos: CungInfo[], 
  namSinh: { can: ThienCan; chi: DiaChi },
  thangSinh: number,
  ngaySinh: number
): void {
  // Tính vị trí Quan Phúc theo công thức dựa trên Can Chi năm sinh
  const chiIndex = Object.values(DiaChi).indexOf(namSinh.chi);
  const quanPhucPosition = (chiIndex + thangSinh * 2 + ngaySinh) % 12;
  
  const cungQuanPhuc = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === quanPhucPosition
  );
  
  if (cungQuanPhuc) {
    cungQuanPhuc.sao.push({
      ten: 'Quan Phúc',
      loai: 'PhuTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thiên Khôi
 */
function anThienKhoi(cungInfos: CungInfo[], namCan: ThienCan): void {
  // Vị trí Thiên Khôi dựa vào Thiên Can năm sinh
  let khoi = 0;
  
  // Bảng tra theo Thiên Can
  switch (namCan) {
    case ThienCan.GIAP:
      khoi = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case ThienCan.AT:
      khoi = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case ThienCan.BINH:
      khoi = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case ThienCan.DINH:
      khoi = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
    case ThienCan.MAU:
      khoi = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case ThienCan.KY:
      khoi = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case ThienCan.CANH:
      khoi = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
    case ThienCan.TAN:
      khoi = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case ThienCan.NHAM:
      khoi = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
    case ThienCan.QUY:
      khoi = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
  }
  
  const cungKhoi = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === khoi
  );
  
  if (cungKhoi) {
    cungKhoi.sao.push({
      ten: ChinhTinh.THIEN_KHOI,
      loai: 'PhuTinh',
      nguHanh: NguHanh.MOC,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thiên Việt
 */
function anThienViet(cungInfos: CungInfo[], namCan: ThienCan): void {
  // Vị trí Thiên Việt dựa vào Thiên Can năm sinh
  let viet = 0;
  
  // Bảng tra theo Thiên Can
  switch (namCan) {
    case ThienCan.GIAP:
      viet = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case ThienCan.AT:
      viet = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
    case ThienCan.BINH:
      viet = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case ThienCan.DINH:
      viet = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case ThienCan.MAU:
      viet = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
    case ThienCan.KY:
      viet = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case ThienCan.CANH:
      viet = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case ThienCan.TAN:
      viet = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case ThienCan.NHAM:
      viet = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
    case ThienCan.QUY:
      viet = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
  }
  
  const cungViet = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === viet
  );
  
  if (cungViet) {
    cungViet.sao.push({
      ten: ChinhTinh.THIEN_VIET,
      loai: 'PhuTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thiên Mã
 */
function anThienMa(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Thiên Mã dựa vào Địa Chi năm sinh
  let ma = 0;
  
  // Bảng tra theo Địa Chi
  switch (namChi) {
    case DiaChi.TY:
      ma = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
    case DiaChi.SUU:
    case DiaChi.MUI:
      ma = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case DiaChi.DAN:
    case DiaChi.THAN:
      ma = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case DiaChi.MAO:
    case DiaChi.DAU:
      ma = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case DiaChi.THIN:
    case DiaChi.TUAT:
      ma = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case DiaChi.TI:
    case DiaChi.HOI:
      ma = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case DiaChi.NGO:
      ma = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
  }
  
  const cungMa = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === ma
  );
  
  if (cungMa) {
    cungMa.sao.push({
      ten: 'Thiên Mã',
      loai: 'PhuTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Đào Hoa
 */
function anDaoHoa(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Đào Hoa dựa vào Địa Chi năm sinh
  let daoHoa = 0;
  
  // Bảng tra theo Địa Chi
  switch (namChi) {
    case DiaChi.TY:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.MUI); // Mùi
      break;
    case DiaChi.SUU:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case DiaChi.DAN:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case DiaChi.MAO:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
    case DiaChi.THIN:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
    case DiaChi.TI:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case DiaChi.NGO:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
    case DiaChi.MUI:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case DiaChi.THAN:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case DiaChi.DAU:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.THIN); // Thìn
      break;
    case DiaChi.TUAT:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case DiaChi.HOI:
      daoHoa = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
  }
  
  const cungDaoHoa = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === daoHoa
  );
  
  if (cungDaoHoa) {
    cungDaoHoa.sao.push({
      ten: 'Đào Hoa',
      loai: 'PhuTinh',
      nguHanh: NguHanh.MOC,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Hồng Loan
 */
function anHongLoan(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Hồng Loan dựa vào Địa Chi năm sinh, ngược chiều Đào Hoa 4 cung
  let hongLoan = 0;
  
  // Bảng tra theo Địa Chi
  switch (namChi) {
    case DiaChi.TY:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case DiaChi.SUU:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.THIN); // Thìn
      break;
    case DiaChi.DAN:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case DiaChi.MAO:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
    case DiaChi.THIN:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.MUI); // Mùi
      break;
    case DiaChi.TI:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case DiaChi.NGO:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case DiaChi.MUI:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
    case DiaChi.THAN:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
    case DiaChi.DAU:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case DiaChi.TUAT:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
    case DiaChi.HOI:
      hongLoan = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
  }
  
  const cungHongLoan = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === hongLoan
  );
  
  if (cungHongLoan) {
    cungHongLoan.sao.push({
      ten: 'Hồng Loan',
      loai: 'PhuTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Âm' as AmDuong
    });
  }
}

/**
 * An sao Thiên Hỷ
 */
function anThienHy(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Thiên Hỷ dựa vào Địa Chi năm sinh, kề bên Hồng Loan
  const hongLoanPosition = Object.values(DiaChi).indexOf(
    cungInfos.find(cung => cung.sao.some(sao => sao.ten === 'Hồng Loan'))?.diaChi || DiaChi.TY
  );
  
  const thienHyPosition = (hongLoanPosition + 1) % 12;
  
  const cungThienHy = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thienHyPosition
  );
  
  if (cungThienHy) {
    cungThienHy.sao.push({
      ten: 'Thiên Hỷ',
      loai: 'PhuTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Thái Tuế
 */
function anThaiTue(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Thái Tuế chính là Địa Chi năm sinh
  const thaiTuePosition = Object.values(DiaChi).indexOf(namChi);
  
  const cungThaiTue = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === thaiTuePosition
  );
  
  if (cungThaiTue) {
    cungThaiTue.sao.push({
      ten: 'Thái Tuế',
      loai: 'PhuTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Long Trì
 */
function anLongTri(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Long Trì dựa vào Địa Chi năm sinh
  let longTri = 0;
  
  // Bảng tra theo Địa Chi
  switch (namChi) {
    case DiaChi.TY:
    case DiaChi.NGO:
      longTri = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case DiaChi.SUU:
    case DiaChi.MUI:
      longTri = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case DiaChi.DAN:
    case DiaChi.THAN:
      longTri = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
    case DiaChi.MAO:
    case DiaChi.DAU:
      longTri = Object.values(DiaChi).indexOf(DiaChi.MUI); // Mùi
      break;
    case DiaChi.THIN:
    case DiaChi.TUAT:
      longTri = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case DiaChi.TI:
    case DiaChi.HOI:
      longTri = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
  }
  
  const cungLongTri = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === longTri
  );
  
  if (cungLongTri) {
    cungLongTri.sao.push({
      ten: 'Long Trì',
      loai: 'PhuTinh',
      nguHanh: NguHanh.THUY,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Phong Cáo
 */
function anPhongCao(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Phong Cáo dựa vào Địa Chi năm sinh
  let phongCao = 0;
  
  // Bảng tra theo Địa Chi
  switch (namChi) {
    case DiaChi.TY:
    case DiaChi.NGO:
      phongCao = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case DiaChi.SUU:
    case DiaChi.MUI:
      phongCao = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case DiaChi.DAN:
    case DiaChi.THAN:
      phongCao = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
    case DiaChi.MAO:
    case DiaChi.DAU:
      phongCao = Object.values(DiaChi).indexOf(DiaChi.THIN); // Thìn
      break;
    case DiaChi.THIN:
    case DiaChi.TUAT:
      phongCao = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case DiaChi.TI:
    case DiaChi.HOI:
      phongCao = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
  }
  
  const cungPhongCao = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === phongCao
  );
  
  if (cungPhongCao) {
    cungPhongCao.sao.push({
      ten: 'Phong Cáo',
      loai: 'PhuTinh',
      nguHanh: NguHanh.HOA,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Văn Xương
 */
function anVanXuong(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Văn Xương dựa vào Địa Chi năm sinh
  let vanXuong = 0;
  
  // Bảng tra theo Địa Chi
  switch (namChi) {
    case DiaChi.TY:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case DiaChi.SUU:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.THIN); // Thìn
      break;
    case DiaChi.DAN:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case DiaChi.MAO:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case DiaChi.THIN:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
    case DiaChi.TI:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
    case DiaChi.NGO:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
    case DiaChi.MUI:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
    case DiaChi.THAN:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case DiaChi.DAU:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case DiaChi.TUAT:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.MUI); // Mùi
      break;
    case DiaChi.HOI:
      vanXuong = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
  }
  
  const cungVanXuong = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === vanXuong
  );
  
  if (cungVanXuong) {
    cungVanXuong.sao.push({
      ten: 'Văn Xương',
      loai: 'PhuTinh',
      nguHanh: NguHanh.KIM,
      amDuong: 'Dương' as AmDuong
    });
  }
}

/**
 * An sao Văn Khúc
 */
function anVanKhuc(cungInfos: CungInfo[], namChi: DiaChi): void {
  // Vị trí Văn Khúc dựa vào Địa Chi năm sinh
  let vanKhuc = 0;
  
  // Bảng tra theo Địa Chi, ngược chiều với Văn Xương
  switch (namChi) {
    case DiaChi.TY:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.HOI); // Hợi
      break;
    case DiaChi.SUU:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.TUAT); // Tuất
      break;
    case DiaChi.DAN:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.DAU); // Dậu
      break;
    case DiaChi.MAO:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.THAN); // Thân
      break;
    case DiaChi.THIN:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.MUI); // Mùi
      break;
    case DiaChi.TI:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.NGO); // Ngọ
      break;
    case DiaChi.NGO:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.TI); // Tỵ
      break;
    case DiaChi.MUI:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.THIN); // Thìn
      break;
    case DiaChi.THAN:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.MAO); // Mão
      break;
    case DiaChi.DAU:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.DAN); // Dần
      break;
    case DiaChi.TUAT:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.SUU); // Sửu
      break;
    case DiaChi.HOI:
      vanKhuc = Object.values(DiaChi).indexOf(DiaChi.TY); // Tý
      break;
  }
  
  const cungVanKhuc = cungInfos.find(
    (cung) => Object.values(DiaChi).indexOf(cung.diaChi) === vanKhuc
  );
  
// Chưa hoàn thiện cần tiếp tục

