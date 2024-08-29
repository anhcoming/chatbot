export class OrderTransport {
    Id : number;
    CreatedAt : Date | undefined;
    CreatedById : number | undefined;
    CreatedBy : number | undefined;
    UpdatedAt : Date | undefined;
    UpdatedById : number | undefined;
    UpdatedBy : number | undefined;
    Status : number | undefined;
    CompanyId : number | undefined;
    ProjectId : number | undefined;
    TownId : number | undefined; 
    FloorId : number | undefined;
    ApartmentId : number | undefined;
    ResidentId : number | undefined; 
    ResidentName : number | undefined;
    Phone : string | undefined;
    Email : string | undefined;
    CardId : string | undefined;
    DateId : Date | undefined;
    AddressId: string | undefined;
    Code : string | undefined;
    DateTransport: Date | undefined;
    Type : number | undefined;
    Vehicle : string | undefined;
    LicensePlates: string | undefined;
    Note : string | undefined;
    IsConfirm : boolean | undefined;
    OrderStatus : number | undefined;
    DateTransportRead : Date | undefined;
    PriceDebit : number | undefined;
    PaymentStatus : number | undefined;
    NoteConfirm : string | undefined;
    listOrderProducts : Array<ListOrderProducts> | undefined;
    listOrderNotes : Array<ListOrderNotes>;
    listAttactmentCds: Array<ListAttactmentCds> | undefined;
    listAttactmentBqls : Array<ListAttactmentBqls>;

}

export class ListOrderProducts {
    Id : string ;
    CreatedAt : Date ;
    CreatedById : number;
    CreatedBy : string;
    UpdatedBy : string;
    UpdateAt : Date;
    UpdatedById : number ;
    Status: number;
    CompanyId : number;
    OrderTransportId : Array<{ Timestamp : number}> | undefined;
    Name : string;
    Quatity: number;
    Note: string;
    listAttactments : Array<ListAttactments>
}
export class ListOrderNotes {
    Id : string ;
    CreatedAt : Date ;
    CreatedById : number;
    UpdateAt : Date;
    UpdatedById : number ;
    Status: number;
    CompanyId : number;
    TargetId : string;
    TargetType : number;
    StatusProcessId: number;
    Note: string;

}
export class ListAttactmentCds {
    Id : string | undefined;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    CompanyId: number | undefined;
    Name: string | undefined;
    TargetId: string | undefined;
    TargetType: number | undefined;
    Thumb : string | undefined;
    Note : string | undefined;
    Url : string | undefined;   
}
export class ListAttactmentBqls {
    Id : string | undefined;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    CompanyId: number | undefined;
    Name: string | undefined;
    TargetId: string | undefined;
    TargetType: number | undefined;
    Thumb : string | undefined;
    Note : string | undefined;
    Url : string | undefined;   
}
export class ListAttactments {
    Id : string | undefined;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    CompanyId: number | undefined;
    Name: string | undefined;
    TargetId: string | undefined;
    TargetType: number | undefined;
    Thumb : string | undefined;
    Note : string | undefined;
    Url : string | undefined;   
}