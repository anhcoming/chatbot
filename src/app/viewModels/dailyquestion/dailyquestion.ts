export class DailyQuestion {
    public Id : number | undefined;
    public Status : number | undefined;
    public Type : number | undefined;
    public CompanyId: number | undefined;    
    public CreatedById: number | undefined;    
    public UpdatedById: number | undefined;    
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public Title : string | undefined;
    public Contents: string | undefined;
    public listAttactments : Array<ListAttactments>;
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