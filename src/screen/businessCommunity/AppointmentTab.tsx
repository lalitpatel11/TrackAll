import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../constants/ColorConstant';
import moment from 'moment';

const AppointmentTab = ({items}: {items: any}) => {
  return (
    <View style={styles.container}>
      {/* title section */}
      <View style={styles.direction}>
        <Text style={styles.title}>Title :</Text>
        <Text style={styles.userName}>{items?.title}</Text>
      </View>

      {/* description section */}
      <View style={styles.direction}>
        <Text style={styles.title}>Description :</Text>
        <Text style={styles.userName}>{items?.description}</Text>
      </View>

      {/* date section  */}
      <View style={styles.direction}>
        <Text style={styles.title}>Date :</Text>
        <Text style={styles.userName}>
          {moment(items?.date).format('MM-DD-YYYY')}
        </Text>
      </View>

      {/* Start time section */}
      <View style={styles.direction}>
        <Text style={styles.title}>Start time :</Text>
        <Text style={styles.userName}>{items?.starttime}</Text>
      </View>

      {/* end time section */}
      <View style={styles.direction}>
        <Text style={styles.title}>End time :</Text>
        <Text style={styles.userName}>{items?.endtime}</Text>
      </View>

      {/* status section */}
      {items?.status == '1' ? (
        <View style={styles.direction}>
          <Text style={styles.title}>Status :</Text>
          <Text style={styles.userName}>Pending </Text>
        </View>
      ) : items?.status == '2' ? (
        <View style={styles.direction}>
          <Text style={styles.title}>Status :</Text>
          <Text style={styles.userName}>Accepted </Text>
        </View>
      ) : (
        <View style={styles.direction}>
          <Text style={styles.title}>Status :</Text>
          <Text style={styles.userName}>Rejected </Text>
        </View>
      )}

      {/* reason based on status */}
      {items?.rejectreason != null ? (
        <View style={styles.direction}>
          <Text style={styles.title}>Reject Reason :</Text>
          <Text style={styles.userName}>{items?.rejectreason}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default AppointmentTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    flex: 1,
    marginVertical: 5,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  title: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    fontWeight: '500',
    width: '75%',
  },
});
