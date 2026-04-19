import {IdentifierFactory} from '../models/model';
import {SingletonStore} from './singlestore';

type StylesIdentifier = IdentifierFactory<'StylesIdentifier'>;

export class StylesBatcher {
    constructor() {

    }

    register() {

    }
};

SingletonStore.setInstance(StylesBatcher, new StylesBatcher())
