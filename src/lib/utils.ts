export const extractQueryParams = (): Record<string, any> => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop: any) => searchParams.get(prop),
    });
};

// Taken directly from https://github.com/processing/p5.js/blob/main/src/math/calculation.js
export const constrain = (n:number , low: number, high: number): number => {
    return Math.max(Math.min(n, high), low);
}