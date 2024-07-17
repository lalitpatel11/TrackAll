//external imports
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const AllMembersTab = ({
  checked,
  checkedList,
  handleChecked,
  item,
}: {
  checked: boolean;
  checkedList: number[];
  handleChecked: Function;
  item: any;
}) => {
  return (
    <View style={styles.interestsContainer}>
      {item?.joinedstatus == 2 ? (
        <TouchableOpacity
          activeOpacity={1}
          style={
            checkedList.includes(item.id)
              ? checked
                ? styles.interestsOrangeTabBorder
                : styles.interestsTab
              : styles.interestsTab
          }
          onPress={() => {
            handleChecked(item.id, item);
          }}>
          {checkedList.includes(item.id) ? (
            checked ? (
              <Image
                style={styles.checkedIcon}
                resizeMode="contain"
                source={require('../../assets/pngImage/checked.png')}
              />
            ) : null
          ) : null}

          {/* invited text according to registered user on app  */}
          <View>
            <Text style={styles.notJoinedStatus}>{item?.joinedstatustext}</Text>
          </View>

          {/* user profile image section  */}
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
          {/* user name section */}
          <Text style={styles.addedMemberLabel}>{item?.name}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          style={
            checkedList.includes(item.id)
              ? checked
                ? styles.interestsRedTabBorder
                : styles.interestsTab
              : styles.interestsTab
          }
          onPress={() => {
            handleChecked(item.id, item);
          }}>
          {checkedList.includes(item.id) ? (
            checked ? (
              <Image
                style={styles.checkedIcon}
                tintColor={colors.RED}
                resizeMode="contain"
                source={require('../../assets/pngImage/checked.png')}
              />
            ) : null
          ) : null}

          {/* invited text according to registered user on app  */}
          <View>
            <Text style={styles.notJoinedStatus}>{item?.joinedstatustext}</Text>
          </View>

          {/* user profile image section  */}
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

          {/* user name section */}
          <Text style={styles.addedMemberLabel}>{item?.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AllMembersTab;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.brightGray,
    borderRadius: 20,
    flexDirection: 'row',
    height: 'auto',
    margin: 5,
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.brightGray,
    borderRadius: 20,
    borderWidth: 2,
    height: 'auto',
    justifyContent: 'flex-start',
    padding: 3,
    width: 105,
  },
  interestsOrangeTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 20,
    borderWidth: 2,
    height: 'auto',
    justifyContent: 'flex-start',
    padding: 3,
    width: 105,
  },
  interestsRedTabBorder: {
    alignItems: 'center',
    borderColor: colors.RED,
    borderRadius: 20,
    borderWidth: 2,
    height: 'auto',
    justifyContent: 'flex-start',
    padding: 3,
    width: 105,
  },
  checkedIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  joinedStatus: {
    color: colors.GREEN,
    fontSize: 14,
    fontWeight: '500',
  },
  notJoinedStatus: {
    color: colors.RED,
    fontSize: 14,
    fontWeight: '500',
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
    color: colors.BLACK,
    fontSize: 16,
    textAlign: 'center',
  },
});
