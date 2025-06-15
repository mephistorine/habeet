import {inject} from "@angular/core";
import {CanActivateFn, Router, Routes} from "@angular/router";
import {LoginPage} from "./pages/login-page/login-page";
import {MainPage} from "./pages/main-page/main-page";
import {SUPABASE_CLIENT} from "./supabase";

const canActivateMainPage: CanActivateFn = () => {
    const supabaseClient = inject(SUPABASE_CLIENT);
    const router = inject(Router);
    return supabaseClient.auth.getSession()
        .then(({data, error}) => {
            if (error) {
                console.error("canActivateMainPage", error);
                return false;
            }

            if (!data.session) {
                return router.parseUrl("/login");
            }

            return true;
        });
};

const canActivateLoginPage: CanActivateFn = () => {
    const supabaseClient = inject(SUPABASE_CLIENT);
    const router = inject(Router);
    return supabaseClient.auth.getSession()
        .then(({data, error}) => {
            if (error) {
                console.error("canActivateLoginPage", error);
                return false;
            }

            if (data.session) {
                return router.parseUrl("/");
            }

            return true;
        });
};

export const routes: Routes = [
    {
        path: "login",
        title: "Login",
        component: LoginPage,
        canActivate: [canActivateLoginPage],
    },
    {
        path: "",
        component: MainPage,
        canActivate: [canActivateMainPage],
    },
];
