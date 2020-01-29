
const BASE_URL = 'https://api.shokz.tv';

const defaultOptions: RequestInit = {
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
};

export async function post(route: string, data: object = {}): Promise<Response> {
    return fetch(BASE_URL + route, {...defaultOptions, method: 'POST', body: JSON.stringify(data)});
}
export async function patch(route: string, data: object = {}): Promise<Response> {
    return fetch(BASE_URL + route, {...defaultOptions, method: 'PATCH', body: JSON.stringify(data)});
}
export async function get<T>(route: string): Promise<T> {
    const response = await fetch(BASE_URL + route);
    if(response.status < 400) {
        return await response.json();
    }
    console.error(response.statusText);
}