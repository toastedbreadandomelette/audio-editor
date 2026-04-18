import { removeRandomWindowId } from '../services/random';
import { SingletonStore } from '../services/singlestore';

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

export type WindowID = symbol & {__brand: 'WID'};

// Returns an Window Identifier on providing a qualifying identifier
// to this function. If not, creates one for you.
export function createIdentifier(id: symbol | undefined = undefined): Identifier {
    if (!id) {
        return Symbol() as Identifier;
    }
    return id as Identifier;
}

export function createWindowId(): WindowID {
    return Symbol() as WindowID;
}

export interface WindowView {
    windowSymbol: WindowID
    header: string
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

export class WindowStore {
    // Map of 
    windowDetails: Map<WindowID, WindowView> = new Map();
    // This decides the z-indexes.
    ordering: Array<WindowID> = [];
    // Fire listener
    register: () => void = () => {};
    // Selected info
    selectedWindowInfo: {
        selected: boolean,
        x: number;
        y: number;
        windowId: WindowID | null,
        element: HTMLElement | null
    } = {
        selected: false,
        x: 0,
        y: 0,
        windowId: null,
        element: null
    };

    constructor() {}

    addWindow(details: WindowView) {
        const {uniqueIdentifier, windowSymbol} = details;

        if (!this.windowDetails.has(windowSymbol)) {
            this.windowDetails.set(windowSymbol, details);
            this.ordering.push(windowSymbol);
            this.register();
            return;
        }
        
        for (const [_, window] of this.windowDetails) {
            if (window.uniqueIdentifier === uniqueIdentifier) {
                const index = this.ordering.indexOf(window.windowSymbol);
                const value = this.ordering.splice(index, 1)[0];
                this.ordering.push(value);
            }
        }

        this.register();
    }

    removeWindow(id: WindowID) {
        const windowView = this.windowDetails.get(id);

        if (windowView) {
            const {windowId} = windowView;            
            const index = this.ordering.findIndex(w => w === id);

            if (index > -1) {
                removeRandomWindowId(windowId);
                this.windowDetails.delete(id);
                this.ordering.splice(index, 1);
            }

            this.register();
            return true;
        }

        return false;
    }

    removeWindowUnchecked(id: WindowID, windowView: WindowView) {
        const {windowId} = windowView;
        const index = this.ordering.findIndex(w => w === id);

        if (index > -1) {
            removeRandomWindowId(windowId);
            this.windowDetails.delete(id);
            this.ordering.splice(index, 1);
        }

        this.register();
        return true;
    }

    removeWindowUniqueIdentifier(id: Identifier) {
        for (const [key, value] of this.windowDetails) {
            if (value.uniqueIdentifier === id) {
                this.removeWindowUnchecked(key, value);
                this.register();
                return;
            }
        }
    }

    batchRemoveWindowWithUniqueIdentifier(ids: Identifier[]) {
        const windowsToRemove: WindowID[] = [];
        for (const [key, value] of this.windowDetails) {
            const {uniqueIdentifier, windowId} = value;
            
            if (ids.indexOf(uniqueIdentifier) > -1) {
                const orderedIndex = this.ordering.indexOf(key);
                windowsToRemove.push(key);
                this.ordering.splice(orderedIndex, -1);
                removeRandomWindowId(windowId);
            }
        }

        for (const id of windowsToRemove) {
            this.windowDetails.delete(id);
        }

        this.register();
    }

    setWindowPosition({x, y, window}: {
        x: number,
        y: number;
        window: WindowID
    }) {
        const windowView = this.windowDetails.get(window);

        if (windowView) {
            windowView.x = x;
            windowView.y = y;
        }

        this.register();
    }
}

const windowStore = new WindowStore();
SingletonStore.setInstance(WindowStore, windowStore);
