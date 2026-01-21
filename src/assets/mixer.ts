import { SVGXMLNS } from '@/app/utils';

export class MixerIconElement extends HTMLElement {
    width = 0;
    height = 0;
    stroke = '#000';

    set w(width: number) {
        this.width = width;
    }

    get w() {
        return this.width;
    }

    set h(height: number) {
        this.height = height;
    }

    get h() {
        return this.height;
    }

    get s() {
        return this.stroke;
    }

    set s(stroke: string) {
        this.stroke = stroke;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <svg xmlns="${SVGXMLNS}" width="${this.width}" height="${this.height}" viewBox="0 0 50 50">
                <path d="M18 40 L18 10 M32 40 L32 10" stroke="${this.stroke}"></path>
                <rect x="11" y="14" width="14" height="6" rx="1" ry="1" fill="#ccc" stroke="${this.stroke}"></rect>
                <path d="M11 17 L25 17" stroke="${this.stroke}"></path>
                <rect x="25" y="28" width="14" height="6" rx="1" ry="1" fill="#ccc" stroke="${this.stroke}"></rect>
                <path d="M25 31 L39 31" stroke="${this.stroke}"></path>
            </svg>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mixer-icon': MixerIconElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'mixer-icon': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<MixerIconElement> & {
                    w: number;
                    h: number;
                    s: string;
                };
            }
        }
    }
}
