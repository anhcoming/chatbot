import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
export const docmainImage = apiUrl.concat('uploads/images/');
export const docmainQrCode = apiUrl.concat('uploads/qrcode/');
export class ApiConstant {
  public static PasswordDefault = 'Cntt@2024';

  //#region Restful url
  public static RestfulDepartment = apiUrl.concat('api/Department/');
  public static RestfulModels = apiUrl.concat('api/Model/');
  public static RestfulOrganization = apiUrl.concat('api/Organization/');
  public static RestfulTopicFile = apiUrl.concat('api/TopicFile/');
  public static RestfulEmployeeUnit = apiUrl.concat('api/Employee/');
  public static RestfulGroupTopic = apiUrl.concat('api/GroupTopic/');
  public static RestfulGroupAddTopic = apiUrl.concat('api/GroupTopic');

  public static RestfulDemo = apiUrl.concat('api/demo/');
  public static RestfulChatSession = apiUrl.concat('api/chatSession/');







  //#endRegion

  //#region Models

  //#endRegion


  //#region organization

  //#endregion

  //#region topicFile
  public static UploadTopicFiles = apiUrl.concat('api/TopicFile/upload');
  public static DeleteTopicFiles = apiUrl.concat('api/TopicFile/delete');

  //#endregion

  //#region topic
  public static GetTopicByPaging = apiUrl.concat('api/topic/Getlist');
  public static CreateNewTopic = apiUrl.concat('api/topic/create');
  public static RestfulTopicById = apiUrl.concat('api/topic/');


  //#endregion


  //#region "auth"
  public static Login = apiUrl.concat('api/User/login');
  public static LockAccount = apiUrl.concat('api/cms/User/lockUser/');
  public static ChangePassword = apiUrl.concat('api/cms/User/adminChangePassMap/');
  public static newPassword = apiUrl.concat('api/cms/User/ChangePass/');
//   public static getUserId = apiUrl.concat('api/cms/User/infoUser/');
  public static changInfoUser = apiUrl.concat('api/cms/User/changeInfoUser');
  public static changePassUser = apiUrl.concat('api/User/ChangePassUser/');
  public static AccountInfo = apiUrl.concat('api/user/getInfo/')
  public static changInfoUserv2 = apiUrl.concat('api/User/changeInfoUser/')
  public static ChangeUserPassword = apiUrl.concat('api/User/changePassUser/')
  public static GetUserInfo = apiUrl.concat('api/user/getInfo/');
  public static updateUserInfo = apiUrl.concat('api/user/updateUserInfo/');

  //#image

  //#endregion

  //#region "Chatbot"

  public static GetSessionList = apiUrl.concat('api/ChatBot/usersessions/');
  public static GetChatSession = apiUrl.concat('api/ChatBot/chatsession/');
  public static CreateChatSession = apiUrl.concat('api/ChatBot/chatsession');
  public static CreateQuestionChatBot = apiUrl.concat('api/ChatBot/question');
  public static UpdateQuestionChatBot = apiUrl.concat('api/ChatBot/question/');
  //#endregion

  //#region "project"
  public static GetProjectByPaging = apiUrl.concat('api/cms/project/getByPage');
  public static CreateProject = apiUrl.concat('api/cms/project');
  public static UpdateProjectById = apiUrl.concat('api/cms/project/');
  public static DeleteProjectById = apiUrl.concat('api/cms/project/');
  public static DeletesProject = apiUrl.concat('api/cms/Project/deletes/');
  public static GetProjectById = apiUrl.concat('api/cms/project/');
  public static ExportExcelProject = apiUrl.concat('api/cms/project/exportExcelProjects/');


  //#region "tower"
  public static CreateTower = apiUrl.concat('api/cms/tower');
  public static UpdateTowerById = apiUrl.concat('api/cms/tower/');
  public static DeleteTowerById = apiUrl.concat('api/cms/tower/');
  public static DeletesTower = apiUrl.concat('api/cms/tower/Deletes/');
  public static GetTowerByPaging = apiUrl.concat('api/cms/tower/getByPage');
  public static GetTowerById = apiUrl.concat('api/cms/tower/');

