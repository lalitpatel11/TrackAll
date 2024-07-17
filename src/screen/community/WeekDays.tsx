// external imports
import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const WeekDays = ({
  checkedList,
  items,
  selectedDate,
}: {
  checkedList: number[];
  items: any;
  selectedDate: Function;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        selectedDate(items);
      }}
      style={
        checkedList?.includes(items['2'])
          ? styles.borderContainer
          : styles.container
      }>
      <Text style={styles.days}>{items['1']}</Text>
      <Text style={styles.date}>{items['2']}</Text>
    </TouchableOpacity>
  );
};

export default WeekDays;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    height: 70,
    justifyContent: 'center',
    margin: 5,
    width: 60,
  },
  borderContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 2,
    height: 70,
    justifyContent: 'center',
    margin: 5,
    width: 60,
  },
  days: {color: colors.THEME_BLACK, fontSize: 14, fontWeight: '500'},
  date: {color: colors.THEME_ORANGE, fontSize: 24, fontWeight: '500'},
});
