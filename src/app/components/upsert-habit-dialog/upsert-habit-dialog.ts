import {AsyncPipe} from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {tuiControlValue} from "@taiga-ui/cdk";
import {
    TUI_DARK_MODE,
    TuiButton,
    TuiDialogContext,
    TuiError,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
} from "@taiga-ui/core";
import {TuiFieldErrorPipe} from "@taiga-ui/kit";
import {TuiAppBar, TuiForm} from "@taiga-ui/layout";
import {injectContext, PolymorpheusComponent} from "@taiga-ui/polymorpheus";
import {
    DEFAULT_HABIT_COLOR,
    HABIT_COLOR_NAME_VALUES,
    HabitColor, HabitColorName,
} from "../../database.types";

@Component({
    selector: "ha-upsert-habit-dialog",
    imports: [
        TuiForm,
        ReactiveFormsModule,
        AsyncPipe,
        TuiError,
        TuiFieldErrorPipe,
        TuiLabel,
        TuiTextfieldComponent,
        TuiTextfieldDirective,
        TuiButton,
        TuiAppBar,

    ],
    templateUrl: "./upsert-habit-dialog.html",
    styleUrl: "./upsert-habit-dialog.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class UpsertHabitDialog {
    private readonly tuiDarkMode = inject(TUI_DARK_MODE).asReadonly();
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly context = injectContext<TuiDialogContext<any, any>>();

    readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>("", [Validators.required, Validators.minLength(1)]),
        description: this.formBuilder.control<string>("", [Validators.minLength(1)]),
        color: this.formBuilder.control<HabitColor>(DEFAULT_HABIT_COLOR, [Validators.required, Validators.minLength(1)]),
    });

    readonly selectedColor = toSignal(tuiControlValue<HabitColor>(this.form.controls.color), {requireSync: true})

    readonly colors = computed(() => {
        const theme = this.tuiDarkMode() ? "dark" : "light"
        return Object.entries(HABIT_COLOR_NAME_VALUES).map(([key, value]) => {
            return {
                name: key,
                hex: value[theme]
            }
        })
    })

    constructor() {
        this.context.data?.startValue && this.form.patchValue(this.context.data.startValue)
    }

    closeDialog() {
        this.context.completeWith(undefined)
    }

    closeWithResult() {
        if (this.form.invalid) {
            return
        }
        this.context.completeWith(this.form.getRawValue());
    }

    selectColor(colorName: string) {
        this.form.patchValue({
            color: {
                type: "enum",
                value: colorName as HabitColorName
            }
        })
    }
}

export const UPSERT_HABIT_DIALOG_POLYMORPHEUS = new PolymorpheusComponent(UpsertHabitDialog);
