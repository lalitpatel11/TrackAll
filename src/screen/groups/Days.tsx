//external imports
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const Days = ({
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
          {item.days}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Days;

const styles = StyleSheet.create({
  selectDaysContainer: {
    backgroundColor: colors.brightGray,
    borderRadius: 10,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    margin: 5,
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 2,
    height: 60,
    justifyContent: 'center',
    width: 65,
  },
  interestsTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 10,
    borderWidth: 2,
    height: 60,
    justifyContent: 'center',
    width: 65,
  },
  checkedIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  interestsTabTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
  },
  interestsTitle: {
    color: colors.THEME_BLACK,
    fontSize: 16,
    fontWeight: '500',
  },
});
