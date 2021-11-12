export const isStringEmpty = (value: string | undefined): boolean => {
    return !value;
}

export const clamp = (val: number, min: number, max: number) => {
    return Math.max(min, Math.min(val, max));
}
export const youtubeParser = (url:string) => {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : "";
}

export const getTimeString = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = (time % 3600) % 60;
    const sHours = hours < 10? `0${hours}` : hours.toString();
    const sMinutes = minutes < 10? `0${minutes}` : minutes.toString();
    const sSeconds = seconds < 10? `0${seconds}` : seconds.toString();
    return `${sHours}:${sMinutes}:${sSeconds}`;
}