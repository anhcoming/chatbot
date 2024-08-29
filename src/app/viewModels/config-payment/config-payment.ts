export class ConfigPayment {
    public RoleId : number;
    public UserId : number;
    public Code: string ;
    public Name: string ;
    public Note: string ;
    public LevelRole: number ;
    public Status: string ;
    public CreatedByName: string ;
    public UpdatedByName: string ;
    public CreatedAt: Date;
    public UpdatedAt: Date ;

    listTowerMaps: Array<listTower>
}
export class listTower {
    Id: string;
    Status: number;
    CreatedAt: string;
    UpdatedAt: string;
    CompanyId: number;
    CreatedById: number;
    UpdatedById: number;
    CreatedBy: string;
    UpdatedBy: string;
    ProjectId: number;
    TowerId: number;
    TargetId: string;
    TargetType: number
}
