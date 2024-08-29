export class Resident {
    public Id: number | undefined;
    public CompanyId: number | undefined;
    public FullName: string | undefined;
    public Note: string | undefined;
    public ProjectId: number | undefined;    
    public ApartmentId: number | undefined;
    public TowerId: number | undefined;
    public FloorId: number | undefined;
    public Type: number | undefined;    
    public Status: number | undefined;    
    public UserId: number | undefined;    
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public UpdatedBy: string | undefined;
    public CreateBy: string | undefined;
    public UsableArea: number | undefined;
    public NumberFloor: number | undefined;
    public Birthday: Date | undefined;
    public AddressId : number | undefined;
    public Passport : number | undefined;
    public Phone: string | undefined;
    public countryId: number | undefined;
    public DateId: Date | undefined;
    public Email : string | undefined;
    public sex: number | undefined;
    public DateRent: Date | undefined;
    public Address: string | undefined;
    public typeCardId: number | undefined;
    public type: number | undefined;
    public rowSpan: number | undefined;
    user:  Array<user>;
    listApartmentMaps: Array<DbApartment>
    listAttactments: Array<ListAttactments>
}
export class DbApartment {
    ProjectId:  number;
    TowerId: number;
    RoleApartId: number;
    FloorId: number;
    ApartmentId: number;
    Id:  string;
    DateStart: Date;
    DateEnd: Date;
    Type: number;
    RelationshipId: Date;
    Status: number;
    ResidentStatus: number;
    DateRent: Date;
    RegistrationNo: string;
    RegistrationStart: Date;
    RegistrationEnd: Date;
    statusOptionName: string;
    stayingName: string;
    roleName: string;
}
export class ListAttactments{
    public Id : number | undefined;
    public Status : number | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public CompanyId: number | undefined;
    public Name: string | undefined;
    public TargetId : number | undefined;
    public TargetType: number | undefined;
    public Url: string | undefined;
    public Thumb : string | undefined;
    public Note: string | undefined;
}
export class user{
    Address: string;
    Avata: string;
    Code: string;
    Email: string;
    FullName: string;
    Phone: string;
    Status: number;
    UserId: number;
}