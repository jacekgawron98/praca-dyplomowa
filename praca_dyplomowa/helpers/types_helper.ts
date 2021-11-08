export const isStringEmpty = (value: string | undefined): boolean => {
    return !value;
}

export const clamp = (val: number, min: number, max: number) => {
    return Math.max(min, Math.min(val, max));
}