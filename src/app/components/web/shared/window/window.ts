// TODO: creating custom events
export class WindowElement extends HTMLElement {
    px = 0;
    py = 0;
    w = 0;
    h = 0;
    z = 0;
    _id = -1;

    windowTitle = '';

    slotElement = document.createElement('slot');
    header = document.createElement('window-header');

    get headerName() {
        return this.windowTitle;
    }

    set headerName(windowTitle: string) {
        this.windowTitle = windowTitle;
        this.setHeader();
    }

    get Id() {
        return this._id;
    }

    set Id(id: number) {
        this._id = id;
    }
    
    get left() {
        return this.px;
    }

    set left(px: number) {
        this.px = px;
        this.style.left = px + 'px';
    }

    get top() {
        return this.py;
    }

    set top(py: number) {
        this.py = py;
        this.style.top = py + 'px';
    }

    get width() {
        return this.w;
    }

    set width(w: number) {
        this.w = w;
        this.setDimensions();
    }

    get height() {
        return this.py;
    }

    set height(h: number) {
        this.h = h;
        this.setDimensions();
    }

    set zIndex(z: number) {
        this.z = z;
        this.setZIndex();
    }

    get zIndex() {
        return this.z;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'});
        this.classList.add('absolute', 'border-2', 'flex', 'flex-col', 'border-solid');
        this.classList.add('border-slate-800', 'rounded-sm', 'z-[100]', 'transition-shadow');
        this.classList.add('ease-in-out', 'shadow-black');

        this.setDimensions();
        this.setPosition();
        this.setZIndex();
        this.setAttribute('data-windowid', this._id.toString());
        shadow.appendChild(this.header);
        
        // TODO: Resizing; change pointer types.
        // const slotWrapper = document.createElement('div');
        this.slotElement.classList.add('content', 'flex', 'bg-primary', 'w-full');
        this.slotElement.classList.add('h-full', 'rounded-es-sm', 'rounded-ee-sm');
        this.slotElement.classList.add('overflow-scroll');
        // this.slotElement.appendChild(this.slotElement);
        shadow.appendChild(this.slotElement);
    }

    setDimensions() {
        this.style.width = this.w + 'px';
        this.style.height = this.h + 'px';
    }

    setPosition() {
        this.style.left = this.px + 'px';
        this.style.top = this.py + 'px';
    }

    setHeader() {
        this.header.headerName = this.windowTitle;
    }

    setZIndex() {
        this.style.zIndex = (this.z + 100).toString();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'c-window': WindowElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'c-window': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<WindowElement> & {
                    headerName: string;
                    Id: number;
                    width: number;
                    height: number;
                    left: number;
                    top: number;
                    zIndex: number;
                }
            }
        }
    }
}
