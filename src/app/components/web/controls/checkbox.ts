import { SVGXMLNS } from '@/app/utils';

export class CheckboxElement extends HTMLElement {
    val = false;
    lab = '';
    dis = false;
    svg = document.createElementNS(SVGXMLNS, 'svg');
    rect = document.createElementNS(SVGXMLNS, 'rect');
    anotherRect = document.createElementNS(SVGXMLNS, 'rect');
    labelElement = document.createElement('span');

    set disabled(disabled: boolean) {
        this.dis = disabled;
    }

    get disabled() {
        return this.dis;
    }

    set value(val: boolean) {
        this.val = val;

        this.rect.setAttribute('filter', this.val ? 'url(#f1)' : '');
        if (!this.val) {
            this.anotherRect.classList.add('hidden');
        } else {
            this.anotherRect.classList.remove('hidden');
        }
        this.labelElement.classList.toggle('text-gray-500');
        this.labelElement.classList.toggle('text-white');

        this.classList.toggle('cursor-pointer');
        this.classList.toggle('cursor-not-allowed');
    }

    get value() {
        return this.val;
    }

    set label(lab: string) {
        this.lab = lab;
        this.labelElement.textContent = this.lab;
    }

    get label() {
        return this.lab;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('radio', 'flex', 'self-center', 'h-auto', 'select-none');
        this.svg.setAttribute('width', '14');
        this.svg.setAttribute('height', '14');
        this.svg.classList.add('self-center');
        this.svg.innerHTML = `
            <defs>
                <filter id="f1">
                <feDropShadow floodColor="#82F596" dx="-5" dy="-5" accentHeight="6" stdDeviation="10" floodOpacity="0.5" />
                </filter>
            </defs>
        `;
        this.rect.setAttribute('rx', '3');
        this.rect.setAttribute('ry', '3');
        this.rect.setAttribute('stroke', '#000');
        this.rect.setAttribute('width', '14');
        this.rect.setAttribute('height', '14');
        this.rect.setAttribute('fill', '#555');
        this.rect.setAttribute('filter', this.val ? 'url(#f1)' : '');

        this.anotherRect.setAttribute('x', '2');
        this.anotherRect.setAttribute('y', '2');
        this.anotherRect.setAttribute('width', '10');
        this.anotherRect.setAttribute('height', '10');
        this.anotherRect.setAttribute('rx', '3');
        this.anotherRect.setAttribute('ry', '3');
        this.anotherRect.setAttribute('fill', '#52D566');

        if (!this.val) {
            this.classList.add('cursor-not-allowed');
            this.anotherRect.classList.add('hidden');
        } else {
            this.classList.add('cursor-pointer');
        }

        this.labelElement.classList.add('ml-2', 'text-lg', this.dis ? 'text-gray-500' : 'text-white');
        this.labelElement.textContent = this.lab;
        
        this.svg.appendChild(this.rect);
        this.svg.append(this.anotherRect);
        this.appendChild(this.svg);
        this.appendChild(this.labelElement);
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'checkbox-control': CheckboxElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'checkbox-control': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<CheckboxElement> & {
                    disabled?: boolean;
                    value: boolean;
                    label: string;
                };
            }
        }
    }
}
