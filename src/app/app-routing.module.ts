import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from './home/home.component';
import { PrivacyComponent } from './footer/privacy/privacy.component';
import { AboutComponent } from './footer/about/about.component';
import { ContactComponent } from './footer/contact/contact.component'
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { AuthGuard } from "./auth/auth.guard";
import { PostContentComponent } from "./posts/post-content/post-content.component";

const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'resetPassword', component: ResetPasswordComponent},
    // , canActivate: [AuthGuard]
    {path: 'upload', component: PostCreateComponent, canActivate: [AuthGuard]},
    {path: 'myuploads', component: PostListComponent, canActivate: [AuthGuard]},
    {path: 'content/:postId', component: PostContentComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule{

}

