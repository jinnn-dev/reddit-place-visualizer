export function request<T>(
    resource: string,
    config: RequestInit = {}
): Promise<T> {
    return fetch(resource, config).then(response => response.json()).then(data => data as T)
}