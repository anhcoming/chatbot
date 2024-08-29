import { NgModule } from '@angular/core';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { CommonModule } from '@angular/common';
import { ManagerCategoryRoutingModule } from 'src/app/routes/manager-category.module';
import { NotebookCategoryComponent } from './notebook-category/notebook-category.component';
import { AddNotebookCategoryComponent } from './notebook-category/add-notebook-category/add-notebook-category.component';
import { NotebookComponent } from './notebook/notebook.component';
import { AddNotebookComponent } from './notebook/add-notebook/add-notebook.component';
import { NotebookCategoryService } from 'src/app/services/notebook-category';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactsComponent } from './contacts/add-contacts/add-contacts.component';
import { BannerComponent } from './banner/banner.component';
import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DailyquestionComponent } from './dailyquestion/dailyquestion.component';
import { AddDailyquestionComponent } from './dailyquestion/add-dailyquestion/add-dailyquestion.component';
import { NewsComponent } from './news/news.component';
import { PostsComponent } from './posts/posts.component';
import { NotificationPostsComponent } from './notification-posts/notification-posts.component';
import { AddNewsComponent } from './news/add-news/add-news.component';
import { AddPostsComponent } from './posts/add-posts/add-posts.component';
import { AddNotificationComponent } from './notification-posts/add-notification/add-notification.component';





@NgModule({
    declarations: [
        NotebookCategoryComponent,
        AddNotebookCategoryComponent,
        NotebookComponent,
        AddNotebookComponent,
        ContactsComponent,
        AddContactsComponent,
        BannerComponent,
        AddBannerComponent,
        DailyquestionComponent,
        AddDailyquestionComponent,
        NewsComponent,
        PostsComponent,
        NotificationPostsComponent,
        AddNewsComponent,
        AddPostsComponent,
        AddNotificationComponent,
      ],
      imports: [
        CommonModule,
        AppLayoutModule,
        ManagerCategoryRoutingModule,
        CKEditorModule,
      ],
      providers: [
        NotebookCategoryService,
      ]
    })
    export class ManagerCategoryModule { }
    