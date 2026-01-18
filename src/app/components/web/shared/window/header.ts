export class WindowHeaderElement extends HTMLElement {
    header = document.createElement('div');
    headerTool = document.createElement('div');
    minimize = document.createElement('div');
    exitIcon = document.createElement('div');
    windowName = '';

    onExit: (() => void) | null = null;
    onMinimize: (() => void) | null = null;

    set headerName(title: string) {
        this.windowName = title;
        this.header.innerHTML = this.windowName;
    }

    get headerName() {
        return this.windowName;
    }

    constructor() {
        super();   
    }

    setCursorGrab() {
        this.classList.remove('cursor-grab');
        this.classList.add('cursor-grabbing');
    }

    unsetCursorGrab() {
        this.classList.remove('cursor-grab');
        this.classList.add('cursor-grabbing');
    }

    connectedCallback() {
        this.classList.add('topbar', 'bg-secondary', 'flex', 'flex-row', 'justify-between');
        this.header.classList.add('header-content', 'select-none', 'px-3', 'py-2');
        this.header.classList.add('text-lg', 'rounded-ss-sm', 'w-full', 'text-left');

        this.headerTool.classList.add('flex', 'flex-row', 'rounded-se-sm');
        
        this.minimize.classList.add('text-bold', 'px-3', 'text-xs', 'text-center');
        this.minimize.classList.add('w-full', 'h-full', 'content-center', 'text-yellow-500', 'cursor-pointer', 'hover:text-yellow-600');
        this.minimize.innerHTML = '_';

        this.exitIcon.classList.add('px-3', 'text-center', 'w-full', 'h-full');
        this.exitIcon.classList.add('content-center', 'bg-red-500', 'cursor-pointer', 'hover:bg-red-600');

        const exitIcon = document.createElement('exit-icon');
        exitIcon.w = 10;
        exitIcon.h = 10;
        exitIcon.fill = 'white';
        this.exitIcon.appendChild(exitIcon);

        this.header.innerHTML = this.headerName;
        this.headerTool.appendChild(this.minimize);
        this.headerTool.appendChild(this.exitIcon);
        this.appendChild(this.header);
        this.appendChild(this.headerTool);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'window-header': WindowHeaderElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'window-header': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<WindowHeaderElement> & {
                    headerName: string
                }
            }
        }
    }
}
