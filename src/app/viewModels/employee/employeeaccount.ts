export class EmployeeAccount {
    public Id: number | undefined;
    public CreatedById: number | undefined; 
    public CompanyId: number | undefined;
    public Password : string | undefined;
    public UserName: string | undefined;
    public Type : number | undefined;
    listProjectMaps : Array<ListProjectMaps>;
    listTowerMaps : Array<ListTowerMaps>;
    listZoneMaps: Array<ListZoneMaps>;
    public PositionId: number | undefined;
    public DepartmentId: number | undefined;
    listRoles: Array<DbRole>
}
export class DbRole {
    RoleId: number;
    RoleName: number;
}
export class ListProjectMaps{
    Id : number;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    CompanyId: number | undefined;
    ProjectId : number;
    TargetId : number | undefined;
    TargetType : number | undefined;
    UpdatedBy: string | undefined;
    CreatedBy : string | undefined;
} 
export class ListTowerMaps{
    Id : number;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    CompanyId: number | undefined;
    ProjectId : number;
    TowerId : number;
    TargetId : number | undefined;
    TargetType : number | undefined;
    UpdatedBy: string | undefined;
    CreatedBy : string | undefined;
} 

export class ListZoneMaps{
    Id : number;
    CreatedAt : Date | undefined;
    Status : number | undefined;
    UpdatedAt : Date | undefined;
    CreatedById : number | undefined;
    UpdatedById : number | undefined;
    CompanyId: number | undefined;
    ProjectId : number;
    TowerId : number;
    ZoneId : number;
    TargetId : number | undefined;
    TargetType : number | undefined;
    UpdatedBy: string | undefined;
    CreatedBy : string | undefined;
} 