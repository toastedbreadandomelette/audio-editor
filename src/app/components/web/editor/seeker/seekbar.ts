import { SVGXMLNS } from '@/app/utils';

declare global {
    interface HTMLElementTagNameMap {
        'c-seekbar': SeekbarElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'c-seekbar': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<SeekbarElement> & {
                    totalLines: number;
                }
            }
        }
    }
}

export class SeekbarElement extends HTMLElement {
    timelime = document.createElementNS(SVGXMLNS, 'svg');
    totalBars = 0;

    get totalLines() {
        return this.totalBars;
    }

    set totalLines(totalLines: number) {
        this.totalBars = totalLines;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('relative', 'overflow-hidden', 'bg-darker', 'rounded-sm');
        this.classList.add('rounded-sm', 'z-[12]', 'border-t', 'border-b', 'border-solid');
        this.classList.add('border-darker-2', 'cursor-pointer', 'shadow=bg');
    }
}
