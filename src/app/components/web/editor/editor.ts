export class EditorElement extends HTMLElement {
    constructor() {
        super();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'c-editor': EditorElement
    }
}
