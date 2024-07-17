// external imports
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const SearchEventAddress = ({
  item,
  onAddressClick,
}: {
  item: any;
  onAddressClick: any;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.commonStyle}>
          {/* image section  */}
          <View style={styles.userImageContainer}>
            <Image
              resizeMode="contain"
              style={styles.userImage}
              source={
                item.icon
                  ? {uri: `${item.icon}`}
                  : require('../../assets/pngImage/avatar.png')
              }
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            onAddressClick(item);
          }}
          style={styles.textNameStyle}>
          <Text style={styles.eventAddressText}>{item?.name}</Text>
          <Text style={styles.eventAddressTextFormatted}>
            {item?.formatted_address}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchEventAddress;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingVertical: 10,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  commonStyle: {
    justifyContent: 'center',
    marginRight: 10,
  },
  userImageContainer: {
    borderRadius: 100,
    height: 30,
    width: 30,
  },
  userImage: {
    borderRadius: 100,
    height: 30,
    width: 30,
  },
  eventAddressText: {
    color: colors.WHITE,
    fontWeight: 'bold',
    marginHorizontal: 6,
    textTransform: 'capitalize',
  },
  eventAddressTextFormatted: {
    color: colors.THEME_WHITE,
    marginHorizontal: 6,
    textTransform: 'capitalize',
  },
  textNameStyle: {
    justifyContent: 'center',
  },
});
