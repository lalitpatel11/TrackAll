// external imports
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const RecentlyAddedEventMembersTab = ({item}: {item: any}) => {
  return (
    <View style={styles.interestsContainer}>
      <View style={styles.interestsTab}>
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
        <Text style={styles.addedMemberLabel}>{item?.name}</Text>

        {/*users event location section */}
        {/* {item?.status == '1' ? (
          <View style={styles.atTheLocationStatus}>
            <View style={styles.locationIconContainer}>
              <Image
                  resizeMode="contain"
                style={styles.image}
                source={require('../../assets/pngImage/location.png')}
              />
            </View>
            <Text style={styles.locationStatus}>At the event now</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.requestLocationStatus}>
            <View style={styles.locationIconContainer}>
              <Image
                  resizeMode="contain"
                tintColor={colors.BLACK}
                style={styles.image}
                source={require('../../assets/pngImage/location.png')}
              />
            </View>
            <Text style={styles.requestLocation}>Request location</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
};

export default RecentlyAddedEventMembersTab;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 20,
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'flex-start',
    margin: 5,
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.GREEN,
    borderRadius: 20,
    borderWidth: 1,
    height: 'auto',
    justifyContent: 'flex-start',
    padding: 5,
    width: 100,
  },
  allMemberContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.THEME_WHITE,
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  addedMemberImage: {
    borderRadius: 50,
    width: '100%',
    height: '100%',
  },
  addedMemberLabel: {
    bottom: 0,
    color: colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  atTheLocationStatus: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    elevation: 5,
    flexDirection: 'row',
    height: 18,
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  locationIconContainer: {
    borderRadius: 50,
    height: 15,
    marginLeft: 5,
    width: 15,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  locationStatus: {
    color: colors.THEME_BLACK,
    fontSize: 10,
    fontWeight: '400',
  },
  requestLocationStatus: {
    alignItems: 'center',
    backgroundColor: colors.lightOrange,
    borderRadius: 20,
    elevation: 5,
    flexDirection: 'row',
    height: 18,
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  requestLocation: {
    color: colors.BLACK,
    fontSize: 10,
    fontWeight: '400',
  },
});