  //#region "floor"
  public static CreateFloor = apiUrl.concat('api/cms/floor');
  public static UpdateFloorById = apiUrl.concat('api/cms/floor/');
  public static DeleteFloorById = apiUrl.concat('api/cms/floor/');
  public static DeletesFloor = apiUrl.concat('api/cms/floor/deletes/');
  public static GetFloorByPaging = apiUrl.concat('api/cms/floor/getByPage');
  public static GetFloorById = apiUrl.concat('api/cms/floor/');

  //#region "zone"
  public static CreateZone = apiUrl.concat('api/cms/zone');
  public static UpdateZoneById = apiUrl.concat('api/cms/zone/');
  public static GetZoneByPaging = apiUrl.concat('api/cms/zone/getByPage');
  public static GetZoneById = apiUrl.concat('api/cms/zone/');

  public static DeleteZoneById = apiUrl.concat('api/cms/zone/')
  public static DeleteListZone = apiUrl.concat('api/cms/Zone/deletes/')
    //#region "contract-type"
    public static CreateContractType = apiUrl.concat('api/cms/fake');
    public static UpdateContractTypeById = apiUrl.concat('api/cms/fake/');
    public static GetContractTypeByPaging = apiUrl.concat('api/cms/fake/getByPage');
    public static GetContractTypeById = apiUrl.concat('api/cms/fake/');

    public static DeleteContractTypeById = apiUrl.concat('api/cms/fake/')
     //#region "contract-group"
     public static CreateContractGroup = apiUrl.concat('api/cms/fake');
     public static UpdateContractGroupById = apiUrl.concat('api/cms/fake/');
     public static GetContractGroupByPaging = apiUrl.concat('api/cms/fake/getByPage');
     public static GetContractGroupById = apiUrl.concat('api/cms/fake/');

     public static DeleteContractGroupById = apiUrl.concat('api/cms/fake/')
  //#region "notebook ~~ news"
  public static CreateNotebook = apiUrl.concat('api/cms/news');
  public static UpdateNotebookById = apiUrl.concat('api/cms/news/');
  public static GetNotebookByPaging = apiUrl.concat('api/cms/news/getByPage');
  public static GetNotebookById = apiUrl.concat('api/cms/news/');
  public static DeleteLstNotebook = apiUrl.concat('api/cms/news/deletes/');

  public static DeleteNotebookById = apiUrl.concat('api/cms/news/')
    //#region "question"
    public static CreateQuestion = apiUrl.concat('api/cms/news');
    public static UpdateQuestionById = apiUrl.concat('api/cms/news/');
    public static GetQuestionByPaging = apiUrl.concat('api/cms/news/getByPage');
    public static GetQuestionById = apiUrl.concat('api/cms/news/');
    public static DeleteQuestionById = apiUrl.concat('api/cms/news/');
    public static DeleteLstQuestion = apiUrl.concat('api/cms/news/deletes/');
     //#region "news"
     public static CreateNews = apiUrl.concat('api/cms/news');
     public static UpdateNewsById = apiUrl.concat('api/cms/news/');
     public static GetNewsByPaging = apiUrl.concat('api/cms/news/getByPage');
     public static GetNewsById = apiUrl.concat('api/cms/news/');
     public static DeleteLstNews = apiUrl.concat('api/cms/news/deletes/');
    public static DeleteNewsById = apiUrl.concat('api/cms/news/')
       //#region "news"
       public static CreatePosts = apiUrl.concat('api/cms/news');
       public static UpdatePostsById = apiUrl.concat('api/cms/news/');
       public static GetPostsByPaging = apiUrl.concat('api/cms/news/getByPage');
       public static GetPostsById = apiUrl.concat('api/cms/news/');
       public static DeleteLstPosts = apiUrl.concat('api/cms/news/deletes/');
      public static DeletePostsById = apiUrl.concat('api/cms/news/')
        //#region "news"
        public static CreateNotification = apiUrl.concat('api/cms/news');
        public static UpdateNotificationById = apiUrl.concat('api/cms/news/');
        public static GetNotificationByPaging = apiUrl.concat('api/cms/news/getByPage');
        public static GetNotificationById = apiUrl.concat('api/cms/news/');
        public static DeleteLstNotification = apiUrl.concat('api/cms/news/deletes/');
       public static DeleteNotificationById = apiUrl.concat('api/cms/news/')

