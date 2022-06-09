type KeyName = string;

function callbackWrapper(event: Event, callback: Function) {
  event.preventDefault();
  callback();
}

export function registerSpacebarEvent(callback: Function) {
  registerKeyEvent(' ', callback);
}

export function registerRKeyEvent(callback: Function) {
  registerKeyEvent('r', callback);
}

function registerKeyEvent(key: KeyName, callback: Function) {
  document.addEventListener('keyup', (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.key.toLowerCase() === key) {
      callback();
    }
  });
}

export function removeKeyEvent(keyEvent: string, key: KeyName, callback: Function) {
  const eventCallback = (event: Event) => {
    event.preventDefault();
    if ((event as KeyboardEvent).key === key) {
      callback();
    }
  };
  document.removeEventListener(keyEvent, eventCallback);
}

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
