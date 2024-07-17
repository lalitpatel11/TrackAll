/**
 * @format
 */

import App from './App';
import {AppRegistry} from 'react-native';
import {LogBox} from 'react-native';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);

//import : react components
//import : custom components
//import : third parties
//import : utils
//import : modals
//import : redux
