import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {TuiPlatform} from "@taiga-ui/cdk";
import {TUI_DARK_MODE, TuiRoot} from "@taiga-ui/core";

@Component({
    selector: "ha-root",
    imports: [TuiRoot, RouterOutlet, TuiPlatform],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class App {
    readonly tuiDarkMode = inject(TUI_DARK_MODE)
}
