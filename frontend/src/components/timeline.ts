import { registerEvent, removeEvent } from '@/lib/events';

export class Timeline {
  parent: HTMLElement;
  track: HTMLElement;
  thumb: HTMLElement;
  label: HTMLElement;

  changed: boolean;
  percentage: number;

  constructor(elementId: string) {
    this.changed = false;
    this.percentage = 0;

    const element = document.getElementById(elementId);
    if (element === null) {
      throw new Error();
    }
    this.parent = element;

    this.track = this.parent.querySelector('.slider-track')!;
    this.thumb = this.parent.querySelector('.slider-thumb')!;
    this.label = this.parent.querySelector('.slider-label')!;

    registerEvent('mousedown', this.track, this.handleEvent);
    registerEvent('touchstart', this.track, this.handleEvent);
  }

  handleEvent = (event: Event) => {
    switch (event.type) {
      case 'mousedown':
        const e = event as MouseEvent;
        if (e.button !== 0) return;
      case 'touchstart':
        registerEvent('mousemove', window, this.handleEvent);
        registerEvent('mouseup', window, this.handleEvent);
        registerEvent('touchmove', window, this.handleEvent);
        registerEvent('touchend', window, this.handleEvent);
        this.positionChanged(event);
        break;
      case 'mouseup':
      case 'touchend':
        removeEvent('mousemove', window, this.handleEvent);
        removeEvent('mouseup', window, this.handleEvent);
        removeEvent('touchmove', window, this.handleEvent);
        removeEvent('touchend', window, this.handleEvent);
        break;
      case 'mousemove':
      case 'touchmove':
        this.positionChanged(event);
    }

    event.preventDefault();
  };

  positionChanged(event: any) {
    const percentage = ((event.pageX - this.track.getBoundingClientRect().left) / this.track.offsetWidth) * 100;
    if (percentage > 0 && percentage < 100) {
      this.updateThumbPosition(percentage);
      this.changed = true;
    }
  }

  updateThumbPosition(percentage: number) {
    let newPercentage = percentage;
    if (newPercentage < 0.1) {
      newPercentage = 0;
    }
    if (newPercentage > 99.9) {
      newPercentage = 100;
    }
    this.percentage = newPercentage;
    this.thumb.style.left = `${newPercentage}%`;
  }

  updateLabel(value: any) {
    this.label.innerText = value;
  }
}
