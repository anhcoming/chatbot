
export class Posts{
    Id : number ;
    UserId: number | undefined;
    listProjectMaps : Array<ListProjectMaps>;
    listTowerMaps : Array<ListTowerMaps>;
    listZoneMaps: Array<ListZoneMaps>;
    Title : string | undefined;
    CreatedBy: string | undefined;
    Url : string | undefined;
    UpdatedBy: string | undefined;
    Description: string | undefined;
    Image : string | undefined;
    Type: number | undefined;
    Contents: string | undefined;
    Ishot : boolean | undefined;
    TypeNotebook: number | undefined;
    CreatedAt: Date | undefined;
    UpdatedAt: Date | undefined;
    Status: number | undefined;
    Location: number | undefined;
    categoryMappings: Array<{Id: number; Name: string; Selected: boolean;}> | undefined;
	listAttactments: Array<ListAttactments> | undefined;
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