export class Role {
    public Id: number | undefined;
    public RoleId: number | undefined;
    public Name: string | undefined;
    public Code: string | undefined;
    public Status: number | undefined;
    public Note: string | undefined;
    public NameRole: string | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public UpdatedBy: string | undefined;
    UserId: number | undefined;
    UserEditId: number | undefined;
    public LevelRole: number | undefined;
    public ListFunction : object | undefined;
}
export class DbFunctionRole {
    FunctionRoleId: number | undefined;
    TargetId: number | undefined;
    FunctionId: number | undefined;
    ActiveKey: string | undefined;
    Status: number | undefined;
}