interface AuthModel {
    account: User,
    token: string
}

interface User {
    _id?: string,
    login: string,
}

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
    _id?: string,
    name: string,
    description?: string,
    duration?: number,
    repeats?: number,
    statisticName?: string,
    videoLink?: string,
    tags?: string[],
    ownerId: string,
}

interface PracticeSet {
    _id?: string,
    name: string,
    items: PracticeItem[],
    plannedTime?: SetTime,
    ownerId: string
}

interface SetTime {
    day: DayOfWeek,
    hour: number,
    minute: number,
    isWeekly: boolean
}