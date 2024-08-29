export class Company {
    public Id: number;
    public Status: number;
    public CreatedById:	number;
    public UpdatedById:	number;
    public CreatedBy:	string;
    public UpdatedBy:	string;
    public CompanyId:	number;
    public Code:	string;
    public Name:	string; 
    public Logo:	string; 
    public TaxCode:	string; 
    public Phone:	string; 
    public Email:	string; 
    public CountryId:	number; 
    public ProvinceId:	number; 
    public Address:	string; 
    public Website:	string; 
    public ContactName:	string; 
    public ContactSex:	number; 
    public ContactBrithday:	string;
    public ContactPhone:	string; 
    public ContactEmail:	string; 
    public ContactIdNo	:string; 
    public ContactIdAdress:	string; 
    public ContactIdDate:	string ; 
    public ServicePricingId:	number; 
    public AppartmentNo: 	number; 
    public RegistrationNumber:	string; 
    public RegistrationDate:	string ; 
    public RegistrationStart:	string ; 
    public RegistrationEnd:	string ; 
    public UserName:	string; 
    public Password:	string ;
    public IsCustom: string;
    listFunction: Array<DbFunction>;
    listAttactments: Array<ListAttactments>
}
export class ListAttactments{
    public Id : number | undefined;
    public Status : number | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public CompanyId: number | undefined;
    public Name: string | undefined;
    public TargetId : number | undefined;
    public TargetType: number | undefined;
    public Url: string | undefined;
    public Thumb : string | undefined;
    public Note: string | undefined;
}
export class DbFunction {
    Id: string;
    TargetId: number;
    FunctionId: number;
    ActiveKey: String;
    Status: string;
}