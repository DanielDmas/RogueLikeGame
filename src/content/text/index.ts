// Bootstraps the text catalog: importing these registers every translation/
// alternate-version entry (side effect) before the app renders anything.
import './v1-en';
import './v1-en-dynamic';
import './v1-en-usher';
import './cs';
import './fa';

export * from './resolver';
export * from './keys';
