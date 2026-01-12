// TODO: creating custom events
export class WindowComponent extends HTMLElement {
    px = 0;
    py = 0;
    w = 0;
    h = 0;

    slotElement = document.createElement('slot');
    header = document.createElement('header');
    
    get left() {
        return this.px;
    }

    set left(px: number) {
        this.px = px;
    }

    get top() {
        return this.py;
    }

    set top(py: number) {
        this.py = py;
    }

    get width() {
        return this.w;
    }

    set width(w: number) {
        this.w = w;
    }

    get height() {
        return this.py;
    }

    set height(h: number) {
        this.h = h;
    }

    constructor() {
        super();
    }
}
