import { SVGXMLNS } from "@/app/utils";

export class WaveIconElement extends HTMLElement {
    width = 0;
    height = 0;
    viewBox = '';
    stroke = '#000';
    fill = '#FFF';

    set vb(viewBox: string) {
        this.viewBox = viewBox;
    }

    get vb() {
        return this.viewBox;
    }

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

    get f() {
        return this.fill;
    }

    set f(fill: string) {
        this.fill = fill;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('inline');
        this.innerHTML = `
            <svg xmlns="${SVGXMLNS}" style="display: inline" width="${this.width}" height="${this.height}" viewBox="${this.vb}">
                <g fill="none" fillRule="evenodd" stroke="${this.stroke}" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6.5 8.5v4"/>
                <path d="m8.5 6.5v9"/>
                <path d="m10.5 9.5v2"/>
                <path d="m12.5 7.5v6.814"/>
                <path d="m14.5 4.5v12"/>
                </g>
            </svg>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'wave-icon': WaveIconElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'wave-icon': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<WaveIconElement> & {
                    w: number;
                    h: number;
                    s: string;
                    vb: string;
                };
            }
        }
    }
}
