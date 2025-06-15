export type HabitColorName =
    "RED"
    | "ORANGE"
    | "YELLOW"
    | "GREEN"
    | "CYAN"
    | "BLUE"
    | "VIOLET"
    | "GREY"

export const HABIT_COLOR_NAME_VALUES: Record<HabitColorName, {
    dark: string,
    light: string
}> = {
    RED: {
        dark: "",
        light: "#ff0000",
    },
    ORANGE: {
        dark: "",
        light: "orange",
    },
    YELLOW: {
        dark: "",
        light: "yellow",
    },
    GREEN: {
        dark: "",
        light: "#00ff00",
    },
    CYAN: {
        dark: "",
        light: "cyan",
    },
    BLUE: {
        dark: "",
        light: "#0000ff",
    },
    VIOLET: {
        dark: "",
        light: "violet",
    },
    GREY: {
        dark: "",
        light: "grey",
    },
};

export const DEFAULT_HABIT_COLOR: HabitColor = {type: "enum", value: "BLUE"};

export type HabitColor =
    {type: "exact", value: string}
    | {type: "enum", value: HabitColorName}

export type HabitEvent = {
    createTime: string
}

export type Database = {
    public: {
        Tables: {
            habits: {
                Row: {
                    color: HabitColor
                    created_at: string
                    description: string
                    id: string
                    name: string
                    user_id: string
                    events: HabitEvent[]
                }
                Insert: {
                    color?: HabitColor
                    created_at?: string
                    description: string
                    id: string
                    name: string
                }
                Update: {
                    color?: HabitColor
                    created_at?: string
                    description?: string
                    id?: string
                    name?: string
                    events?: HabitEvent[]
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]
