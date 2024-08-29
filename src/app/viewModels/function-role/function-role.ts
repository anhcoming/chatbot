export class FunctionRole {
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

    listFunction: Array<DbFunctionRole>
}
export class DbFunctionRole {
    FunctionRoleId: number;
    TargetId: number;
    FunctionId: number;
    ActiveKey: string;
}
