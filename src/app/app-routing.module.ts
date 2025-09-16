import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { canActivateAuthGuard } from "./guards/authguard.service";

const routes: Routes = [
  {
    path: "", // ✅ add this
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/authentication/login/login.module").then(
        (m) => m.LoginModule
      ),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/authentication/register/register.module").then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import(
        "./pages/authentication/forgot-password/forgot-password.module"
      ).then((m) => m.ForgotPasswordModule),
  },
  {
    path: "coming-soon",
    loadChildren: () =>
      import("./pages/coming-soon/coming-soon.module").then(
        (m) => m.ComingSoonModule
      ),
  },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [canActivateAuthGuard],
    children: [
      {
        path: "dashboard", // ✅ add this
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        pathMatch: "full",
      },
      {
        path: "master",
        loadChildren: () =>
          import("./pages/master/master.module").then((m) => m.MasterModule),
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabledNonBlocking",
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}