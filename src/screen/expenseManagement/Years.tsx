//external imports
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const Years = ({
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
    <View style={styles.selectDaysContainer}>
      <TouchableOpacity
        style={
          checkedList.includes(item.value)
            ? checked
              ? styles.interestsTabBorder
              : styles.interestsTab
            : styles.interestsTab
        }
        onPress={() => {
          handleChecked(item.value);
        }}>
        {checkedList.includes(item.value) ? (
          checked ? (
            <Image
              style={styles.checkedIcon}
              resizeMode="contain"
              source={require('../../assets/pngImage/checked.png')}
            />
          ) : null
        ) : null}

        <Text
          style={
            checkedList.includes(item.value)
              ? checked
                ? styles.interestsTabTitle
                : styles.interestsTitle
              : styles.interestsTitle
          }>
          {item.value}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Years;

const styles = StyleSheet.create({
  selectDaysContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    margin: 5,
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 60,
  },
  interestsTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 60,
  },
  checkedIcon: {
    position: 'absolute',
    right: 2,
    top: 2,
    zIndex: 1,
  },
  interestsTabTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  interestsTitle: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    fontWeight: '500',
  },
});