   //#region "notebook-category"
   public static CreateNotebookCategory = apiUrl.concat('api/cms/category');
   public static UpdateNotebookCategoryById = apiUrl.concat('api/cms/category/');
   public static GetNotebookCategoryByPaging = apiUrl.concat('api/cms/category/getByPage');
   public static GetNotebookCategoryById = apiUrl.concat('api/cms/category/');
   public static DeleteListNotebookCategory = apiUrl.concat('api/cms/category/deletes');

   public static DeleteNotebookCategoryById = apiUrl.concat('api/cms/category/')
   //#region "banner"
   public static CreateBanner = apiUrl.concat('api/cms/banner');
   public static UpdateBannerById = apiUrl.concat('api/cms/banner/');
   public static GetBannerByPaging = apiUrl.concat('api/cms/banner/getByPage');
   public static GetBannerById = apiUrl.concat('api/cms/banner/');
   public static DeleteBannerById = apiUrl.concat('api/cms/banner/')
   public static DeleteListBanner = apiUrl.concat('api/cms/banner/deletes/')
   //#region "hotline"
  public static CreateHotline = apiUrl.concat('api/cms/hotline');
  public static UpdateHotlineById = apiUrl.concat('api/cms/hotline/');
  public static GetHotlineByPaging = apiUrl.concat('api/cms/hotline/getByPage');
  public static GetHotlineById = apiUrl.concat('api/cms/hotline/');
  public static DeleteHotlineById = apiUrl.concat('api/cms/hotline/')
  public static DeleteListHotline = apiUrl.concat('api/cms/hotline/deletes/')


  //#region "Function"
  public static CreateFunction = apiUrl.concat('api/function');
  public static getlstFunction = apiUrl.concat('api/function/getFunctionTreeModel');
  public static getlstFunctionRole = apiUrl.concat('api/cms/function/listFunctionRole');
  public static UpdateFunctionById = apiUrl.concat('api/function/');
  public static DeleteFunctionById = apiUrl.concat('api/function/');
//   public static GetFunctionByPaging = apiUrl.concat('api/cms/function/getByPage');
  public static GetFunctionByPaging = apiUrl.concat('api/function/GetByPage');
  public static GetFunctionById = apiUrl.concat('api/function/');
  public static GetFunctionPerantByPaging = apiUrl.concat('api/function/getFunctionTreeModel');

  //#region "Function"
  public static CreateCompany = apiUrl.concat('api/cms/Company');
  public static ApiCompanyById = apiUrl.concat('api/cms/Company/');
  public static DeletesCompany = apiUrl.concat('api/cms/Company/Deletes/');
  public static GetCompanyByPaging = apiUrl.concat('api/cms/Company/getByPage');
   //#region "upload"
   public static CreateImage = apiUrl.concat('api/upload/uploadimage');
   public static CreateMultipleFile= apiUrl.concat('api/upload/uploadmultifile');
   public static CreateImageandVideo = apiUrl.concat('api/upload/uploadimgandvideo');

  //#region "FunctionRole"
  public static RestfulFunctionRole = apiUrl.concat('api/Role/');

