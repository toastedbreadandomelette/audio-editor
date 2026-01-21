
export enum HorizontalAlignment {
  Center,
  Left,
  Right,
}

export enum VerticalAlignment {
  Center,
  Top,
  Bottom,
}

type Identifier = symbol & { __brand: 'ID' };

type WindowID = symbol & {__brand: 'WID'};

export function createIdentifier(): Identifier {
    return Symbol() as Identifier;
}

export function createWindowId(): WindowID {
    return Symbol() as WindowID;
}

export interface WindowView {
  windowSymbol: WindowID
  header: string | HTMLElement
  view: HTMLElement
  w?: number
  h?: number
  x: number
  y: number
  visible: boolean
  overflow?: boolean
  /**
   * @description To maintain window that is unique to an opened entity, an 
   * identifier is supplied, so that there are no duplicate window for 
   * same thing the user opens (for e.g., for scheduled track, 
   * it would be `trackDetail.scheduledKey`).
   */
  uniqueIdentifier: Identifier
  horizontalAlignment?: HorizontalAlignment
  verticalAlignment?: VerticalAlignment
  windowId: number
}

type WindowContents = {
  [k: WindowID]: WindowView 
};

export type InitialType = {
  contents: WindowContents,
  ordering: Array<WindowID>
};

export class WindowManagement {
    // Map of 
    windowDetails: WindowContents = {}
    // This decides the z-indexes.
    ordering: Array<WindowID> = [];

    constructor() {

    }

    static contains(windowDetails: WindowContents, id: WindowID) {
        return Object.hasOwn(windowDetails, id);
    }

    addWindow(details: WindowView) {
        const {uniqueIdentifier} = details;

        for (const key of Object.getOwnPropertySymbols(this.windowDetails)) {
            const window = this.windowDetails[key as WindowID];
            if (window.uniqueIdentifier === uniqueIdentifier) {
                const index = this.ordering.indexOf(window.windowSymbol);
                const value = this.ordering.splice(index, 1)[0];
                this.ordering.push(value);
            }
        }
    }
}
