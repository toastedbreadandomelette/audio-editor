import { clamp, SVGXMLNS } from '@/app/utils';

export class SliderControlElement extends HTMLElement {
    width = 100;
    height = 30;
    padding = 10;
    strokeWidth = 3;
    val = 0;
    headw = 20;
    headh = 10;
    s = '#2135EF';

    set sliderWidth(s: number) {
        this.headw  = s;
    }

    get sliderWidth() {
        return this.headw;
    }

    set sliderHeight(h: number) {
        this.headh = h;
    }

    get sliderHeight() {
        return this.headh;
    }

    svg = document.createElementNS(SVGXMLNS, 'svg');
    path1 = document.createElementNS(SVGXMLNS, 'path');
    path2 = document.createElementNS(SVGXMLNS, 'path');
    rect1 = document.createElementNS(SVGXMLNS, 'rect');
    rect2 = document.createElementNS(SVGXMLNS, 'rect');
    rect3 = document.createElementNS(SVGXMLNS, 'rect');
    g = document.createElementNS(SVGXMLNS, 'g');

    get stroke() {
        return this.s;
    }

    set stroke(s: string) {
        this.s = s;
    }

    get value() {
        return this.val;
    }

    set value(val: number) {
        this.val = val;
        this.updateSlider();
    }

    get w() {
        return this.width;
    }

    get sw() {
        return this.strokeWidth;
    }

    set sw(strokeWidth: number) {
        this.strokeWidth = strokeWidth;
    }

    set w(width: number) {
        this.width = width;
    }

    get h() {
        return this.height;
    }

    set h(height: number) {
        this.height = height;
    }

    set pd(padding: number) {
        this.padding = padding;
    }

    get pd() {
        return this.padding;
    }

    constructor() {
        super();
    }

    updateSlider() {
        const level = this.height - this.value * this.height;
        this.path2.setAttribute(
            'd', 
            `M${this.width / 2} ${this.height + this.padding / 2} L ${this.width / 2} ${level}`
        );

        this.g.children[0].setAttribute('y', level.toString());
        this.g.children[1].setAttribute('y', (level + 2).toString());
        this.g.children[2].setAttribute('y', (level + 4).toString());
    }

    connectedCallback() {
        this.classList.add('slider', 'flex', 'flex-row', 'justify-center');
        this.svg.setAttribute('width', this.width.toString());
        this.svg.setAttribute('height', (this.height + this.padding).toString());

        this.path1.setAttribute('stroke', '#888');
        this.path1.setAttribute('stroke-width', this.strokeWidth.toString());
        this.path2.setAttribute('stroke-width', this.strokeWidth.toString());

        this.path1.setAttribute('stroke', '#888');
        this.path2.setAttribute('stroke', this.s);

        const level = this.height - this.value * this.height;
        this.path1.setAttribute(
            'd', 
            `M${this.width / 2} ${this.height + this.padding / 2} L ${this.width / 2} 0`
        );
        this.path2.setAttribute(
            'd', 
            `M${this.width / 2} ${this.height + this.padding / 2} L ${this.width / 2} ${level}`
        );

        this.g.append(...this.createGroup(level, this.headh, this.headw));

        this.svg.appendChild(this.path1);
        this.svg.appendChild(this.path2);
        this.svg.appendChild(this.g);
        this.appendChild(this.svg);
        this.addEventListener('wheel', this.onScroll.bind(this), {passive: false});
        this.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(e: MouseEvent) {
        if (e.buttons === 1) {
            const y = e.offsetY;
            
            const normalizedValue = clamp(
                (this.height + (this.sliderHeight / 2) - y) / this.height, 
                0,
                1
            );

            this.value = normalizedValue;
            this.updateSlider();
        }
    }

    onScroll(e: WheelEvent) {
        e.preventDefault();
        const {deltaY} = e;
    
        // TODO: Simplify this.
        const direction = (deltaY !== 0 ? (-deltaY / Math.abs(deltaY)) : 0);
        const newValue = clamp(this.value + direction * 0.05, 0, 1);
    
        this.value = newValue;
        this.updateSlider(); 
    }

    disconnectedCallback() {
        this.removeEventListener('wheel', this.onScroll.bind(this));
    }

    createRect(x: string, level: string, fill: string, sheight: string, width: string) {
        const rect = document.createElementNS(SVGXMLNS, 'rect');
        rect.setAttribute('rx', '3');
        rect.setAttribute('ry', '3');
        rect.setAttribute('x', x);
        rect.setAttribute('height', sheight);
        rect.setAttribute('width', width);
        rect.setAttribute('fill', fill);
        rect.setAttribute('y', level);

        return rect;
    }

    createGroup(level: number, sliderHeight: number, sliderWidth: number) {
        const rect1 = this.createRect(
            '0', level.toString(), '#666', sliderHeight.toString(), sliderWidth.toString() 
        );
        const rect2 = this.createRect(
            '2', (level + 2).toString(), '#ccc', (sliderHeight - 4).toString(), (sliderWidth - 4).toString()  
        );
        const rect3 = this.createRect(
            '4', (level + 4).toString(), '#eee', (sliderHeight - 8).toString(), (sliderWidth - 8).toString()  
        );

        return [rect1, rect2, rect3];
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'slider-control': SliderControlElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'slider-control': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<SliderControlElement> & {
                    w: number;
                    h: number;
                    pd: number;
                    stroke?: string;
                    value?: number;
                    sw?: number;
                    sliderWidth?: number;
                    sliderHeight?: number;

                    onSliderChange?: (value: number) => void;
                    onSliderRelease?: (value: number) => void;
                    map?: (value: number) => number;
                };
            }
        }
    }
}
