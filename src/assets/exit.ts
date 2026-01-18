import { SVGXMLNS } from '@/app/utils';

export class ExitIconElement extends HTMLElement {
    width = 0;
    height = 0;
    f = '#000';

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

    set fill(fill: string) {
        this.f = fill;
    }

    get fill() {
        return this.f;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        const svg = document.createElementNS(SVGXMLNS, 'svg');
        svg.setAttribute('width', this.width.toString());
        svg.setAttribute('height', this.height.toString());
        svg.setAttribute('viewBox', '0 0 20 20');

        const path = document.createElementNS(SVGXMLNS, 'path');
        path.setAttribute('stroke-width', '5');
        path.setAttribute('stroke', this.f);
        path.setAttribute('d', 'M 0 0 L 20 20 M 20 0 L 0 20');

        svg.appendChild(path);
        this.appendChild(svg);
    }

    disconnectedCallback() {
        this.remove();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'exit-icon': ExitIconElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'exit-icon': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<ExitIconElement> & {
                    w: number;
                    h: number;
                    fill: string;
                };
            }
        }
    }
}
