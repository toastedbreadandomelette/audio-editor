import { SVGXMLNS } from "@/app/utils";

export class PlayIconElement extends HTMLElement {
    width = 0;
    height = 0;
    stroke = '#000';
    fill = '#FFF';

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
        this.innerHTML = `
            <svg xmlns=${SVGXMLNS} width=${this.w} height=${this.h} viewBox="0 0 40 40">
                <path 
                fill=${this.f}
                stroke=${this.s} 
                d="M 2 4 C 3.5 3.5, 3.5 3.5, 4 4 L 36 18 C 38 19, 38 21, 36 22 L 4 36 C 2.5 36.5, 2.5 36.5, 2 36 L 2 4"
                ></path>
            </svg>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'play-icon': PlayIconElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'play-icon': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<PlayIconElement> & {
                    w: number;
                    h: number;
                    s: string;
                    f: string;
                };
            }
        }
    }
}