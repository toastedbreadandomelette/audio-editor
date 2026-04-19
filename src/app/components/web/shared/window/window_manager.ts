import { SingletonStore } from '@/app/services/singlestore';
import {
    WindowStore,
    WindowView,
    HorizontalAlignment,
    VerticalAlignment 
} from '@/app/states/window_store';
import { WindowElement } from './window';

const DEFAULT_HEIGHT = 720;
const DEFAULT_WIDTH = 1280;

export class WindowManagerElement extends HTMLElement {
    windowStore = SingletonStore.getInstance(WindowStore);
    movingWindow: WindowView | null = null;
    anchorX = 0;
    anchorY = 0;
    winAnchorX = 0;
    winAnchorY = 0;

    // The attribute should resolve the attributes
    // and update the UI instead of just
    // removing and adding them again.
    windowChange() {
        this.resetPosition();
    }

    resetPosition() {
        const windowOrdering = this.windowStore.ordering;

        windowOrdering.forEach((id, index) => {
            const windowView = this.windowStore.windowDetails.get(id)!;
            let already = false;
            
            for (const window of this.children) {
                const win = window as WindowElement;
                if (win.window === windowView) {
                    already = true;
                    break;
                }
            }

            if (!already) {
                const window = this.createWindow(windowView, index);
                window.setInner(windowView.view);
                window.onClose = (e) => {
                    this.windowStore.removeWindow(id);
                };
                this.appendChild(window);
            }
        });
    }

    // Use transform instead of left and top
    setAnchor(e: MouseEvent, win: WindowView) {
        const {clientX, clientY} = e;
        this.anchorX = clientX;
        this.anchorY = clientY;
        this.winAnchorX = win.x;
        this.winAnchorY = win.y;
    }

    moveFromAnchorPosition(e: MouseEvent, win: WindowElement) {
        const {clientX, clientY} = e;
        const newPosX = clientX - this.anchorX;
        const newPosY = clientY - this.anchorY;
        win.left = this.winAnchorX + newPosX;
        win.top = this.winAnchorY + newPosY;
    }

    removeAnchor(e: MouseEvent, win: WindowView, el: WindowElement) {
        this.movingWindow = null;
        this.anchorX = 0;
        this.anchorY = 0;
        this.winAnchorX = 0;
        this.winAnchorY = 0;
        const view = this.windowStore.windowDetails.get(win.windowSymbol);

        if (view) {
            view.x = el.left;
            view.y = el.top;
            win.x = el.left;
            win.y = el.top;
        }
    }

    constructor() {
        super();
        this.windowStore.register = this.windowChange.bind(this);
    }

    // This should inject all the view into 
    // main body.
    connectedCallback() {
        this.resetPosition();
    }

    createWindow(window: WindowView, index: number) {
        const win = document.createElement('c-window');
        win.h = window.h || DEFAULT_HEIGHT;
        win.w = window.w || DEFAULT_WIDTH;
        win.px = window.x;
        win.py = window.y;
        win.Id = index;
        win.horizontal = window.horizontalAlignment || HorizontalAlignment.Left;
        win.vertical = window.verticalAlignment || VerticalAlignment.Top;
        win.overflowX = window.overflow || false;
        win.z = index;
        win.headerName = window.header;
        win.sym = window.windowSymbol;
        win.window = window;

        win.onWindowGrabbed = this.setAnchor.bind(this);
        win.onWindowLeave = this.removeAnchor.bind(this);
        win.onWindowMoved = this.moveFromAnchorPosition.bind(this)

        return win;
    }

    disconnectedCallback() {}
}

declare global {
    interface HTMLElementTagNameMap {
        'window-manager': WindowManagerElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'window-manager': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<WindowManagerElement>
            }
        }
    }
}
