import { Maybe } from '@/app/services/interfaces';
import { clamp, SVGXMLNS } from '@/app/utils';

function calcVectorX(value: number) {
    return Math.cos((3 - value * 6) * Math.PI / 4);
}

function calcVectorY(value: number) {
    return Math.sin((3 - value * 6) * Math.PI / 4);
}

const BASE_CURVE_LENGTH = 3 * Math.PI / 2;
const START_ANGLE = 3 * Math.PI / 4;

const MIN_X = calcVectorX(0);
const MIN_Y = calcVectorY(0);

const MAX_X = calcVectorX(-1);
const MAX_Y = calcVectorY(-1);

function normalizeAngle(x: number, y: number, cx: number, cy: number): number {
    const dx = x - cx, dy = y - cy;
    let angle = Math.atan(dx / dy);

    if (dx > 0 && dy >= 0) {
        angle -= Math.PI;
    } else if (dx < 0 && dy >= 0) {
        angle += Math.PI;
    }

    return clamp(angle, -START_ANGLE, START_ANGLE);
}

// Pending: Decide if the radius should listen to change.
export class KnobControlElement extends HTMLElement {
    radius = 0;
    padding = 0;
    val = 0;
    tvalue = 0;
    valueOnHold = 0;
    scrollD = 0;
    verticalHold = 0;
    isHold = false;
    cx = 0;
    cy = 0;
    totalWidth = 0;
    // SVG
    svg = document.createElementNS(SVGXMLNS, 'svg');
    // Ring
    path1 = document.createElementNS(SVGXMLNS, 'path');
    path2 = document.createElementNS(SVGXMLNS, 'path');
    // Circles
    circle1 = document.createElementNS(SVGXMLNS, 'circle');
    circle2 = document.createElementNS(SVGXMLNS, 'circle');
    circle3 = document.createElementNS(SVGXMLNS, 'circle');

    // knob change
    onKnobChange: Maybe<(n: number) => void> = null;
    // knobrelease
    onKnobRelease: Maybe<(n: number) => void> = null;
    // Value mapping
    valueMap: (value: number) => number = (x: number) => x;

    get r() {
        return this.radius;
    }

    set r(rad: number) {
        this.radius = rad;
    }

    get pd() {
        return this.padding;
    }

    set pd(pd: number) {
        this.padding = pd;
    }

    get value() {
        return this.val;
    }

    set value(val: number) {
        this.val = val;
    }

    constructor() {
        super();
        this.svg.setAttribute('xmlns', SVGXMLNS);
    }

    connectedCallback() {
        this.cx = this.r + this.pd;
        this.cy = this.cx;
        this.totalWidth = this.cx * 2;
        this.svg.setAttribute('width', this.totalWidth.toString());
        this.svg.setAttribute('height', this.totalWidth.toString());
        this.classList.add('flex', 'justify-center', 'touch-none');
        this.render();
        this.onmousedown = this.holdKnob.bind(this);
        this.onmousemove = this.moveKnob.bind(this);
    }

    releaseKnob(event: MouseEvent) {
        this.verticalHold = 0;
        this.valueOnHold = 0;
        // this.onKnobRelease && this.onKnobRelease(this.val);
    }

    holdKnob(event: MouseEvent) {
        this.verticalHold = event.offsetY;
        this.valueOnHold = this.val;

        const custom = new CustomEvent('knobChange', {detail: this.val});
        this.dispatchEvent(custom);
        // this.onKnobChange && this.onKnobChange(this.val);
    }

    moveKnob(event: MouseEvent) {
        if (event.buttons === 1) {
            event.preventDefault();
            event.stopPropagation();
            const {offsetY} = event;

            // Some initial value hold should be there.
            const delta = (offsetY - this.verticalHold) / this.totalWidth;
            this.val = clamp(this.valueOnHold + delta, 0, 1);
            // if (this.onKnobChange) {
            const custom = new CustomEvent('knobChange', {detail: this.val});
            this.dispatchEvent(custom);
            // }
            this.changePath();
        }
    }

    // Modify
    changePath() {
        const value = this.val;
        const vx = calcVectorX(-value);
        const vy = calcVectorY(-value);

        const ex = this.cx + (this.r - 8) * vx;
        const ey = this.cy + (this.r - 8) * vy;

        const arcsx = this.cx + (this.r + 6) * MIN_X;
        const arcsy = this.cy + (this.r + 6) * MIN_Y;

        const arcex = this.cx + (this.r + 6) * MAX_X;
        const arcey = this.cy + (this.r + 6) * MAX_Y;

        const arcvx = this.cx + (this.r + 6) * vx;
        const arcvy = this.cy + (this.r + 6) * vy;

        const eyeAngle = START_ANGLE - normalizeAngle(ex, ey, this.cx, this.cy);
        
        this.circle2.setAttribute('cx', ex.toString());
        this.circle2.setAttribute('cy', ey.toString());

        this.path1.setAttribute(
            'd',
            `M${arcsx} ${arcsy} 
            A${this.r + 6} ${this.r + 6} ${BASE_CURVE_LENGTH} 1 1 ${arcex} ${arcey}`
        );

        this.path2.setAttribute(
            'd',
            `M${arcsx} ${arcsy} 
            A${this.r + 6} ${this.r + 6} ${eyeAngle} ${Math.PI < eyeAngle ? '1 1' : '0 1'} ${arcvx} ${arcvy}`
        );
    }

    render() {
        // Arc path that could be filled.
        this.path1.setAttribute('strokeWidth', '2');
        this.path1.setAttribute('stroke', '#666');
        this.path1.setAttribute('fill', 'none');

        // Arc path that is filled with green color.
        this.path2.setAttribute('strokeWidth', '2');
        this.path2.setAttribute('stroke', '#58AB6C');
        this.path2.setAttribute('fill', 'none');
        // this.path1.setAttributeNS(SVGXMLNS, 'd', )
        
        this.svg.appendChild(this.path1);
        this.svg.appendChild(this.path2);

        // Knob like circle
        this.circle1.setAttribute('fill', '#F2F5FC');
        this.circle1.setAttribute('cx', this.cx.toString());
        this.circle1.setAttribute('cy', this.cy.toString());
        this.circle1.setAttribute('r', this.r.toString());

        // Eye pointing to the path
        this.circle2.setAttribute('fill', '#58AB6C');
        this.circle2.setAttribute('cx', this.cx.toString());
        this.circle2.setAttribute('cy', this.cy.toString());
        this.circle2.setAttribute('r', '2');

        // Ring
        this.circle3.setAttribute('fill', 'none');
        this.circle3.setAttribute('stroke', '#999');
        this.circle3.setAttribute('cx', this.cx.toString());
        this.circle3.setAttribute('cy', this.cy.toString());
        this.circle3.setAttribute('r', (this.r - 2).toString());

        this.svg.appendChild(this.circle1);
        this.svg.appendChild(this.circle2);
        this.svg.appendChild(this.circle3);

        this.appendChild(this.svg);
        this.changePath();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'knob-control': KnobControlElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'knob-control': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<KnobControlElement> & {
                    r: number;
                    pd: number;
                    value: number;
                    scrollDelta: number;
                    onKnobChange: (value: number) => void;
                    onKnobRelease: (value: number) => void;
                    map?: (value: number) => number;
                };
            }
        }
    }
}
