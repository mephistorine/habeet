import {Routes} from "@angular/router";
import {LoginPage} from "./pages/login-page/login-page";
import {MainPage} from "./pages/main-page/main-page";

export const routes: Routes = [
    {
        path: "login",
        title: "Login",
        component: LoginPage
    },
    {
        path: "",
        component: MainPage
    }
];
