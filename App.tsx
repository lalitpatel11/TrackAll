// external imports
import {NavigationContainer} from '@react-navigation/native';
// import {StripeProvider} from '@stripe/stripe-react-native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-view';
// internal imports
import RootStackNavigator from './src/navigation/RootNavigator';
import NotificationManager from './src/screen/notifications/NotificationHandler';
// import NotificationManager from './src/screen/notifications/NotificationHandler';
import {withIAPContext} from 'react-native-iap';
const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
          hidden={false}
        />
        {/* <SafeAreaView style={{flex: 1}}> */}

        {/* <StripeProvider
            // publishableKey="pk_test_51M6gXYIzevfykrU30akAFEXajQ3G0RIMAGLvXTVXOOQMtGYgp8nq1saKSS0KJBSrAPLthLgoeRcZXjlMOmu5xh6l00blkdTPBo" //client key
            publishableKey="pk_test_51M5NiCKOaKOOtboN3REUKe429yQYUCsPC1yt1MURyZkcbrNYBwJHPkQ8EW9hhZDCmITQxYk7943GXTfPka0BnJm500z5cL9Dzd" //local key
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
          > */}
        <NativeBaseProvider>
          <NavigationContainer>
            <NotificationManager />
            <RootStackNavigator />
          </NavigationContainer>
        </NativeBaseProvider>
        {/* </StripeProvider> */}
        {/* </SafeAreaView> */}
      </SafeAreaProvider>
    </>
  );
};

export default withIAPContext(App);
