interface UserDbModel {
    login: string,
    password: string,
}

interface User extends UserDbModel {
    _id?: string,
    
}

declare enum DayOfWeek {
    monday="monday",
    tuesday="tuesday",
    wednesday="wednesday",
    thursday="thursday",
    friday="friday",
    saturday="saturday",
    sunday="sunday"
}

interface PracticeItem {
    _id?: import("mongodb").ObjectId,
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
    _id?: import("mongodb").ObjectId,
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