  public static CreateFunctionRole = apiUrl.concat('api/Role');
  public static UpdateFunctionRoleById = apiUrl.concat('api/Role/');
  public static DeleteFunctionRoleById = apiUrl.concat('api/Role/');
  public static GetFunctionRoleByPaging = apiUrl.concat('api/Role/GetByPage');
  public static GetFunctionRoleById = apiUrl.concat('api/Role/');
  //#region "UserRole"
  public static CreateUserRole = apiUrl.concat('api/User');
  public static ApiUserRoleById = apiUrl.concat('api/User/');
  public static GetUserRoleByPaging = apiUrl.concat('api/User/GetList');
  public static GetNotRoleByPaging = apiUrl.concat('api/cms/UserRole/GetByPageNotRole');
  public static GetUserRoleByCode = apiUrl.concat('api/cms/UserRole/GetUserRoleByFunctionCode/');
  //#region "Service Pricing"
  public static CreateServicePricing = apiUrl.concat('api/cms/ServicePricing');
  public static ApiById = apiUrl.concat('api/cms/ServicePricing/');
  public static GetServicePricingByPaging = apiUrl.concat('api/cms/ServicePricing/getByPage');

  //#region "Role"
  public static CreateRoleById = apiUrl.concat('api/cms/role');

  // public static UpdateRoleById = apiUrl.concat('api/cms/role/');
  public static UpdateRoleById = apiUrl.concat('api/cms/role');
  public static GetRoleByPaging = apiUrl.concat('api/cms/role/getByPage');

  public static GetRole = apiUrl.concat('api/cms/Role?id=');

  public static GetFunctionRole = apiUrl.concat('api/cms/function/listFunctionRole');

  public static DeleteRoleById = apiUrl.concat('api/cms/role/');

  //#region "department"
  public static CreateDepartment = apiUrl.concat('api/cms/Department');
  public static UpdateDepartmentById = apiUrl.concat('api/cms/Department/');
  public static DeleteDepartmentById = apiUrl.concat('api/cms/Department/');
  public static GetDepartmentByPaging = apiUrl.concat('api/cms/Department/GetByPage');
  public static GetDepartmentById = apiUrl.concat('api/cms/Department/');

  //#region "department-map"
  public static CreateDepartmentMap = apiUrl.concat('api/cms/departmentmap');
  public static UpdateDepartmentMapById = apiUrl.concat('api/cms/departmentmap/');
  public static GetDepartmentMapByPaging = apiUrl.concat('api/cms/departmentmap/getByPage');
  public static GetDepartmentMapById = apiUrl.concat('api/cms/departmentmap/');

  //#region "positions"
  public static CreatePosition = apiUrl.concat('api/cms/position');
  public static UpdatePositionById = apiUrl.concat('api/cms/position/');
  public static GetPositionByPaging = apiUrl.concat('api/cms/position/getByPage');
  public static GetPositionMapById = apiUrl.concat('api/cms/position/');
  public static DeleTePosition = apiUrl.concat('api/cms/position/');



  //#region "address"
  public static CreateAddressByUserCode = apiUrl.concat('api/cms/floor');
  public static UpdateAddressByUserCode = apiUrl.concat('api/cms/floor/');
  public static GetAddressByPaging = apiUrl.concat('api/cms/tower/getByPage'); // test province

