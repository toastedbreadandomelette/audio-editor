export class WindowHeaderElement extends HTMLElement {
    headerTool = document.createElement('div');
    // minimize = document.createElement('');
    exitIcon = document.createElement('exit-icon');

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
        this.classList.add('header-content', 'select-none', 'px-3', 'py-2');
        this.classList.add('text-lg', 'rounded-ss-sm', 'w-full', 'text-left');

        this.headerTool.appendChild(this.exitIcon);
        // this.headerTool.appendChild()
    }
}
