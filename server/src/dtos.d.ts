declare enum DayOfWeek {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday
}

interface PracticeItem {
    id?: string,
    name: string,
    description?: string,
    duration?: number,
    repeats?: number,
    statisticName?: string,
    videoLink?: string
}

interface PracticeSet {
    id?: string,
    name: string,
    items: PracticeItem[],
    plannedTime?: SetTime,
}

interface SetTime {
    day: DayOfWeek,
    hour: number,
    minute: number,
    isWeekly: boolean
}