  //#region "floor"
  public static CreatePositionByUserCode = apiUrl.concat('api/cms/floor');
  public static UpdatePositionByUserCode = apiUrl.concat('api/cms/floor/');
  public static GetPositionById = apiUrl.concat('api/cms/province/');
  //#region "apartment"
  public static CreateApartmentByPaging = apiUrl.concat('api/cms/apartment/getByPage');
  public static UpdateApartmentById = apiUrl.concat('api/cms/apartment/');
  public static GetApartmentById = apiUrl.concat('api/cms/apartment/');
  public static DeleteApartmentById = apiUrl.concat('api/cms/apartment/');
  public static DeletesApartment = apiUrl.concat('api/cms/apartment/deletes/');
  public static CreateApartment = apiUrl.concat('api/cms/apartment');
  //#region "customer"
  public static CreateAccountCustomer = apiUrl.concat('api/cms/Customer/createAccount/');
  public static CreateCustomer = apiUrl.concat('api/cms/Customer');
  public static UpdateCustomerById = apiUrl.concat('api/cms/Customer/');
  public static GetCustomerByPaging = apiUrl.concat('api/cms/Customer/GetByPage');
  public static GetCustomerById = apiUrl.concat('api/cms/Customer/');
  public static DeleteCustomerById = apiUrl.concat('api/cms/Customer/');
  //#region "resident"
  public static CreateAccountResident = apiUrl.concat('api/cms/Resident/createAccount/');
  public static CreateResident = apiUrl.concat('api/cms/Resident');
  public static UpdateResidentById = apiUrl.concat('api/cms/Resident/');
  public static GetResidentByPaging = apiUrl.concat('api/cms/Resident/GetByPage');
  public static GetResidentById = apiUrl.concat('api/cms/Resident/');
  public static DeleteResidentById = apiUrl.concat('api/cms/Resident/');
  public static DeletesResident = apiUrl.concat('api/cms/Resident/deletes/');
  public static AccessResident = apiUrl.concat('api/cms/Resident/accessAccount/');
  public static RegisterApartment = apiUrl.concat('api/cms/resident/GetRegisterApartment/');
  public static RegisterApartmentCard = apiUrl.concat('api/cms/resident/GetRegisterApartmentCard/');
  public static GetResidentCard = apiUrl.concat('api/CardManager/GetCardActiveByResidentId');
  //#endregion

  //#region "Type Attribute"
  public static GetTypeAttributeByPaging = apiUrl.concat('api/cms/TypeAttribute/GetByPage');
  public static ApiTypeAttributeById = apiUrl.concat('api/cms/TypeAttribute/');
  public static CreateTypeAttribute = apiUrl.concat('api/cms/TypeAttribute');
  public static DeleteTypeAttributeById = apiUrl.concat('api/cms/TypeAttribute/');
   //#region "Type AttributeItem"
   public static GetTypeAttributeItemByPaging = apiUrl.concat('api/cms/TypeAttributeItem/GetByPage');
   public static ApiTypeAttributeItemById = apiUrl.concat('api/cms/TypeAttributeItem/');
   public static CreateTypeAttributeItem = apiUrl.concat('api/cms/TypeAttributeItem');
   public static DeleteTypeAttributeItemById = apiUrl.concat('api/cms/TypeAttributeItem/');
   public static UpdateTypeAttributeItemById = apiUrl.concat('api/cms/TypeAttributeItem/');
  //#region
  //#region "Countries"
  public static GetCountryByPaging = apiUrl.concat('api/cms/Country/GetByPage');
  public static ApiCountryById = apiUrl.concat('api/cms/Country/');
  public static CreateCountry = apiUrl.concat('api/cms/Country');
  public static DeleteCountryById = apiUrl.concat('api/cms/Country/');
  public static DeleteListCountries = apiUrl.concat('api/cms/Country/deletes/');
 //#endregion "employee"
  public static GetEmployeeByPaging = apiUrl.concat('api/cms/employee/getByPage');
  public static CreateEmploy = apiUrl.concat('api/cms/employee');
  public static CreateAccountEmployee = apiUrl.concat('api/cms/Employee/createAccount/');
  public static ApiEmployeeById = apiUrl.concat('api/cms/employee/');
  public static ApiEmployeeManageById = apiUrl.concat('api/employee/');
  public static ApiCreateEmployee = apiUrl.concat('api/employee/createUser');

  //#endregion "document"
  public static GetDocumentByPaging = apiUrl.concat('api/cms/document/getByPage');
  public static GetDocumentById = apiUrl.concat('api/cms/document/')
  public static CreateDocument = apiUrl.concat('api/cms/document')
  public static UpdateDocumentById = apiUrl.concat('api/cms/document/')
  public static DeleteDocumentById = apiUrl.concat('api/cms/document/')


