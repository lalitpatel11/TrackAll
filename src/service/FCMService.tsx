//external imports
import messaging from '@react-native-firebase/messaging';

class FCMService {
  register = (
    onRegister: any,
    onNotification: any,
    onOpenNotification: any,
  ) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  // function for check permission
  checkPermission = (onRegister: any) => {
    messaging()
      .hasPermission()
      .then((enabled: any) => {
        console.info('Permission :::', enabled);
        if (enabled === messaging.AuthorizationStatus.AUTHORIZED) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch((err: any) => {
        this.checkPermission(onRegister);
        console.error('FCM Service : Permission rejected: ', err);
      });
  };

  // function for get fcm token
  getToken = (onRegister: any) => {
    messaging()
      .getToken()
      .then((fcmToken: any) => {
        if (fcmToken) {
          console.log('fcmToken====', fcmToken);
          onRegister(fcmToken);
        } else {
          console.debug('FCMService: user doesnot have the fcm token');
        }
      })
      .catch((err: any) => {
        console.error('FCMService: get token rejected: ', err);
      });
  };

  // function for request permission
  requestPermission = (onRegister: any) => {
    messaging()
      .requestPermission({sound: false, announcement: true})
      .then((res: any) => {
        if (res === 0) {
          console.debug('Notification permission denied:', res);
        } else {
          this.getToken(onRegister);
        }
      })
      .catch((error: any) => {
        console.error('FCMService: request permission rejected: ', error);
      });
  };

  // function for delete token
  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch((error: any) => {
        console.error('FCMService: delete token rejected: ', error);
      });
  };

  // function for notification listener
  createNotificationListeners = (
    onRegister: any,
    onNotification: any,
    onOpenNotification: any,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      console.debug(
        'FCMService: When the application is running, but in the background: ',
        JSON.stringify(remoteMessage),
      );
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
      }
    });

    // When the application is opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          console.debug('remoteMessage', remoteMessage);
          onOpenNotification(remoteMessage);
        }
      });

    //Message handled in the background
    messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
      console.debug('Message handled in the background!', remoteMessage);
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });

    // Foreground state message
    this.messageListener = messaging().onMessage(async (remoteMessage: any) => {
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh((fcmToken: any) => {
      console.debug('FCMService: refreshed token: ', fcmToken);
      if (fcmToken) {
        onRegister(fcmToken);
      }
    });
  };

  unRegister = () => {
    this.messageListener;
  };
  messageListener: (() => void) | undefined;
}

export const fcmService = new FCMService();
