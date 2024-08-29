
export class OrderConstruction{
    Id : string;
    CreatedAt : Date | undefined;
    CreatedById : number;
    CreatedBy : string;
    UpdatedAt : Date;
    UpdatedById : number;
    UpdatedBy : string;
    Status : number;
    CompanyId : number;
    ProjectId : number;
    TownId : number;
    FloorId : number;
    ApartmentId : number;
    ResidentId : number;
    ResidentName : string;
    PaymentStatus : number;
    Phone : string;
    RegisterId : number ;
    RegisterName : string ;
    RegisterPhone : string;
    AuthorityName : string;
    AuthorityPhone : string;
    AuthorityCard : string;
    AuthorityStart : Date;
    AuthorityEnd : Date;
    Code : string;
    DateStart : Date;
    DateEnd : Date;
    Contents : string;
    Note : string;
    IsConfirm : boolean;
    OrderStatus : number ;
    UserConfirm : number;
    ConstructionStatus : number;
    DatePause : Date;
    DateContinue : Date;
    NoteConfirm : string;
    IsDeposit : Date;
    PriceDeposit : number;
    UserSecurity : number;
    NoteSecurity : string;
    listOrderUnits : Array<ListOrderUnits>;
    listOrderDocuments : Array<listOrderDocuments>;
    listOrderAttactments : Array<ListOrderAttactments>;
    listOrderPlans : Array<ListOrderPlans>;

}

export class ListOrderUnits {
    Id: string;
    CompanyId: number;
    CreatedById : number;
    UpdatedById : number;
    Status: number;
    TargetId: string;
    TargetType : number;
    UnitName : string;
    ContactName : string;
    ContactPhone : string;
}

export class listOrderDocuments {
    Id : string | undefined;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    Type : number | undefined;
    CompanyId: number | undefined;
    Name: string | undefined;
    Quatity: number | undefined;
    StatusProcess : number | undefined;
    TargetId: string | undefined;
    ViewNumber: number | undefined;
    TargetType: number | undefined;
    Thumb : string | undefined;
    Note : string | undefined;
    listAttactments : Array<ListAttactments> | undefined;
}

export class ListOrderPlans {
    Id : string | undefined;
    CreatedAt : Date | undefined;
    CreatedById : number | undefined;
    CreatedBy : string | undefined;
    UpdatedAt: Date | undefined;
    Status : number | undefined;
    CompanyId : number | undefined;
    TargetId : string | undefined;
    TargetType : number | undefined;
    UnitName : string | undefined;
    ContactName : string | undefined;
    ContactPhone : string | undefined;
    Name : string | undefined;
    DateStart : Date | undefined;
    DateEnd : Date | undefined; 
    StatusProcess : number | undefined;
    Note : string | undefined;
}

export class ListOrderAttactments {
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