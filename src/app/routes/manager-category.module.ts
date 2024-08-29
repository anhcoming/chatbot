import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotebookCategoryComponent } from '../components/manager-category/notebook-category/notebook-category.component';
import { AddNotebookCategoryComponent } from '../components/manager-category/notebook-category/add-notebook-category/add-notebook-category.component';
import { NotebookComponent } from '../components/manager-category/notebook/notebook.component';
import { AddNotebookComponent } from '../components/manager-category/notebook/add-notebook/add-notebook.component';
import { ContactsComponent } from '../components/manager-category/contacts/contacts.component';
import { AddContactsComponent } from '../components/manager-category/contacts/add-contacts/add-contacts.component';
import { BannerComponent } from '../components/manager-category/banner/banner.component';
import { AddBannerComponent } from '../components/manager-category/banner/add-banner/add-banner.component';
import { DailyquestionComponent } from '../components/manager-category/dailyquestion/dailyquestion.component';
import { AddDailyquestionComponent } from '../components/manager-category/dailyquestion/add-dailyquestion/add-dailyquestion.component';
import { NewsComponent } from '../components/manager-category/news/news.component';
import { PostsComponent } from '../components/manager-category/posts/posts.component';
import { NotificationPostsComponent } from '../components/manager-category/notification-posts/notification-posts.component';
import { AddNewsComponent } from '../components/manager-category/news/add-news/add-news.component';
import { AddPostsComponent } from '../components/manager-category/posts/add-posts/add-posts.component';
import { AddNotificationComponent } from '../components/manager-category/notification-posts/add-notification/add-notification.component';

const routes: Routes = [
    {
      path: 'notebook-category/list',
      component: NotebookCategoryComponent,
    },
    {
      path: 'notebook-category/create',
      component: AddNotebookCategoryComponent,
    },
    {
      path : 'notebook-category/update/:id',
      component: AddNotebookCategoryComponent,
    },
    {
      path: 'notebook/list',
      component: NotebookComponent,
    },
    {
      path: 'notebook/create',
      component: AddNotebookComponent,
    },
    {
      path: 'notebook/update/:id',
      component: AddNotebookComponent,
    },
    {
      path: 'contacts/list',
      component: ContactsComponent,
    },
    {
      path: 'contacts/create',
      component: AddContactsComponent,
    },
    {
      path: 'contacts/update/:id',
      component: AddContactsComponent,
    },
    {
      path : 'banner/list',
      component: BannerComponent,
    },
    {
      path : 'banner/create',
      component: AddBannerComponent,
    },
    {
      path : 'banner/update/:id',
      component: AddBannerComponent,
    },
    {
      path : 'dailyquestion/list',
      component: DailyquestionComponent,
    },
    {
      path: 'dailyquestion/create',
      component: AddDailyquestionComponent,
    },
    {
      path: 'dailyquestion/update/:id',
      component: AddDailyquestionComponent,
    },
    {
      path: 'news/list',
      component: NewsComponent,
    },
    {
      path: 'news/create',
      component: AddNewsComponent,
    },
    {
      path: 'news/update/:id',
      component: AddNewsComponent,
    },
    {
      path : 'posts/list',
      component: PostsComponent,
    },
    {
      path: 'posts/create',
      component : AddPostsComponent,
    },
    {
      path: 'posts/update/:id',
      component: AddPostsComponent,
    },
    {
      path : 'notification/list',
      component: NotificationPostsComponent,
    },
    {
      path : 'notification/create',
      component: AddNotificationComponent,
    },
    {
      path : 'notification/update/:id',
      component: AddNotificationComponent,
    },
   

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerCategoryRoutingModule { }