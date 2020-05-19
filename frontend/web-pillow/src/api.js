const host = "127.0.0.1";
const port = 8080;
const url = endpoint => `http://${host}:${port}/${endpoint}`;

export default {
    fetch: (opt, action) => {
        return fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
        })
            .then(res => res.json())
            .then(response => {
                action(response);
            });
    },
    endpoints: {
        getAvailableFilters: () => ({
            path: url(`filter/all`),
            method: "GET"
        }),
        enhanceImage: (imageEnhanceDto) => ({
            path: url(`enhance`),
            method: "PUT",
            body: JSON.stringify(imageEnhanceDto),
            headers: {
                "Content-Type": "application/json"
            }
        }),
        applyFilter: (imageFilterDto) => ({
            path: url(`filter`),
            method: "PUT",
            body: JSON.stringify(imageFilterDto),
            headers: {
                "Content-Type": "application/json"
            }
        }),
    }
}