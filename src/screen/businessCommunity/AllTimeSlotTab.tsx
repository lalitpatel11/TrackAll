// external imports
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const AllTimeSlotTab = ({
  items,
  selectTimeSLot,
}: {
  items: any;
  selectTimeSLot: Function;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        selectTimeSLot(items);
      }}>
      {/* service title  */}
      <View style={styles.nameContainer}>
        <Text style={styles.timeText}>
          {items?.slot_start_time} - {items?.slot_end_time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AllTimeSlotTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    width: 'auto',
    elevation: 2,
  },
  nameContainer: {width: '85%'},
  timeText: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    paddingVertical: 3,
  },
});
