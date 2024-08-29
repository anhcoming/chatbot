export class UserRole {
    public Id	: number
    public Status	: number
    public CreatedAt	: string
    public UpdatedAt	: string
    public CompanyId	: number
    public CreatedById	: string
    public UpdatedById	: number
    public CreatedBy	: string
    public UpdatedBy	: string
    public UserMapId	: number
    public FullName	: string
    public UserName	: string
    public Password	: string
    public Email	: string
    public Code	: string
    public Avata	: string
    public branchId	: string
    public PositionId	: string
    public DepartmentId	: string
    public Type	: number
    public Address	: string
    public Phone	: string
    public CardId	: string
    public KeyLock	: string
    public TypeThird	: number
    public LastLoginAt	: string
    public RegEmail	: string
    public RoleMax	: number
    public RoleLevel	: number
    public IsRoleGroup	: string
    public IsPhoneConfirm	: string
    public IsEmailConfirm	: string
    public IsAppartment	: string
    public RegisterCode	: string
    public CountLogin	: number
    public LanguageId	: number
    public Birthday	: string
    public Nullable: true
    public UserId	: number
    public UserCreateId	: number
    listRole: Array<DbRole>
    listFunction: Array<DbFunction>
}

export class DbFunction {
    FunctionRoleId: number;
    TargetId: number;
    FunctionId: number;
    Status: string;
    ActiveKey: string;
}
export class DbRole {
    RoleId: number;
    RoleName: string;
}
