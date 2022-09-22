export const extractQueryParams = (): Record<string, any> => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop: any) => searchParams.get(prop),
    });
};