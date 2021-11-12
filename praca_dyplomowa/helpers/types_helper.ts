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