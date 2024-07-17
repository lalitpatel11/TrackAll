//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import CustomHeader from '../../constants/CustomHeader';
import NotificationService from '../../service/NotificationService';
import NotificationTab from './NotificationTab';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';

const Notifications = ({navigation}: {navigation: any}) => {
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    setPageLoader(true);
    getData();
  }, []);

  // function for get all notification data on api call
  const getData = () => {
    NotificationService.getNotification()
      .then((response: any) => {
        setPageLoader(false);
        setAllNotifications(response.data.notification);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for read notification on api call
  const handleReadNotification = (notificationId: number) => {
    NotificationService.getReadNotification(notificationId)
      .then((response: any) => {
        setPageLoader(false);
        getData(); //for refresh the data
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for clear notification on api call
  const handleClearNotification = () => {
    setPageLoader(true);
    NotificationService.getClearAllNotification()
      .then((response: any) => {
        getData(); //for refresh the data
        setPageLoader(false);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };
  // list for notification tab
  const renderNotificationItems = ({item}: {item: any; index: any}) => {
    return (
      <NotificationTab
        items={item}
        navigation={navigation}
        viewNotificationClick={handleReadNotification}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Notifications'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        allNotifications?.length > 0 ? (
          <View style={styles.body}>
            {/* clear all button section  */}
            <TouchableOpacity
              style={styles.clearAllContainer}
              onPress={() => {
                handleClearNotification();
              }}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>

            {/* my groups list  */}
            <FlatList
              data={allNotifications}
              scrollEnabled={true}
              renderItem={renderNotificationItems}
              listKey={'myGroupList'}
              keyExtractor={(item: any, index: any) => String(index)}
            />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <View style={styles.noNotificationImage}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../assets/pngImage/nonotification.png')}
              />
            </View>

            <Text style={styles.heading}>No Notifications Yet</Text>
            <Text style={styles.subHeading}>
              You have Currently no notifications. We'll notify you when
              something new arrives!
            </Text>
            <SubmitButton
              buttonText={'Back to home'}
              submitButton={() => navigation.goBack()}
            />
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK2,
  },
  body: {
    height: '90%',
    padding: 10,
  },
  noDataContainer: {
    backgroundColor: colors.BLACK,
    height: '90%',
    padding: 30,
  },
  noNotificationImage: {
    alignSelf: 'center',
    height: 220,
    justifyContent: 'center',
    marginVertical: 20,
    width: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heading: {
    color: colors.THEME_ORANGE,
    fontSize: 22,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
  },
  subHeading: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  clearAllContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  clearAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    padding: 5,
    textDecorationColor: colors.THEME_ORANGE,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '90%',
    justifyContent: 'center',
  },
});
