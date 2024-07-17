// external imports
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const MyGroupsTab = ({
  items,
  navigation,
  title,
}: {
  items: any;
  navigation: any;
  title: string;
}) => {
  // navigation on group details page on tab click
  const viewGroupDetails = (groupId: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'GroupDetails',
      params: {
        data: groupId,
        name: title,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        viewGroupDetails(items?.groupid);
      }}>
      {/* group title  */}
      <View style={styles.nameContainer}>
        <Text style={styles.groupNameText}>{items?.name}</Text>
        <View style={styles.direction}>
          <Text style={styles.groupIdText}>
            Total group members: {items?.totalgroupmembers}
          </Text>
        </View>

        <View style={styles.direction}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/CalendarBlank.png')}
          />
          <Text style={styles.date}> {items?.created_at}</Text>
        </View>
      </View>

      {/* group image  */}
      {items?.groupimage ? (
        <View style={styles.groupImageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{uri: `${items?.groupimage}`}}
          />
        </View>
      ) : (
        <View style={styles.noGroupImageContainer}>
          <View style={styles.noGroupImage}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/pngImage/noImage.png')}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MyGroupsTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 15,
    width: 'auto',
  },
  nameContainer: {width: '75%'},
  groupNameText: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: '500',
  },
  groupIdText: {
    color: colors.WHITE,
    fontSize: 16,
    paddingVertical: 3,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  date: {color: colors.textGray},
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  groupImageContainer: {
    borderColor: colors.textGray,
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.textGray,
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
});
