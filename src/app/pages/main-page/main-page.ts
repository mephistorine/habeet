import {
    afterEveryRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    Directive,
    inject,
    Injectable, Injector,
    signal,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl} from "@angular/forms";
import {
    TuiMobileCalendarDropdown,
    TuiMobileCalendarDropdownNew,
    tuiProvideMobileCalendar,
    TuiSheetDialogService,
} from "@taiga-ui/addon-mobile";
import {tuiControlValue, TuiDay, tuiInjectElement} from "@taiga-ui/cdk";
import {TuiAppearance, TuiButton, TuiLoader, TuiTitle} from "@taiga-ui/core";
import {TUI_CALENDAR_DATE_STREAM, TuiCheckbox} from "@taiga-ui/kit";
import {TuiAppBar, TuiCardLarge, TuiHeader} from "@taiga-ui/layout";
import {PolymorpheusComponent} from "@taiga-ui/polymorpheus";
import {isFuture, isSameDay, subDays} from "date-fns";
import {formatISOWithOptions} from "date-fns/fp";
import {isEqual, merge} from "es-toolkit";
import {original, produce} from "immer";
import {take} from "rxjs";
import {
    UPSERT_HABIT_DIALOG_POLYMORPHEUS,
} from "../../components/upsert-habit-dialog/upsert-habit-dialog";
import {HabitColor, HabitEvent} from "../../database.types";
import {SUPABASE_CLIENT} from "../../supabase";

type Habit = {
    id: string
    name: string
    description: string
    createdAt: Date
    color: HabitColor
    events: HabitEvent[]
}

type HabitCreateDto = {
    name: string
    description: string
    color?: HabitColor
}

type HabitPatchDto = {
    name?: string
    description?: string
    color?: HabitColor
}

type HabitStore = {
    isLoading: boolean
    habits: Habit[]
}

@Injectable({
    providedIn: "root",
})
export class HabitsService {
    private readonly supabaseClient = inject(SUPABASE_CLIENT);
    readonly state = signal<HabitStore>({
        isLoading: true,
        habits: [],
    });

    async loadHabits() {
        this.state.update(s => ({...s, isLoading: true}));

        const {data, error} = await this.supabaseClient
            .from("habits")
            .select();

        if (error) {
            throw error;
        }

        this.state.update((currentState) => {
            return {
                ...currentState,
                isLoading: false,
                habits: data.map((val) => {
                    return {
                        id: val.id,
                        name: val.name,
                        description: val.description,
                        createdAt: new Date(val.created_at),
                        color: val.color,
                        events: val.events,
                    };
                }),
            };
        });
    }

    async create(habitCreateDto: HabitCreateDto) {
        const habit: Habit = {
            id: crypto.randomUUID(),
            name: habitCreateDto.name,
            description: habitCreateDto.description,
            color: habitCreateDto.color || {
                type: "enum",
                value: "BLUE",
            },
            createdAt: new Date(),
            events: [],
        };

        this.state.update((currentState) => {
            return {
                ...currentState,
                habits: currentState.habits.concat(habit),
            };
        });

        const {error} = await this.supabaseClient.from("habits").insert({
            id: habit.id,
            color: habit.color,
            description: habit.description,
            name: habit.name,
            created_at: habit.createdAt.toISOString(),
        });

        if (error) {
            this.state.update((currentState) => {
                return {
                    ...currentState,
                    habits: currentState.habits.filter(h => h.id !== habit.id),
                };
            });
            throw error;
        }
    }

    async patch(id: string, dto: HabitPatchDto) {
        let originHabit: Habit | undefined;

        this.state.update(produce(current => {
            const index = current.habits.findIndex(h => h.id === id);
            const habit = current.habits.at(index);
            originHabit = original(habit);
            current.habits[index] = merge(habit!, dto);
        }));

        const {error} = await this.supabaseClient
            .from("habits")
            .update({
                name: dto.name,
                description: dto.description,
                color: dto.color,
            })
            .eq("id", id);

        if (error) {
            this.state.update(produce(current => {
                const index = current.habits.findIndex(h => h.id === id);
                current.habits[index] = originHabit!;
            }));
            throw error;
        }
    }

    async deleteById(habitId: string) {
        const beforeActionState = this.state()

        this.state.update(produce(draft => {
            draft.habits = draft.habits.filter(h => h.id !== habitId)
        }))

        const {error} = await this.supabaseClient.from("habits").delete().eq("id", habitId)

        if (error) {
            this.state.set(beforeActionState)
        }
    }

