//external imports
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const RecentlyAddedMembersTab = ({item}: {item: any}) => {
  return (
    <View style={styles.interestsContainer}>
      <View style={styles.interestsTab}>
        <Image
          style={styles.checkedIcon}
          resizeMode="contain"
          tintColor={item?.joinedstatus == 1 ? colors.RED : colors.THEME_ORANGE}
          source={require('../../assets/pngImage/checked.png')}
        />
        <View style={styles.allMemberContainer}>
          <Image
            resizeMode="contain"
            source={
              item?.profile_image
                ? {uri: `${item?.profile_image}`}
                : require('../../assets/pngImage/avatar.png')
            }
            style={styles.addedMemberImage}
          />
        </View>
        <Text style={styles.addedMemberLabel}>{item.name}</Text>
      </View>
    </View>
  );
};

export default RecentlyAddedMembersTab;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.BLACK3,
    borderRadius: 20,
    borderWidth: 2,
    height: 'auto',
    maxHeight: 110,
    justifyContent: 'center',
    padding: 5,
    width: 105,
  },
  checkedIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  allMemberContainer: {
    alignContent: 'center',
    alignSelf: 'center',
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
    bottom: 0,
    color: colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
});
