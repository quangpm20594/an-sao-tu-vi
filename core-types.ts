// src/lib/tuvi/types/core.ts

/**
 * Thiên Can (Celestial Stems)
 */
export enum ThienCan {
  GIAP = 'Giáp',
  AT = 'Ất',
  BINH = 'Bính',
  DINH = 'Đinh',
  MAU = 'Mậu',
  KY = 'Kỷ',
  CANH = 'Canh',
  TAN = 'Tân',
  NHAM = 'Nhâm',
  QUY = 'Quý'
}

/**
 * Địa Chi (Terrestrial Branches)
 */
export enum DiaChi {
  TY = 'Tý',
  SUU = 'Sửu',
  DAN = 'Dần',
  MAO = 'Mão',
  THIN = 'Thìn',
  TI = 'Tỵ',
  NGO = 'Ngọ',
  MUI = 'Mùi',
  THAN = 'Thân',
  DAU = 'Dậu',
  TUAT = 'Tuất',
  HOI = 'Hợi'
}

/**
 * Ngũ Hành (Five Elements)
 */
export enum NguHanh {
  KIM = 'Kim',
  MOC = 'Mộc',
  THUY = 'Thủy',
  HOA = 'Hỏa',
  THO = 'Thổ'
}

/**
 * Âm Dương (Yin Yang)
 */
export enum AmDuong {
  DUONG = 'Dương',
  AM = 'Âm'
}

/**
 * Cung (Houses)
 */
export enum Cung {
  MENH = 'Mệnh',
  PHU_THE = 'Phụ Thê',
  PHUC_DUC = 'Phúc Đức',
  DIEN_TRACH = 'Điền Trạch',
  QUAN_LOC = 'Quan Lộc',
  NHAN_DI = 'Nhân Di',
  TAI_BACH = 'Tài Bạch',
  TU_TUC = 'Tử Tức',
  TAT_ACH = 'Tật Ách',
  THIEN_DI = 'Thiên Di',
  PHUC = 'Phúc',
  MENH_THAN = 'Mệnh Thân'
}

/**
 * Chính Tinh (Main Stars)
 */
export enum ChinhTinh {
  TU_VI = 'Tử Vi',
  LIEM_TRINH = 'Liêm Trinh',
  THIEN_DONG = 'Thiên Đồng',
  VU_KHUC = 'Vũ Khúc',
  THAI_DUONG = 'Thái Dương',
  THIEN_CO = 'Thiên Cơ',
  THIEN_PHUOC = 'Thiên Phước',
  THIEN_TUONG = 'Thiên Tướng',
  THIEN_LUONG = 'Thiên Lương',
  THAT_SAT = 'Thất Sát',
  THAM_LANG = 'Tham Lang',
  CU_MON = 'Cự Môn',
  THIEN_KHOI = 'Thiên Khôi',
  THIEN_VIET = 'Thiên Việt',
  THAI_AM = 'Thái Âm',
  PHI_LIEM = 'Phi Liêm',
}

/**
 * Trạng thái sao (Star status)
 */
export enum SaoTrangThai {
  VUONG = 'Vượng',
  BINH = 'Bình',
  HAM = 'Hãm'
}

/**
 * Interface cho sao
 */
export interface Sao {
  ten: string;
  loai: 'ChinhTinh' | 'PhuTinh';
  nguHanh: NguHanh;
  amDuong: AmDuong;
  trangThai?: SaoTrangThai;
}

/**
 * Interface cho một cung trong lá số
 */
export interface CungInfo {
  viTri: Cung;
  diaChi: DiaChi;
  daiHan: number[];
  tieuHan: number[];
  sao: Sao[];
}

/**
 * Interface cho thông tin người dùng nhập vào
 */
export interface UserInput {
  ho: string;
  ten: string;
  gioiTinh: 'nam' | 'nu';
  ngaySinh: {
    duong: {
      ngay: number;
      thang: number;
      nam: number;
    };
    gio: number;
    phut: number;
  };
  noiSinh: {
    lat: number;
    lng: number;
    timezone: number;
  };
}

/**
 * Interface cho lá số tử vi hoàn chỉnh
 */
export interface LasoTuVi {
  nguoiXem: {
    ho: string;
    ten: string;
    gioiTinh: 'nam' | 'nu';
    tuoi: {
      amLich: {
        ngay: number;
        thang: number;
        nam: number;
        thienCanNam: ThienCan;
        diaChiNam: DiaChi;
      };
      duongLich: {
        ngay: number;
        thang: number;
        nam: number;
      };
    };
    gio: {
      gioAmLich: DiaChi;
      thienCanGio: ThienCan;
    };
  };
  cuc: {
    nguHanh: NguHanh;
    giaTriCuc: number;
  };
  menh: {
    nguHanh: NguHanh;
    menhChu: string;
  };
  than: {
    cung: Cung;
    diaChi: DiaChi;
  };
  cungChi: CungInfo[];
}
