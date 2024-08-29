import { environment } from '../../../environments/environment';

export enum TokenEnum {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export enum Genders {
  'Nam' = 0,
  'Nữ' = 1,
  'Khác' = 2
}

export enum ManagementType {
  SystemAdmin = 0,
  UnitAdmin = 1
}

export class AppStatusCode {
  public static StatusCode200 = 200;
  public static StatusCode201 = 201;
  public static StatusCode400 = 400;
  public static StatusCode401 = 401;
  public static StatusCode422 = 422;
  public static StatusCode500 = 500;
}

export class StorageOption {
  public static Cookie = 'Cookie';
  public static LocalStorage = 'LocalStorage';
}

export class AppMessageResponse {
  public static InternalServer = "Lỗi hệ thống!";
  public static BadRequest = "Hệ thống có lỗi sảy ra!";
  public static CreatedSuccess = "Thêm mới thành công!";
  public static UpdatedSuccess = "Cập nhật thành công!";
  public static DeletedSuccess = "Xóa thành công!";

  //#region "type_card"
  public static vehicleId_empty = "Vui lòng chọn phương tiện để tiếp tục!";
  public static lstProject_empty = "Vui lòng chọn ít nhất 1 khu đô thị tích hợp để tiếp tục!";
  //#endregion
}

export const domainFileTemplate = environment.apiUrl.concat('api/cms/Project/importExcelProjects/');

export class StorageData {
  public static userId = 'user_id';
  public static phone = 'phone_number';
  public static avatar = 'avatar_url';
  public static email = 'email';
  public static fullName = 'full_name';
  public static accessToken = 'access_token';
  public static listMenus = 'list_menu';
  public static departmentId = 'department_id';
  public static companyId = 'company_id';
  public static unitName = 'unit_name';
  public static userInfo = 'userInfo';
}

export class GroupCardEnum {
  public static card_car = 2;
  public static card_resident = 1;
}

export const StatusOption = [
  { label: 'Đã về ở', value: 1, code: 'ALREADY_IN' },
  { label: 'Chuẩn bị về ở', value: 2, code: 'PREPARE_IN' },
  { label: 'Ở thường xuyên', value: 3, code: 'OFTEN_IN' },
  { label: 'Chưa về ở', value: 4, code: 'NOT_IN' },
  { label: 'Khách thuê của Chủ Sở Hữu', value: 5, code: 'OWNER_TENANT' },
  { label: 'Khách thuê của Chủ Đầu Tư', value: 6, code: 'INVESTOR_TENANT' },
  { label: 'Căn hộ mẫu', value: 7, code: 'DEMO_APARTMENT' },
  { label: 'Đã bán, chưa về ở', value: 8, code: 'SOLD_NOT_IN' },
  { label: 'Căn hộ trải nghiệm', value: 9, code: 'EXPRERIENCE_APARTMENT' }
]

export const Staying = [
  { label: 'Chưa đăng ký tạm trú', value: 1 },
  { label: 'Đã đăng ký tạm trú', value: 2 },
  { label: 'Đã có hộ khẩu thường trú', value: 3 }
];

export const Deposit = [
  { label: 'Chưa đặt cọc', value: 1 },
  { label: 'Đã đặt cọc', value: 2 },
];

export const Role = [
  { label: 'Chủ căn hộ', value: 1 },
  { label: 'Khách thuê', value: 2 },
  { label: 'Thành viên căn hộ', value: 3 },
  { label: 'Thành viên khách thuê', value: 4 }
];
export const TypeEmployee = [
  { label: 'Quản trị', value: 1 },
  { label: 'Quản lý', value: 2 },
  { label: 'Trưởng phòng', value: 3 },
  { label: 'Nhân viên', value: 4 }
];

export const RelationshipOption = [
  { label: 'Là bố/mẹ', value: 1 },
  { label: 'Là vợ/chồng', value: 2 },
  { label: 'Là con', value: 3 },
  { label: 'Là anh/chị/em', value: 4 },
  { label: 'Là bạn', value: 5 },
  { label: 'Là khách thuê nhà', value: 6 }
];

export const TypeNews = [
  { label: 'Bài viết sổ tay cư dân', value: 1 },
  { label: 'Bài viết bảng tin cư dân', value: 2 },
  { label: 'Bài viết tin tức', value: 3 },
  { label: 'Bài viết thông báo', value: 4 },
];
export enum TypeNew {
  NOTEBOOK = 1, //Bài viết sổ tay cư dân
  NEWS_RESIDENT = 2, //Bài viết bảng tin cư dân
  NEWS = 3, //Bài viết tin tức
  NOTIFICATION = 4, //Bài viết thông báo
}

export const TypeDocument = [
  { label: 'Hợp đồng mua bán', value: 0 },
  { label: 'Giấy tờ chứng minh quyền sở hữu', value: 1 },
  { label: 'Biên bản giao nhận', value: 2 },
  { label: 'Bản vẽ kiến trúc', value: 3 },
  { label: 'Bản đồ kỹ thuật', value: 4 },
  { label: 'Giấy phép xây dựng', value: 5 },
  { label: 'Bảng kê chi phí', value: 6 },
  { label: 'Báo cáo kiểm tra kỹ thuật', value: 7 },
];

export const ListOrder = [
  { label: 'Tất cả', value: 1 },
  { label: 'Có đặt cọc', value: 2 },
  { label: 'Không đặt cọc', value: 3 },
]

export const ListOrderStatus = [
  { label: 'Tất cả', value: 1 },
  { label: 'Đã đặt cọc', value: 2 },
  { label: 'Chưa đặt cọc', value: 3 },
]

export const TypeDepartment = [
  { label: 'Phòng Ban quản lý', value: 0 },
  { label: 'Phòng Ban chăm sóc khách hàng', value: 1 },
  { label: 'Phòng Quản lý dự án', value: 2 },
  { label: 'Phòng Kỹ thuật', value: 3 },
  { label: 'Phòng Quản lý An ninh', value: 4 },
  { label: 'Phòng Quản lý Dịch vụ', value: 5 },
  { label: 'Phòng Quản lý Tài chính', value: 6 },
  { label: 'Phòng Quản lý Hành chính', value: 7 },
];
export const TypeTransfer = [
  { label: 'Vận chuyển vào', value: 1 },
  { label: 'Vận chuyển ra', value: 2 },
];
export const InvContractType = [
  { label: 'Đang hoạt động', value: 1 },
  { label: 'Đã hủy', value: 2 },
  { label: 'Thanh lý', value: 2 },
];
export const Utilities = [
  { label: 'Vận chuyển hàng hóa vào', value: 0 },
  { label: 'Vận chuyển hàng hóa ra', value: 1 },
  { label: 'Thi công', value: 2 },
  { label: 'Thẻ/ cư dân về ở', value: 3 },
  { label: 'Đặt sân', value: 4 },
];

export const IsAccounts = [
  { label: 'Có tài khoản', value: true },
  { label: 'Không có tài khoản', value: false },
];

export const IsStatus = [
  { label: 'Kích hoạt', value: 1 },
  { label: 'Chưa kích hoạt', value: 10 },
];

export const IsShow = [
  { label: 'Hiển thị', value: 1 },
  { label: 'Không hiển thị', value: 10 },
];

export const TypeViewApp = [
  { label: 'Khối', value: 1 },
  { label: 'Chức năng', value: 2 },
  { label: 'Tiện ích', value: 3 },
  { label: 'Dịch vụ', value: 4 },
];



export const InvService_Type = [
  { label: 'Dịch vụ xe', value: 1 },
  { label: 'Dịch vụ quản lý', value: 2 },
  { label: 'Dịch vụ hàng tháng', value: 3 },
  { label: 'Dịch vụ khác', value: 4 },
]
export const Tax = [
  { label: '5%', value: 5 },
  { label: '8%', value: 8 },
  { label: '10%', value: 10 },
]

export const GroupCard = [
  { name: 'Nhóm thẻ cư dân', id: 1 },
  { name: 'Nhóm thẻ xe', id: 2 },
]

export const StatusActive = [
  { name: 'Chưa kích hoạt', id: false },
  { name: 'Kích hoạt', id: true },
]
export const CardRequestProcessStatus = [
  { id: 1, name: 'Đăng kí mới', code: 'NEW_REQUEST' },
  { id: 2, name: 'Chờ cư dân bổ sung thông tin', code: 'REQUIRE_INFOMATION' },
  { id: 3, name: 'Đang xử lý', code: 'PROCESSING' },
  { id: 4, name: 'Không phê duyệt đăng ký', code: 'REJECT_REQUEST' },
  { id: 5, name: 'Phê duyệt đăng ký', code: 'ACEPT_REQUEST' },
  { id: 6, name: 'Chờ cư dân đóng phí', code: 'REQUIRE_PAY' },
  { id: 7, name: 'Chờ cấp thẻ', code: 'REQUIRE_CARD' },
  { id: 8, name: 'Chờ bàn giao thẻ', code: 'REQUIRE_HANDOVER' },
  { id: 9, name: 'Hoàn thành', code: 'FINISHED' },
]
export const ChangeCardRequestProcessStatus = [
  { id: 1, name: 'Đăng kí mới', code: 'NEW_REQUEST' },
  { id: 2, name: 'Chờ cư dân bổ sung thông tin', code: 'REQUIRE_INFOMATION' },
  { id: 3, name: 'Không phê duyệt đăng ký', code: 'REJECT_REQUEST' },
  { id: 4, name: 'Phê duyệt đăng ký', code: 'ACEPT_REQUEST' },
  { id: 5, name: 'Hoàn thành', code: 'FINISHED' },
]
export const CancelCardRequestProcessStatus = [
  { id: 1, name: 'Đăng kí mới', code: 'NEW_REQUEST' },
  { id: 2, name: 'Không phê duyệt đăng ký', code: 'REJECT_REQUEST' },
  { id: 3, name: 'Phê duyệt đăng ký', code: 'ACEPT_REQUEST' },
  { id: 4, name: 'Hoàn thành', code: 'FINISHED' },
]

export const OrderStatus = [
  { value: 1, label: 'Đăng kí mới', disabled: false },
  { value: 2, label: 'Chờ cư dân bổ sung thông tin', disabled: false },
  { value: 3, label: 'Duyệt đơn', disabled: false },
  { value: 4, label: 'Hủy đơn', disabled: false },
  { value: 5, label: 'Chờ thanh toán', disabled: false },
  { value: 6, label: 'Hoàn thành', disabled: false },
]

export const ConstructionStatus = [
  { value: 1, label: 'Đang thi công' },
  { value: 2, label: 'Tạm dừng thi công' },
]

export const OrderConstructionStatus = [
  { value: 1, label: 'Đăng kí mới', disabled: false },
  { value: 2, label: 'Chờ cư dân bổ sung thông tin', disabled: false },
  { value: 3, label: 'Duyệt đơn', disabled: false },
  { value: 4, label: 'Hủy đơn', disabled: false },
  { value: 5, label: 'Chờ nghiệm thu', disabled: false },
  { value: 6, label: 'Hoàn thành', disabled: false },
]

export const OrderYardStatus = [
  { value: 1, label: 'Đăng kí mới' },
  { value: 2, label: 'Chờ cư dân bổ sung thông tin' },
  { value: 3, label: 'Duyệt đơn' },
  { value: 4, label: 'Hủy đơn' },
  { value: 5, label: 'Chờ kết thúc' },
  { value: 6, label: 'Hoàn thành' },
]
export const UserConfirm = [
  { value: 1, label: 'Ban quản lý' },
  { value: 2, label: 'Test ...' },

]


export const DocumentStatus = [
  { label: 'Đăng ký mới', value: 1 },
  { label: 'Phê duyệt đăng ký', value: 2 },
  { label: 'Không phê duyệt đăng ký', value: 3 },
]
export const StatusMethod = [
  { label: 'Chưa hoàn cọc', value: 1 },
  { label: 'Đã hoàn cọc', value: 2 }
]

export const DocumentFileType = [
  { label: 'Bản vẽ thi công', value: 1 },
  { label: 'Hồ sơ khác', value: 2 }
]
export const TypeCardRequest = [
  { id: 1, name: 'Đăng kí mới', code: 'NEW_CARD' },
  { id: 2, name: 'Đăng ký thay đổi thông tin', code: 'MODIFIED_CARD' },
  { id: 3, name: 'Đăng ký khóa thẻ', code: 'LOCK_CARD' },
  { id: 4, name: 'Đăng ký mở khóa thẻ', code: 'UNLOCK_CARD' },
  { id: 5, name: 'Đăng ký hủy thẻ', code: 'CANCEL_CARD' },
]

export const CardStatus = [
  { name: 'Thẻ trống', code: "EMPTY" },
  { name: 'Đã khóa', code: "LOCKED" },
  { name: 'Đang hoạt động', code: "ACTIVE" },
  { name: 'Đã hủy', code: "CANCELLED" },
]
export const TypePayment = [
  { Id: 1, Name: 'Thanh toán Online', Code: 'ONLINE_PAYMENT' },
  { Id: 2, Name: 'Thanh toán trực tiếp', Code: 'DIRECT_PAYMENT' }
]


export const StatusPayment = [
  { Id: 1, Name: 'Đợi thanh toán', Code: 'WAIT_PAY' },
  { Id: 2, Name: 'Đã thanh toán', Code: 'PAID' }
]
export const StatusReceive = [
  { Id: 1, Name: 'Chưa nhận được', Code: 'NOT_RECEIVE' },
  { Id: 2, Name: 'Đã nhận được', Code: 'RECEIVED' },
]
export const Gender = [
  { Id: 1, Name: 'Nam', Code: 'MALE' },
  { Id: 2, Name: 'Nữ', Code: 'FEMALE' },
  { Id: 3, Name: 'Khác', Code: 'OTHER' },
]
export const ServiceType = [
  { Id: 1, Name: 'Thuê theo giờ' },
  { Id: 2, Name: 'Thuê sân theo khung giờ' },
  { Id: 3, Name: 'Thuê sân theo lũy tiền' },
]
export const UserCancel = [
  { Id: 1, Name: 'Bên đăng ký' },
  { Id: 2, Name: 'Ban quản lý' },
]
export const TypeCard = [
  { Id: 1, Name: 'Thẻ trống', Code: 'EMPTY' },
  { Id: 2, Name: 'Thẻ khóa', Code: 'LOCKED' },
  { Id: 3, Name: 'Thẻ hoạt động', Code: 'ACTIVE' },
  { Id: 4, Name: 'Thẻ khóa', Code: 'CANCELLED' },
]
export const StatusBooking = [
  { Id: 1, Name: 'Đăng ký mới' },
  { Id: 2, Name: 'Chờ hủy' },
  { Id: 3, Name: 'Duyệt đơn' },
  { Id: 4, Name: 'Chờ kết thúc' },
  { Id: 5, Name: 'Kết thúc' },
  { Id: 6, Name: 'Hủy đơn' },
]

export const RoleManagement = [
  {
    name: "Quản trị hệ thống",
    value: ManagementType.SystemAdmin
  },
  {
    name: "Quản trị đơn vị",
    value: ManagementType.UnitAdmin
  }
]
