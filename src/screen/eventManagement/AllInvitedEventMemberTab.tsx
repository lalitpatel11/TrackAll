// external imports
import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';

const AllInvitedEventMemberTab = ({item}: {item: any}) => {
  return (
    <View style={styles.interestsContainer}>
      {item?.joinedstatus == 2 ? (
        <View style={styles.interestsOrangeTabBorder}>
          {/* user profile image section  */}
          <View style={styles.allMemberContainer}>
            <Image
              resizeMode="contain"
              source={
                item?.profileimage
                  ? {uri: `${item?.profileimage}`}
                  : require('../../assets/pngImage/avatar.png')
              }
              style={styles.addedMemberImage}
            />
          </View>
          {/* user name section */}
          <Text style={styles.addedMemberLabel}>{item?.name}</Text>
        </View>
      ) : (
        <View style={styles.interestsRedTabBorder}>
          {/* user profile image section  */}
          <View style={styles.allMemberContainer}>
            <Image
              resizeMode="contain"
              source={
                item?.profileimage
                  ? {uri: `${item?.profileimage}`}
                  : require('../../assets/pngImage/avatar.png')
              }
              style={styles.addedMemberImage}
            />
          </View>
          {/* user name section */}
          <Text style={styles.addedMemberLabel}>{item?.name}</Text>
        </View>
      )}
    </View>
  );
};

export default AllInvitedEventMemberTab;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 20,
    flexDirection: 'row',
    height: 'auto',
    margin: 5,
  },
  interestsOrangeTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 20,
    borderWidth: 2,
    height: 'auto',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 110,
  },
  interestsRedTabBorder: {
    alignItems: 'center',
    borderColor: colors.RED,
    borderRadius: 20,
    borderWidth: 2,
    height: 'auto',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 110,
  },
  allMemberContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  addedMemberImage: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  addedMemberLabel: {
    color: colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
});
