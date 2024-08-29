export class Banner {
    public Id : number;
    public Status : number | undefined;
    public CompanyId: number | undefined;    
    public CreatedById: number | undefined;    
    public UpdatedById: number | undefined;    
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public Title : string | undefined;
    public URL : string | undefined;
    public Description: string | undefined;
    public Contents: string | undefined;
    listProjectMaps : Array<ListProjectMaps>;
    listTowerMaps : Array<ListTowerMaps>;
    listZoneMaps: Array<ListZoneMaps>;

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