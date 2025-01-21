export const isArray = (arg: any): arg is any[] => Array.isArray(arg)
export const isNumber = (arg: any): arg is number => typeof arg === 'number'