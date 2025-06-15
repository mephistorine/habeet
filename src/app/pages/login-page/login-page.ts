import {AsyncPipe} from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {Router} from "@angular/router";
import {
    TuiButton,
    TuiError,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTitle,
} from "@taiga-ui/core";
import {TuiButtonLoading, TuiFieldErrorPipe} from "@taiga-ui/kit";
import {TuiForm, TuiHeader} from "@taiga-ui/layout";
import {SUPABASE_CLIENT} from "../../supabase";

@Component({
    selector: "ha-login-page",
    imports: [
        ReactiveFormsModule,
        TuiForm,
        TuiHeader,
        TuiTitle,
        TuiTextfieldComponent,
        TuiLabel,
        TuiTextfieldDirective,
        TuiError,
        TuiFieldErrorPipe,
        AsyncPipe,
        TuiButton,
        TuiButtonLoading,
    ],
    templateUrl: "./login-page.html",
    styleUrl: "./login-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    private readonly supabaseClient = inject(SUPABASE_CLIENT)
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);

    readonly isLoading = signal(false)

    readonly form = this.formBuilder.group({
        email: this.formBuilder.control("", [Validators.required, Validators.email]),
        password: this.formBuilder.control("", [Validators.required])
    })

    tryToLogin(event: SubmitEvent) {
        event.preventDefault();

        if (this.form.invalid) {
            return
        }

        const {email, password} = this.form.getRawValue();

        this.isLoading.set(true);

        this.supabaseClient.auth.signInWithPassword({
            email,
            password
        })
            .then(() => {
                this.router.navigateByUrl("/")
            })
    }
}
