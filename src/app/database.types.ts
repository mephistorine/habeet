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
        dark: "#ff0000",
        light: "#ff0000",
    },
    ORANGE: {
        dark: "#FFA500",
        light: "#FFA500",
    },
    YELLOW: {
        dark: "#ffd700",
        light: "#ffe700",
    },
    GREEN: {
        dark: "#03bb03",
        light: "#03bb03",
    },
    CYAN: {
        dark: "#00c0ff",
        light: "#00e2e2",
    },
    BLUE: {
        dark: "#6565ff",
        light: "#5757fe",
    },
    VIOLET: {
        dark: "#7F00FF",
        light: "#7F00FF",
    },
    GREY: {
        dark: "#808080",
        light: "#808080",
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
