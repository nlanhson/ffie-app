// Install the global default font (Raleway) before anything renders. Must be
// first — it re-wraps react-native's Text export. See the file header for why
// the old Text.defaultProps approach no longer works under React 19.
import './src/theme/installGlobalFont';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
