export function registerEvent(
    eventType: string,
    element: Element | Window,
    callback: (event: Event, ...args: any) => void
) {
    element.addEventListener(eventType, callback);
}

export function removeEvent(
    eventType: string,
    element: Element | Window,
    callback: (event: Event, ...args: any) => void
) {
    element.removeEventListener(eventType, callback);
}
