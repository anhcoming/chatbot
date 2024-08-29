export class ChangeNewRequestCard {
    projectId: number; // id du an
    towerId: number; // id toa nha
    zoneId: number; // id khu vuc
    floorId: number; // id tang
    apartmentId: number; // id căn hộ
    processStatus: string; // trạng thái đăng kí (CardRequestProcessStatus)
    fee: number; // phí làm thẻ
    dateResponse: string; // ngày phản hồi
    ResidentMoveIns: Array<ResidentMoveIns>;
    ResidentCards: Array<ResidentCards>;
    infoApartmentOwner: Array<infoApartmentOwner>;
    CarCards: Array<CarCards>;
    messageResponse: Array<messageResponse>;
}
export class infoApartmentOwner {
    residentId: number;
    phone: string;
    fullName: string;
}
export class messageResponse {
    dateResponse: string;
    message: string;
}
export class ResidentMoveIns {
    Id: any;
    FullName: string;
    ResidentObjectId: string;
    Phone: string;
    email: string;
    statusResident: string;
    dateArrival: string;
    dateLeave: string;
    dateOfBirth: string;
    gender: string;
    identityNumber: string;
    identityPlace: string;
    identityDateSign: string;
    identityDateExpired: string;
    relationId: number;
    nationalId: number;
    statusTemporaty: string;
    temporatyNumber: string;
    dateStayFrom: string;
    dateStayTo: string;  
    fileUploads: Array<fileUploads>                             
}
export class ResidentCards {
    Id: any;
    FullName: string;
    CardId: string;
    phone: string;
    statusResident: string;
    email: string;
    dateArrival: string;
    dateLeave: string;
    dateOfBirth: string;
    gender: string;
    identityNumber: string;
    identityPlace: string;
    identityDateSign: string;
    identityDateExpired: string;
    relationId: number;
    nationalId: number;
    statusTemporaty: string;
    temporatyNumber: string;
    dateStayFrom: string;
    dateStayTo: string;
    ResidentId: number;
    fileUploads: Array<fileUploads>
}
export class CarCards {
    Id: any;
    ResidentId: number;
    vehicleOwner: string;
    vehicleId: number;
    vehiclePlate: string;
    vehicleColor: string;
    vehicleName: string;
    vehicleModel: string;
    VehicleDescription: string;
    fileUploads: Array<fileUploads>
}

export class fileUploads{
    nameFile: string;
    pathFile: string;
}
