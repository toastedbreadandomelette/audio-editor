import { SVGXMLNS } from '@/app/utils';

export class SeekbarElement extends HTMLElement {
    timelime = document.createElementNS(SVGXMLNS, 'svg');
    totalBars = 0;
    lineDist = 0;
    width = 0;
    height = 0;

    seekTimeline = document.createElement('seek-timeline');
    svg = document.createElementNS(SVGXMLNS, 'svg');
    pattern = document.createElementNS(SVGXMLNS, 'pattern');
    rect = document.createElementNS(SVGXMLNS, 'rect');
    firstPath: SVGPathElement = document.createElementNS(SVGXMLNS, 'path');

    get lineDistance() {
        return this.lineDist;
    }

    set lineDistance(lineDist: number) {
        this.lineDist = lineDist;
        this.pattern.setAttribute('width', this.lineDist.toString());
        this.firstPath.setAttribute('d', `M${this.lineDist / 2} 23 L${this.lineDist / 2} 30`);
        this.seekTimeline.lineDistance = this.lineDistance;
    }
    
    get w() {
        return this.width;
    }

    set w(width: number) {
        this.width = width;
        this.svg.setAttribute('width', this.width.toString());
        this.rect.setAttribute('width', this.width.toString());
        this.seekTimeline.w = this.width;
    }

    get h() {
        return this.height;
    }

    set h(height: number) {
        this.height = height;
        this.seekTimeline.h = this.height;
    }

    get totalLines() {
        return this.totalBars;
    }

    set totalLines(totalLines: number) {
        this.totalBars = totalLines;
        this.seekTimeline.totalLines = this.totalLines;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('relative', 'block', 'overflow-hidden', 'bg-darker', 'rounded-sm');
        this.classList.add('rounded-sm', 'z-[12]', 'border-t', 'border-b', 'border-solid');
        this.classList.add('border-darker-2', 'cursor-pointer', 'shadow-bg');

        this.createSeekTimeline();
        this.svg.setAttribute('width', this.width.toString());
        this.svg.setAttribute('height', '30');

        const def = this.createTimeMarkerPattern();

        const rect = this.rect;
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', this.width.toString());
        rect.setAttribute('height', '30');
        rect.setAttribute('fill', 'url(#repeatedSeekbarLines)');

        this.svg.appendChild(def);
        this.svg.appendChild(rect);
        this.appendChild(this.seekTimeline);
        this.appendChild(this.svg);
    }

    createTimeMarkers() {
        const def = document.createElementNS(SVGXMLNS, 'rect');
        this.createTimeMarkerPattern();
        def.appendChild(this.pattern);

        return def;
    }

    createTimeMarkerPattern() {
        const pattern = this.pattern;
        pattern.setAttribute('id', 'repeatedSeekbarLines');
        pattern.setAttribute('x', '0');
        pattern.setAttribute('y', '0');
        pattern.setAttribute('width', this.lineDist.toString());
        pattern.setAttribute('height', '30');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('patternContentUnits', 'userSpaceOnUse');

        const path1 = this.firstPath;
        path1.setAttribute('d', `M${this.lineDist / 2} 23 L${this.lineDist / 2} 30`);
        path1.setAttribute('stroke', `#777`);
        path1.setAttribute('stroke-width', '2');

        const path2 = document.createElementNS(SVGXMLNS, 'path');
        path2.setAttribute('d', `M0 15 L0 30`);
        path2.setAttribute('stroke', `#777`);
        path2.setAttribute('stroke-width', '4');

        pattern.appendChild(path1);
        pattern.appendChild(path2);

        return pattern;
    }

    createSeekTimeline() {
        const seekTimeline = this.seekTimeline;
        seekTimeline.w = this.width;
        seekTimeline.h = this.height;
        seekTimeline.totalLines = this.totalBars;
        seekTimeline.lineDistance = this.lineDist;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'c-seekbar': SeekbarElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'c-seekbar': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<SeekbarElement> & {
                    w: number;
                    h: number;
                    lineDistance: number;
                    totalLines: number;
                };
            }
        }
    }
}
