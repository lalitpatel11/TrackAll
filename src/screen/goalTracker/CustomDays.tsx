import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../constants/ColorConstant';

const CustomDays = ({items}: {items: any}) => {
  return (
    <View style={styles.interestsTabBorder}>
      {items?.day == 'M' ? (
        <Text style={styles.days}>Mon</Text>
      ) : items?.day == 'T' ? (
        <Text style={styles.days}>Tue</Text>
      ) : items?.day == 'W' ? (
        <Text style={styles.days}>Wed</Text>
      ) : items?.day == 'TH' ? (
        <Text style={styles.days}>Thu</Text>
      ) : items?.day == 'F' ? (
        <Text style={styles.days}>Fri</Text>
      ) : items?.day == 'SA' ? (
        <Text style={styles.days}>Sat</Text>
      ) : items?.day == 'SU' ? (
        <Text style={styles.days}>Sun</Text>
      ) : null}
    </View>
  );
};

export default CustomDays;

const styles = StyleSheet.create({
  interestsTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    marginRight: 5,
    width: 40,
  },
  days: {color: colors.WHITE, fontSize: 12, fontWeight: '500'},
});
