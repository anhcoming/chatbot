import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NhanDangKhuonMatComponent } from './nhan-dang-khuon-mat/nhan-dang-khuon-mat.component';
import { DemoRoutingModule } from "src/app/routes/demo-routing.module";
import { DemsoxetrongbaiComponent } from './demsoxetrongbai/demsoxetrongbai.component';
import { DemsoluongvaoramotcongComponent } from './demsoluongvaoramotcong/demsoluongvaoramotcong.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HoiDapChuyenNganhComponent } from "./hoi-dap-chuyen-nganh/hoi-dap-chuyen-nganh.component";
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ThuThapDuLieuComponent } from './thu-thap-du-lieu/thu-thap-du-lieu.component';
import { OpenMetadataComponent } from './open-metadata/open-metadata.component';
import { ChuyenDoiDinhDangComponent } from './chuyen-doi-dinh-dang/chuyen-doi-dinh-dang.component';
import { QuanLiChuDeComponent } from './quan-li-chu-de/quan-li-chu-de.component'; 
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddQuanLiChuDeComponent } from './quan-li-chu-de/add-quan-li-chu-de/add-quan-li-chu-de.component';
import { InputTextModule } from 'primeng/inputtext';
import { ActionQuanLiChuDeComponent } from './quan-li-chu-de/action-quan-li-chu-de/action-quan-li-chu-de.component';
import { CheckboxModule } from 'primeng/checkbox';
import { QuanlidonviComponent } from './quanlidonvi/quanlidonvi.component';
import { AddQuanLiDonViComponent } from './quanlidonvi/add-quan-li-don-vi/add-quan-li-don-vi.component';
import { TooltipModule } from 'primeng/tooltip';
import { CauHinhChuDeComponent } from './quanlidonvi/cau-hinh-chu-de/cau-hinh-chu-de.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { QuanLiModelsComponent } from './quan-li-models/quan-li-models.component';
import { AddModelComponent } from './quan-li-models/add-model/add-model.component';
import { QuanLiPhongBanComponent } from './quan-li-phong-ban/quan-li-phong-ban.component';
import { AddPhongBanComponent } from './quan-li-phong-ban/add-phong-ban/add-phong-ban.component';
import { QuanLiNhanVienComponent } from './quan-li-nhan-vien/quan-li-nhan-vien.component';
import { AddNhanVienComponent } from './quan-li-nhan-vien/add-nhan-vien/add-nhan-vien.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { CauHinhNhanVienComponent } from './quan-li-nhan-vien/cau-hinh-nhan-vien/cau-hinh-nhan-vien.component';
import { QuanLiNhomChuDeComponent } from './quan-li-nhom-chu-de/quan-li-nhom-chu-de.component';
import { AddNhomChuDeComponent } from './quan-li-nhom-chu-de/add-nhom-chu-de/add-nhom-chu-de.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CreateAccountStaffComponent } from "./quan-li-nhan-vien/create-account-staff/create-account-staff.component";
import { QuanLiIconComponent } from "./quan-li-icon/quan-li-icon.component";
import { CreateIconsTopicComponent } from "./quan-li-icon/create-icons-topic/create-icons-topic.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoFocusModule } from 'primeng/autofocus';
import { SpeedDialModule } from 'primeng/speeddial';
import { Paginator, PaginatorModule } from "primeng/paginator";

@NgModule({
  declarations: [
    NhanDangKhuonMatComponent,
    DemsoxetrongbaiComponent,
    DemsoluongvaoramotcongComponent,
    HoiDapChuyenNganhComponent,
    ThuThapDuLieuComponent,
    OpenMetadataComponent,
    ChuyenDoiDinhDangComponent,
    QuanLiChuDeComponent,
    AddQuanLiChuDeComponent,
    ActionQuanLiChuDeComponent,
    QuanlidonviComponent,
    AddQuanLiDonViComponent,
    CauHinhChuDeComponent,
    QuanLiModelsComponent,
    AddModelComponent,
    QuanLiPhongBanComponent,
    AddPhongBanComponent,
    QuanLiNhanVienComponent,
    AddNhanVienComponent,
    CauHinhNhanVienComponent,
    QuanLiNhomChuDeComponent,
    AddNhomChuDeComponent,
    CreateAccountStaffComponent,
    QuanLiIconComponent,
    CreateIconsTopicComponent,
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    FormsModule,
    DialogModule,
    FileUploadModule,
    ToastModule,
    TableModule,
    ConfirmDialogModule,
    TooltipModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    TagModule,
    PasswordModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
    MultiSelectModule,
    SplitButtonModule,
    ProgressSpinnerModule,
    AutoFocusModule,
    SpeedDialModule,
    PaginatorModule,
  ],
  providers: [
  ]
})
export class DemoModule { }
