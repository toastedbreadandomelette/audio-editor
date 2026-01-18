import { SVGXMLNS } from '@/app/utils';

const TIME_LABEL_DISTANCE_THRESHOLD = 50;

export class TimelineElement extends HTMLElement {
    totalBars = 0;
    width = 0;
    height = 0;
    lineDist = 0;
    timeUnit = 5;
    labelTimeMultiplier = 1;
    isInit = false;

    selectedRegion = document.createElementNS(SVGXMLNS, 'rect');
    svg = document.createElementNS(SVGXMLNS, 'svg');

    set w(w: number) {
        this.width = w;
        this.svg.setAttribute('width', this.width.toString());
    }

    get w() {
        return this.width;
    }

    set h(h: number) {
        this.height = h;
        this.svg.setAttribute('height', this.height.toString());
    }

    get h() {
        return this.height;
    }

    get totalLines() {
        return this.totalBars;
    }

    set totalLines(totalLines: number) {
        // Before setting, we should make sure we're adding or removing.
        const lineDifference = totalLines - this.totalBars;
        if (!this.isConnected) {
            this.totalBars = totalLines;
            return;
        }
        if (lineDifference > 0) {
            this.addMoreTime(this.totalBars, lineDifference);
        } else {
            this.removeTime(-lineDifference);
        }
        this.totalBars = totalLines;
    }

    get timePerUnitLine() {
        return this.timeUnit;
    }

    set timePerUnitLine(timeUnit: number) {
        this.timeUnit = timeUnit;
    }

    set lineDistance(lineDist: number) {
        this.lineDist = lineDist;
        this.labelTimeMultiplier = Math.ceil(TIME_LABEL_DISTANCE_THRESHOLD / lineDist);
        this.updateTextLeft();
    }

    get lineDistance() {
        return this.lineDist;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        // Selected region TODO
        if (!this.isInit) {
            this.svg.appendChild(this.createBulkText(this.totalBars));
            this.isInit = true;
        }
        this.appendChild(this.svg);
    }

    private updateTextLeft() {
        for (let index = 0; index < this.svg.children.length; ++index) {
            const child = this.svg.children[index];
            child.setAttribute('dx', ((index + 1) * this.lineDist * this.labelTimeMultiplier).toString());
        }
    }

    renderSelectedRegionOptional() {

    }

    private createBulkText(total: number) {
        const frag = document.createDocumentFragment();

        for (let index = 0; index < total; ++index) {
            const time = (index + 1) * this.timeUnit * this.labelTimeMultiplier;
            const currMinute = Math.floor(time / 60);
            const currSecond = Math.floor(time) % 60;

            const text = document.createElementNS(SVGXMLNS, 'text');
            text.classList.add('select-none');
            text.setAttribute('fill', '#ccc');
            text.setAttribute('strokeWidth', '1');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '16');
            text.setAttribute('dy', '25');
            text.setAttribute('dx', ((index + 1) * this.lineDist * this.labelTimeMultiplier).toString());
            text.innerHTML = `${(currMinute < 10 ? "0" : "") + currMinute}:${(currSecond < 10 ? "0" : "") + currSecond}`;

            frag.appendChild(text);
        }

        return frag;
    }

    addMoreTime(totalCurrent: number, additional: number) {
        for (let index = totalCurrent; index < totalCurrent + additional; ++index) {
            const time = (index + 1) * this.timeUnit * this.labelTimeMultiplier;
            const currMinute = Math.floor(time / 60);
            const currSecond = Math.floor(time) % 60;

            const text = document.createElementNS(SVGXMLNS, 'text');
            text.classList.add('select-none');
            text.setAttribute('fill', '#ccc');
            text.setAttribute('strokeWidth', '1');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '16');
            text.setAttribute('dy', '25');
            text.setAttribute('dx', ((index + 1) * this.lineDist * this.labelTimeMultiplier).toString());
            text.textContent = `${(currMinute < 10 ? "0" : "") + currMinute}:${(currSecond < 10 ? "0" : "") + currSecond}`;

            this.svg.appendChild(text);
        }
    }

    removeTime(q: number) {
        while (q > 0) {
            this.svg.removeChild(this.svg.children[this.svg.children.length - 1]);
            --q;
        }
    }

    constructText() {
        
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'seek-timeline': TimelineElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'seek-timeline': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<TimelineElement> & {
                    w: number;
                    h: number;
                    totalLines: number;
                    lineDistance: number;
                    regionSelection?: {
                        startRegion: number;
                        endRegion: number;
                    }
                }
            }
        }
    }
}
