import {
    WindowView,
    VerticalAlignment,
    HorizontalAlignment,
    WindowID
} from '@/app/states/window_store';

// TODO: creating custom events
export class WindowElement extends HTMLElement {
    px = 0;
    py = 0;
    w = 0;
    h = 0;
    z = 0;
    horizontal: HorizontalAlignment = HorizontalAlignment.Left;
    vertical: VerticalAlignment = VerticalAlignment.Top;
    overX: boolean = false;
    _id = -1;
    sym: WindowID = Symbol() as WindowID;
    window: WindowView | null = null;

    _onClose: (window: WindowView | null) => void = () => {};

    windowTitle = '';

    slotElement = document.createElement('slot');
    header = document.createElement('window-header');

    set onClose(onClose: (window: WindowView | null) => void) {
        this._onClose = onClose;
    }

    get onClose() {
        return this._onClose;
    }

    get winSym() {
        return this.sym;
    }

    set winSym(sym: WindowID) {
        this.sym = sym;
    }

    get overflowX() {
        return this.overX;
    }

    set overflowX(overX: boolean) {
        this.overX = overX;
    }
    
    get hAlign() {
        return this.horizontal;
    }

    set hAlign(horizontal: HorizontalAlignment) {
        this.horizontal = horizontal;
    }

    get vAlign() {
        return this.vertical;
    }

    set vAlign(vertical: VerticalAlignment) {
        this.vertical = vertical;
    }
    
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

    removeSelf() {
        this.window?.view.remove();
        this.remove();
    }

    setInner(element: HTMLElement) {
        if (!this.slotElement.children.length) {
            this.slotElement.appendChild(element);
            return;
        }
        if (this.slotElement.children[0] !== element) {
            this.slotElement.children[0] = element;
        }
    }

    connectedCallback() {
        // this.attachShadow({mode: 'open'});
        this.classList.add('absolute', 'border-2', 'flex', 'flex-col', 'border-solid');
        this.classList.add('border-slate-800', 'rounded-sm', 'z-[100]', 'transition-shadow');
        this.classList.add('ease-in-out', 'shadow-black');

        this.setDimensions();
        this.setPosition();
        this.setZIndex();
        this.setAttribute('data-windowid', this._id.toString());
        this.appendChild(this.header);
        
        // TODO: Resizing; change pointer types.
        // const slotWrapper = document.createElement('div');
        this.slotElement.classList.add('content', 'flex', 'bg-primary', 'w-full');
        this.slotElement.classList.add('h-full', 'rounded-es-sm', 'rounded-ee-sm');
        
        if (this.overX) {
            this.slotElement.classList.add('overflow-x-scroll');
        }

        this.header.onExit = () => {
            this.onClose(this.window);
            this.removeSelf();
        }

        this.appendChild(this.slotElement);
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
                    hAlign: HorizontalAlignment;
                    vAlign: VerticalAlignment;
                    overflowX: boolean;
                    onClose: (window: WindowView | null) => void
                }
            }
        }
    }
}
