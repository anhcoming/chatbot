export class Department {
    public Id: number | undefined;
    public Name: string | undefined;
    public Code: string | undefined;
    public Note: string | undefined;
    public Phone: number | undefined;    
    public Email: number | undefined;    
    public DepartmentMap: string | undefined;    
    public DepartmantId: number | undefined;    
    public listProjectMap:  Array<ListProjectMaps>; 
    public listTowerMaps : Array<ListTowerMaps>; 
    public listZoneMaps: Array<ListZoneMaps>; 
    public Type: number | undefined;    
    public Status: number | undefined;    
    public TypeName: String | undefined;    
    public UserId: number | undefined;    
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


