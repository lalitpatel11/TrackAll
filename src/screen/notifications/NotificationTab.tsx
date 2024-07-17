//external imports
import React from 'react';
import moment from 'moment';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const NotificationTab = ({
  items,
  navigation,
  viewNotificationClick,
}: {
  items: any;
  navigation: any;
  viewNotificationClick: Function;
}) => {
  // change date formate
  const notificationTime = moment(items?.date).startOf('second').fromNow();

  return (
    <>
      {items.status === 1 ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            viewNotificationClick(items.id);
          }}>
          {/* group title  */}
          <View style={styles.nameContainer}>
            <Text style={styles.date}>{notificationTime}</Text>

            <Text style={styles.notificationText}>{items?.message}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.readContainer}>
          {/* group title  */}
          <View style={styles.nameContainer}>
            <Text style={styles.date}>{notificationTime}</Text>

            <Text style={styles.notificationText}>{items?.message}</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default NotificationTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  readContainer: {
    backgroundColor: colors.brightGray,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  nameContainer: {width: '100%'},
  notificationText: {
    color: colors.THEME_BLACK,
    fontSize: 16,
  },
  date: {
    color: colors.textGray,
    fontSize: 14,
    textAlign: 'right',
  },
});