  //#region "province"
  public static GetProvinceByPaging = apiUrl.concat('api/cms/Province/GetByPage');
  public static ApiProvinceById = apiUrl.concat('api/cms/Province/');
  // public static CreateProvince = apiUrl.concat('api/cms/Province');
  public static CreateProvince = apiUrl.concat('/api/Province/Create');
  public static DeleteProvinceById = apiUrl.concat('api/cms/Province/');
  public static DeleteListProvinces = apiUrl.concat('api/cms/Province/deletes/');
  //#region

  //#region "district"
  public static GetDistrictByPaging = apiUrl.concat('api/cms/District/GetByPage');
  public static ApiDistrictById = apiUrl.concat('api/cms/District/');
  public static CreateDistrict = apiUrl.concat('api/cms/District');
  public static DeleteDistrictById = apiUrl.concat('api/cms/District/');
  public static DeleteListDistricts = apiUrl.concat('api/cms/District/deletes/');
  //#region

  //#region "ward"
  public static GetWardByPaging = apiUrl.concat('api/cms/Wards/GetByPage');
  public static ApiWardById = apiUrl.concat('api/cms/Wards/');
  public static CreateWard = apiUrl.concat('api/cms/Wards');
  public static DeleteWardById = apiUrl.concat('api/cms/Wards/');
  public static DeleteListWard = apiUrl.concat('api/cms/Wards/deletes/');
  //#region invoice
  public static InvoiceSerice = apiUrl.concat('api/cms/InvService/Service/');
  public static InvoiceSericeConfig = apiUrl.concat('api/cms/InvService/ServiceConfig/');
  public static InvoiceSericeGroup = apiUrl.concat('api/cms/InvService/ServiceGroup/');
  public static InvoiceContract = apiUrl.concat('api/cms/InvContract/Contract/');
  public static InvoiceContractService = apiUrl.concat('api/cms/InvContract/ContractService/');

  public static InvoiceContractType = apiUrl.concat('api/cms/InvContract/ContractType/');
  public static InvoiceContractGroup = apiUrl.concat('api/cms/InvContract/ContractGroup/');

  //#region "Service Utilities"
  public static getListServiceUtilities = apiUrl.concat('api/cms/ServiceUtilities/getByPage');

  //#region "type_card"
  public static CreateTypeCard = apiUrl.concat('api/typeCard');
  public static UpdateTypeCardById = apiUrl.concat('api/typeCard/');
  public static DeleteTypeCardById = apiUrl.concat('api/typeCard/');
  public static GetTypeCardByPaging = apiUrl.concat('api/typeCard/getByPage');
  public static GetTypeCardById = apiUrl.concat('api/typeCard/');
  public static GetTypeCardByProjectId = apiUrl.concat('api/typeCard/getListByProjectId');

   //#region "vehicle"
   public static CreateVehicle = apiUrl.concat('api/vehicle');
   public static UpdateVehicleById = apiUrl.concat('api/vehicle/');
   public static DeleteVehicleById = apiUrl.concat('api/vehicle/');
   public static GetVehicleById = apiUrl.concat('api/vehicle/');
   public static GetVehicleActive = apiUrl.concat('api/vehicle/getAll');

    //#region "card"
    public static CreateCard = apiUrl.concat('api/cardManager');
    public static UpdateCardById = apiUrl.concat('api/cardManager/');
    public static DeleteCardById = apiUrl.concat('api/cardManager/');
    public static GetCardById = apiUrl.concat('api/cardManager/');
    public static GetCardByPaging = apiUrl.concat('api/cardManager/getByPage');
    public static CardRegisterApartment = apiUrl.concat('api/CardManager/GetCardActiveByApartmentId');

