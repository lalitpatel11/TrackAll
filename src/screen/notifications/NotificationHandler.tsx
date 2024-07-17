//external imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {useEffect} from 'react';
//internal imports
import {fcmService} from '../../service/FCMService';

export default function NotificationManager() {
  useEffect(() => {
    fcmService.register(onRegister, onNotification, onOpenNotification);
    fcmService.requestPermission(onRegister);
    async function onRegister(token: string) {
      await AsyncStorage.setItem('fcmToken', token);
    }
    async function onNotification(notify: any) {
      PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        critical: true,
      }).then(
        (data: any) => {
          PushNotificationIOS.addNotificationRequest({
            id: notify.messageId,
            body: notify.notification.body,
            title: notify.notification.title,
          });
          console.log('PushNotificationIOS.requestPermissions', notify);
        },
        (data: any) => {
          console.log('PushNotificationIOS.requestPermissions failed', data);
        },
      );
    }
    async function onOpenNotification(notify: any) {
      //
    }
    return () => {
      fcmService.unRegister();
    };
  });
  return null;
}
