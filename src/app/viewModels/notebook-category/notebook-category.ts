export class NoteBookCategory {
    Id : number ;
    Status: number | undefined;
    Name : string | undefined;
    Note : string | undefined;
    Location : number | undefined;
    listProjectMaps : Array<ListProjectMaps>;
    listTowerMaps : Array<ListTowerMaps>;
    listZoneMaps: Array<ListZoneMaps>;
    UserId: number | undefined;
    StartDate : Date | undefined;
    Url : string | undefined;
    Image : string | undefined;
    Contents: string | undefined;
    EndDate: Date | undefined;
    CategoryParentId: number | undefined;
    CreatedAt: Date | undefined;
    UpdatedAt: Date | undefined;
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