   //#region "config_card"
  public static CreateConfigCard = apiUrl.concat('api/configCard');
  public static UpdateConfigCardById = apiUrl.concat('api/configCard/');
  public static GetConfigCardById = apiUrl.concat('api/configCard/');
  public static DeleteConfigCardById = apiUrl.concat('api/configCard/');
  public static GetConfigCardByPaging = apiUrl.concat('api/configCard/getByPage');
  public static GetConfigCardByProjectId = apiUrl.concat('api/configCard/getByProjectId');
   //#region "config_card"
   public static CreateConfigCarparking = apiUrl.concat('api/cms/configCar');
   public static ApiConfigCardById = apiUrl.concat('api/cms/configCar/');
   public static GetConfigCarparkingByPaging = apiUrl.concat('api/cms/configCar/getByPage');
    //#region "config_payment"
   //#region "config_payment"
  public static CreateConfigPayment = apiUrl.concat('api/cms/ConfigPayment');
  public static ConfigPaymentById = apiUrl.concat('api/cms/ConfigPayment/');
  public static GetConfigPaymentByPaging = apiUrl.concat('api/cms/ConfigPayment/getByPage');
  public static DeletesConfigPayment = apiUrl.concat('api/cms/ConfigPayment/deletes/');
    //#region "config_payment"
    public static CreateUtilitiesService = apiUrl.concat('api/cms/ServiceUtilities');
    public static UtilitiesServiceById = apiUrl.concat('api/cms/ServiceUtilities/');
    public static GetUtilitiesServiceByPaging = apiUrl.concat('api/cms/ServiceUtilities/getByPage');
    public static DeletesUtilitiesService = apiUrl.concat('api/cms/ServiceUtilities/deletes/');
  //#region "config_Email"
  public static CreateConfigEmail = apiUrl.concat('api/cms/ConfigEmail');
  public static ConfigEmailById = apiUrl.concat('api/cms/ConfigEmail/');
  public static GetConfigEmailByPaging = apiUrl.concat('api/cms/ConfigEmail/getByPage');
  //#region "config_Booking"
  public static CreateConfigBooking = apiUrl.concat('api/cms/ConfigBooking');
  public static ConfigBookingById = apiUrl.concat('api/cms/ConfigBooking/');
  public static GetConfigBookingByPaging = apiUrl.concat('api/cms/ConfigBooking/getByPage');
  public static DeletesConfigBooking = apiUrl.concat('api/cms/ConfigBooking/deletes/');
  public static OrderYardCode = apiUrl.concat('api/cms/OrderYard/getOrderYardCode/');
  //#region "config_App"
  public static CreateConfigApp = apiUrl.concat('api/cms/ConfigApp');
  public static ConfigAppById = apiUrl.concat('api/cms/ConfigApp/');
  public static GetConfigAppByPaging = apiUrl.concat('api/cms/ConfigApp/getByPage');
  public static DeletesConfigApp = apiUrl.concat('api/cms/ConfigApp/deletes/');
  //#region "config_Register"
  public static CreateConfigRegister = apiUrl.concat('api/cms/ConfigRegister');
  public static ConfigRegisterById = apiUrl.concat('api/cms/ConfigRegister/');
  public static GetConfigRegisterByPaging = apiUrl.concat('api/cms/ConfigRegister/getByPage');
  public static DeletesConfigRegister = apiUrl.concat('api/cms/ConfigRegister/deletes/');
  //#region "config_Service"
  public static CreateConfigService = apiUrl.concat('api/cms/ConfigService');
  public static ConfigServiceById = apiUrl.concat('api/cms/ConfigService/');
  public static GetConfigServiceByPaging = apiUrl.concat('api/cms/ConfigService/getByPage');
  public static DeletesConfigService = apiUrl.concat('api/cms/ConfigService/deletes/');

