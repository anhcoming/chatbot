

export class Employee {
    public id: number | undefined;
    public Status: string | undefined;
    public CreatedById: number | undefined; 
    public UpdatedById: number | undefined;
    public CompanyId: number | undefined;
    public FullName: string | undefined;
    public Code: string | undefined;
    IsAccount : boolean;
    public PositionId: number | undefined;
    public DepartmentId: number | undefined;
    public Birthday: Date | undefined;
    public Phone: Number | undefined;
    public Email: string | undefined;
    public Address: string | undefined;
    public Note: string | undefined;
    public typeEmployee: number | undefined; 
    public isMain: boolean | undefined;
    public CardId: number | undefined;
    public StartDate: Date | undefined;
    public EndDate: Date | undefined;
    public DateCardId : Date | undefined;
    public DistrictId: Date | undefined;
    public Male: string | undefined;
    public Femaile : string | undefined;
    public Sex : string | undefined;
    listAttactments: Array<ListAttactments> | undefined;
    listRoles: Array<DbRole>
}
export class DbRole {
    RoleId: number;
    RoleName: string;
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
    ViewNumber: number | undefined;
    TargetType: number | undefined;
    Thumb : string | undefined;
    Note : string | undefined;
    Url : string | undefined;
    DateStartActive: Date | undefined;
    Location: number | undefined;
}
