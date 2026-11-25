/** Fails to compile unless `TActual` and `TExpected` are the same type. */
export type TExact<TActual, TExpected> = [TActual] extends [TExpected]
    ? [TExpected] extends [TActual]
        ? true
        : false
    : false;

/** Compiles only when its type argument is `true` */
export function assertType<TCheck extends true>(): TCheck | void {}
