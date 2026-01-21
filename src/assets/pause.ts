import { SVGXMLNS } from "@/app/utils";

export class PauseIconElement extends HTMLElement {
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
        this.innerHTML = `<svg xmlns=${SVGXMLNS} width=${this.w} height=${this.h} viewBox="0 0 80 80">
            <path 
            fill=${this.f}
            stroke=${this.s}
            strokeWidth="2"
            d="M 12 2 C 18 0, 24 0, 30 2 L 30 78 C 24 80, 18 80, 12 78 L 12 2
                M 68 2 C 62 0, 56 0, 50 2 L 50 78 C 56 80, 62 80, 68 78 L 68 2"
            ></path>
        </svg>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pause-icon': PauseIconElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'pause-icon': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<PauseIconElement> & {
                    w: number;
                    h: number;
                    s: string;
                    f: string;
                };
            }
        }
    }
}
