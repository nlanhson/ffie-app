// Installe la police par défaut globale (Raleway) avant tout rendu. Doit être
// en premier — elle ré-enveloppe l'export Text de react-native. Voir l'en-tête
// du fichier pour comprendre pourquoi l'ancienne approche Text.defaultProps ne
// fonctionne plus sous React 19.
import './src/theme/installGlobalFont';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent appelle AppRegistry.registerComponent('main', () => App);
// Cela garantit aussi que l'environnement est correctement configuré, que l'on
// charge l'app dans Expo Go ou dans un build natif.
registerRootComponent(App);
