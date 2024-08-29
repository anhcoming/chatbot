import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoComponent } from '../components/user/user-info/user-info.component';
import { UserChangepassComponent } from '../components/user/user-changepass/user-changepass.component';
import { NhanDangKhuonMatComponent } from '../components/Demo/nhan-dang-khuon-mat/nhan-dang-khuon-mat.component';
import { DemsoxetrongbaiComponent } from '../components/Demo/demsoxetrongbai/demsoxetrongbai.component';
import { DemsoluongvaoramotcongComponent } from '../components/Demo/demsoluongvaoramotcong/demsoluongvaoramotcong.component';
import { HoiDapChuyenNganhComponent } from '../components/Demo/hoi-dap-chuyen-nganh/hoi-dap-chuyen-nganh.component';
import { ThuThapDuLieuComponent } from '../components/Demo/thu-thap-du-lieu/thu-thap-du-lieu.component';
import { OpenMetadataComponent } from '../components/Demo/open-metadata/open-metadata.component';
import { ChuyenDoiDinhDangComponent } from '../components/Demo/chuyen-doi-dinh-dang/chuyen-doi-dinh-dang.component';
import { QuanLiChuDeComponent } from '../components/Demo/quan-li-chu-de/quan-li-chu-de.component';
import { AddQuanLiChuDeComponent } from '../components/Demo/quan-li-chu-de/add-quan-li-chu-de/add-quan-li-chu-de.component';
import { ActionQuanLiChuDeComponent } from '../components/Demo/quan-li-chu-de/action-quan-li-chu-de/action-quan-li-chu-de.component';
import { QuanlidonviComponent } from '../components/Demo/quanlidonvi/quanlidonvi.component';
import { AddQuanLiDonViComponent } from '../components/Demo/quanlidonvi/add-quan-li-don-vi/add-quan-li-don-vi.component';
import { CauHinhChuDeComponent } from '../components/Demo/quanlidonvi/cau-hinh-chu-de/cau-hinh-chu-de.component';
import { QuanLiModelsComponent } from '../components/Demo/quan-li-models/quan-li-models.component';
import { AddModelComponent } from '../components/Demo/quan-li-models/add-model/add-model.component';
import { QuanLiPhongBanComponent } from '../components/Demo/quan-li-phong-ban/quan-li-phong-ban.component';
import { AddPhongBanComponent } from '../components/Demo/quan-li-phong-ban/add-phong-ban/add-phong-ban.component';
import { QuanLiNhanVienComponent } from '../components/Demo/quan-li-nhan-vien/quan-li-nhan-vien.component';
import { AddNhanVienComponent } from '../components/Demo/quan-li-nhan-vien/add-nhan-vien/add-nhan-vien.component';
import { QuanLiNhomChuDeComponent } from '../components/Demo/quan-li-nhom-chu-de/quan-li-nhom-chu-de.component';
import { AddNhomChuDeComponent } from '../components/Demo/quan-li-nhom-chu-de/add-nhom-chu-de/add-nhom-chu-de.component';
import { CreateAccountStaffComponent } from '../components/Demo/quan-li-nhan-vien/create-account-staff/create-account-staff.component';
import { CauHinhNhanVienComponent } from '../components/Demo/quan-li-nhan-vien/cau-hinh-nhan-vien/cau-hinh-nhan-vien.component';
import { QuanLiIconComponent } from '../components/Demo/quan-li-icon/quan-li-icon.component';
import { CreateIconsTopicComponent } from '../components/Demo/quan-li-icon/create-icons-topic/create-icons-topic.component';

const routes: Routes = [
  {
    path: 'elasticsearch',
    component: NhanDangKhuonMatComponent
  },
  {
    path: 'xulytext',
    component: DemsoxetrongbaiComponent
  },
  {
    path: 'xulypdf',
    component: DemsoluongvaoramotcongComponent
  },
  {
    path: 'quanlichude',
    component: QuanLiChuDeComponent
  },
  {
    path: 'quanlichude/create',
    component: AddQuanLiChuDeComponent
  },
  {
    path: 'quanlichude/create/:id',
    component: AddQuanLiChuDeComponent
  },
  {
    path: 'quanlichude/detail/:id',
    component: ActionQuanLiChuDeComponent
  },
  {
    path: 'hoidapchuyennganh',
    component: HoiDapChuyenNganhComponent
  },
  {
    path: 'uploadData',
    component: ThuThapDuLieuComponent
  },
  {
    path: 'open-metadata',
    component: OpenMetadataComponent
  },
  {
    path: 'chuyendoidinhdang',
    component: ChuyenDoiDinhDangComponent
  },
  {
    path: 'quanlidonvi',
    component: QuanlidonviComponent
  },
  {
    path: 'quanlidonvi/create',
    component: AddQuanLiDonViComponent
  },
  {
    path: 'quanlidonvi/update/:id',
    component: AddQuanLiDonViComponent
  },
  {
    path: 'quanlidonvi/cauhinh/:id',
    component: CauHinhChuDeComponent
  },
  {
    path: 'models',
    component: QuanLiModelsComponent
  },
  {
    path: 'models/create',
    component: AddModelComponent
  },
  {
    path: 'models/update/:id',
    component: AddModelComponent
  },
  {
    path: 'department',
    component: QuanLiPhongBanComponent
  },
  {
    path: 'department/create',
    component: AddPhongBanComponent
  },
  {
    path: 'department/update/:id',
    component: AddPhongBanComponent
  },
  {
    path: 'employee',
    component: QuanLiNhanVienComponent
  },
  {
    path: 'employee/create',
    component: AddNhanVienComponent
  },
  {
    path: 'employee/update/:id',
    component: AddNhanVienComponent
  },
  {
    path: 'employee/create-account/:id',
    component: CreateAccountStaffComponent
  },
  { path: 'employee/setup-employee/:id',
    component: CauHinhNhanVienComponent 
  },
  {
    path: 'groupTopic',
    component: QuanLiNhomChuDeComponent
  },
  {
    path: 'groupTopic/create',
    component: AddNhomChuDeComponent
  },
  {
    path: 'groupTopic/update/:id',
    component: AddNhomChuDeComponent
  },
  {
    path: 'icon-manage',
    component: QuanLiIconComponent
  },
  {
    path: 'icon-manage/create',
    component: CreateIconsTopicComponent,
  },
  {
    path: 'icon-manage/create/:id',
    component: CreateIconsTopicComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
