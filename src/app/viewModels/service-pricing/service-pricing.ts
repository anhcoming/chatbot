export class ServicePricing {
    public Id: number;
    public Status: number;
    public CreatedAt: string;
    public UpdatedAt: string;
    public CreatedById: string;
    public UpdatedById: string;
    public CreatedBy: string;
    public UpdatedBy: string;
    public CompanyId: number;
    public ServicePricingId: number;
    public Code: string;
    public Name: string
    listFunction: Array<DbFunction>
}
export class DbFunction {
    Id: number;
    TargetId: number;
    FunctionId: number;
    ActiveKey: string;
    Status: number;
}