    async addEvent(habitId: string, event: HabitEvent) {
        this.state.update(produce(current => {
            const habit = current.habits.find(h => h.id === habitId);
            habit?.events.push(event);
        }));

        const {error} = await this.supabaseClient.from("habits").update({
            events: this.state().habits.find(h => h.id === habitId)!.events,
        }).eq("id", habitId);

        if (error) {
            this.state.update(produce(current => {
                const habit = current.habits.find(h => h.id === habitId);
                if (habit) {
                    habit.events = habit.events.filter(e => !isEqual(e, event));
                }
            }));
            throw error;
        }
    }

    async setEvents(habitId: string, events: HabitEvent[]) {
        const beforeActionState = this.state()
        this.state.update(produce(draft => {
            draft.habits.find(h => h.id === habitId)!.events = events
        }))

        const {error} = await this.supabaseClient.from("habits").update({
            events
        }).eq("id", habitId)

        if (error) {
            this.state.set(beforeActionState)
            throw error
        }
    }
}

const formatToDateString = formatISOWithOptions({representation: "date"});

@Directive({
    standalone: true,
    selector: "[scrollIntoView]",
})
export class ScrollIntoViewDirective {
    private readonly nativeElement = tuiInjectElement();

    constructor() {
        const afterRenderRef = afterEveryRender(() => {
            this.nativeElement.scrollIntoView({behavior: "instant"});
        });

        inject(DestroyRef).onDestroy(() => afterRenderRef.destroy());
    }
}

@Component({
    selector: "ha-main-page",
    imports: [
        TuiAppearance,
        TuiCardLarge,
        TuiCheckbox,
        TuiHeader,
        TuiTitle,
        TuiAppBar,
        TuiButton,
        TuiLoader,
        ScrollIntoViewDirective,
    ],
    templateUrl: "./main-page.html",
    styleUrl: "./main-page.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class MainPage {
    private readonly habitsService = inject(HabitsService);
    private readonly tuiSheetDialogService = inject(TuiSheetDialogService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly injector = inject(Injector)

    readonly days = createYear();
    readonly formatToDateString = formatToDateString;

    readonly isLoading = computed(() => this.habitsService.state().isLoading);
    readonly habits = computed(() => {
        const {habits} = this.habitsService.state();
        return habits.map((habit) => {
            return {
                id: habit.id,
                name: habit.name,
                description: habit.description,
                isChecked: habit.events.some(e => isSameDay(e.createTime, new Date())),
                checkedDays: new Set(habit.events.map(e => formatToDateString(e.createTime))),
            };
        });
    });

    constructor() {
        this.habitsService.loadHabits();
    }

    openHabitCreateDialog() {
        this.tuiSheetDialogService
            .open(UPSERT_HABIT_DIALOG_POLYMORPHEUS, {
                bar: false,
            })
            .pipe(
                take(1),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((result: any) => {
                if (!result) {
                    return;
                }

                this.habitsService.create({
                    name: result.name,
                    description: result.description,
                });
            });
    }

    openEditHabitDialog(habitId: string) {
        const habit = this.habitsService.state().habits.find(h => h.id === habitId)!;
        this.tuiSheetDialogService.open<Pick<Habit, "name" | "color" | "description">>(UPSERT_HABIT_DIALOG_POLYMORPHEUS, {
            bar: false,
            data: {
                startValue: habit,
            },
        })
            .pipe(
                take(1),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((result) => {
                if (!result) {
                    return;
                }

                if (isEqual(result, {
                    name: habit.name, color: habit.color,
                    description: habit.description,
                })) {
                    return;
                }

                this.habitsService.patch(habit.id, result);
            });
    }

    markTodayAsCompleted(habitId: string) {
        this.habitsService.addEvent(habitId, {
            createTime: new Date().toISOString(),
        });
    }

    deleteHabit(habitId: string) {
        this.habitsService.deleteById(habitId)
    }

    editCheckedDays(habitId: string) {
        const events = this.habitsService.state().habits.find(h => h.id === habitId)!.events
        this.tuiSheetDialogService.open<TuiDay[]>(
            new PolymorpheusComponent(
                TuiMobileCalendarDropdown,
                Injector.create({
                    providers: [
                        {
                            provide: TUI_CALENDAR_DATE_STREAM,
                            useValue: tuiControlValue(new FormControl(events.map(e => TuiDay.fromLocalNativeDate(new Date(e.createTime))))),
                        }
                    ],
                    parent: this.injector
                })
            ),
            {
                bar: false,
                data: {
                    multi: true,
                    disabledItemHandler: (day: TuiDay) => {
                        return isFuture(day.toLocalNativeDate())
                    }
                }
            }
        ).subscribe((days) => {
            this.habitsService.setEvents(habitId, days.map((day) => {
                return {
                    createTime: day.toLocalNativeDate().toISOString()
                }
            }))
        })
    }
}

function createYear() {
    const days = [new Date()];

    for (let i = 0; i < 363; i++) {
        days.unshift(subDays(days[0], 1));
    }

    return days;
}
