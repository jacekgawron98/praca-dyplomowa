interface AuthModel {
    account: User,
    token: string
}

interface User {
    _id?: string,
    login: string,
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
    day: string,
    hour: number,
    minute: number,
    isWeekly: boolean
}

interface Calendar {
    monday: PracticeSet[],
    tuesday: PracticeSet[],
    wednesday: PracticeSet[],
    thursday: PracticeSet[],
    friday: PracticeSet[],
    saturday: PracticeSet[],
    sunday: PracticeSet[],
}

interface Stat {
    date: number;
    finishTime: number;
    value: number;
}