  //#region "CardRequest"
  public static CancelCardRequest = apiUrl.concat('api/CardRequest/cancelCardRequest');
  public static UpdateCancelCardRequest = apiUrl.concat('api/CardRequest/updateCancelCardRequest/');
  public static ChangeCardRequest = apiUrl.concat('api/CardRequest/changeCardRequest');
  public static updateChangeCardRequest = apiUrl.concat('api/CardRequest/changeCardRequest/');
  public static ApiCardRequest = apiUrl.concat('api/CardRequest/newCardRequest');
  public static ApiUpdateCardRequest = apiUrl.concat('api/CardRequest/newCardRequest/');
  public static ApiDeleteCardRequest = apiUrl.concat('api/CardRequest/');
  public static GetCardRequestByPaging = apiUrl.concat('api/CardRequest/GetByPage');
  public static GetCardManagerByPaging = apiUrl.concat('api/CardManager/GetByPage');
  public static GetCardEmptyByPage = apiUrl.concat('api/CardManager/GetCardEmptyByPage');
  public static GetCardActiveByPage = apiUrl.concat('api/CardManager/GetCardActiveByPage');
  public static GetCardManagerEmpty = apiUrl.concat('api/CardManager/GetCardEmptyByPage');
  public static getCardRequestId = apiUrl.concat('api/CardRequest/newCardRequest');
    //#region "OrderConstruction"
    public static CreateOrderConstruction = apiUrl.concat('api/cms/OrderConstruction');
    public static getOrderConstructionById = apiUrl.concat('api/cms/OrderConstruction/');
    public static GetOrderConstructionByPaging = apiUrl.concat('api/cms/OrderConstruction/getByPage');
    public static UpdateOrderConstruction = apiUrl.concat('api/cms/OrderConstruction/');
    public static DeleteListOrderConstruction = apiUrl.concat('api/cms/OrderConstruction/deletes/')
    //#region "Order-Transport"
    public static CreateOrderTransport = apiUrl.concat('api/cms/OrderTransport');
    public static getOrderTransportById = apiUrl.concat('api/cms/OrderTransport/');
    public static GetOrderTransportByPaging = apiUrl.concat('api/cms/OrderTransport/getByPage');
    public static UpdateOrderTransport = apiUrl.concat('api/cms/OrderTransport/');
    public static DeleteListOrderTransport = apiUrl.concat('api/cms/OrderTransport/deletes/')
    //#region "Order-Cancel"
    public static CreateOrderCancel = apiUrl.concat('api/cms/OrderCancel');
    public static getOrderCancelByTargetId = apiUrl.concat('api/cms/OrderCancel/GetByTarget/');
    public static getOrderReviewByTargetId = apiUrl.concat('api/cms/OrderReview/GetByTarget/');
    public static GetOrderCancelByPaging = apiUrl.concat('api/cms/OrderCancel/getByPage');
    public static UpdateOrderCancel = apiUrl.concat('api/cms/OrderCancel/');
    public static DeleteListOrderCancel = apiUrl.concat('api/cms/OrderCancel/deletes/')
    //#region "Order-Yard"
    public static CreateOrderYard = apiUrl.concat('api/cms/OrderYard');
    public static OrderYardById = apiUrl.concat('api/cms/OrderYard/');
    public static GetOrderYardByPaging = apiUrl.concat('api/cms/OrderYard/getByPage');
    public static DeleteListOrderYard = apiUrl.concat('api/cms/OrderYard/deletes/')
    //#region "Order-Acceptance"
    public static CreateOrderAcceptance = apiUrl.concat('api/cms/OrderAcceptance');
    public static UpdateOrderAcceptance = apiUrl.concat('api/cms/OrderAcceptance/');
    public static getOrderAcceptancebyId = apiUrl.concat('api/cms/OrderAcceptance/');
    public static deleteOrderAcceptancebyId = apiUrl.concat('api/cms/OrderAcceptance/');

    public static GetOrderAcceptanceByPaging = apiUrl.concat('api/cms/OrderAcceptance/getByPage');
    public static getOrderAcceptanceByTarget = apiUrl.concat('api/cms/OrderAcceptance/GetByTarget/');

    //#region "Icon-Management"

    public static getListIcon = apiUrl.concat('api/Icon/GetList');
    public static createNewIcon = apiUrl.concat('api/icon');
    public static getDetailIcon = apiUrl.concat('api/icon/')
    public static dropdownIcon = apiUrl.concat('api/icon/Dropdown')

    //Quantridonvi

    public static urlCreateOrganization = apiUrl.concat('api/organization');
}
