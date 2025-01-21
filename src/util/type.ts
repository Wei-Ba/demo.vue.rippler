export type Indexable = string | number | symbol

export type Arrayable<T = unknown[]> = T extends unknown[] ? T : T[]
export type Writable<T> = T extends object ? T extends readonly [...infer V] ? V : T extends Readonly<infer V> ? V : T : T


export type Func<T extends unknown[] = any[], R = any> = (...args:T) => R
export type Action<T extends unknown[] = any[]> = Func<T, void>

export type AssignKeys<T> = T extends [infer B, ...infer A] ?  keyof B | AssignKeys<A> : never
export type Assign<T> = T extends [infer V, ...infer Residue] ? Assign<Residue> extends infer R ? { [K in AssignKeys<[V, R]>] : K extends keyof R ? R[K] : K extends keyof V ? V[K] : never } : never : NonNullable<unknown>

export type IsPureOptional<T, Y = true, N = false> = T extends Partial<T> ? Y : N
export type ISPureRequired<T, Y = true, N = false> = T extends Required<T> ? Y : N

export type ValueOf<T> = T extends { [K: Indexable]: infer V } ? V : never

export type FindKeyByValue<T, U extends ValueOf<T>> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitByValue<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
}
export type PickByValue<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
}

export type PascalCase<T> = T extends `${infer A}${infer B}` 
? B extends Capitalize<B> 
    ? B extends "" 
        ? Lowercase<A >
        : Lowercase<`${A}-${PascalCase<B>}`>
    : Lowercase<`${A}${PascalCase<B>}`>
: T