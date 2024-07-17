import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../constants/ColorConstant';

const YearAndMonth = ({items, monthYear}: {items: any; monthYear: any}) => {
  return (
    <View style={styles.container}>
      {monthYear == 'Y' ? (
        <Text style={styles.monthYearName}>{items?.year}</Text>
      ) : null}

      {monthYear == 'M' ? (
        <View style={{flexDirection: 'row'}}>
          {items?.month == '01' ? (
            <Text style={styles.monthYearName}>Jan</Text>
          ) : items?.month == '02' ? (
            <Text style={styles.monthYearName}>Feb</Text>
          ) : items?.month == '03' ? (
            <Text style={styles.monthYearName}>Mar</Text>
          ) : items?.month == '04' ? (
            <Text style={styles.monthYearName}>Apr</Text>
          ) : items?.month == '05' ? (
            <Text style={styles.monthYearName}>May</Text>
          ) : items?.month == '06' ? (
            <Text style={styles.monthYearName}>Jun</Text>
          ) : items?.month == '07' ? (
            <Text style={styles.monthYearName}>Jul</Text>
          ) : items?.month == '08' ? (
            <Text style={styles.monthYearName}>Aug</Text>
          ) : items?.month == '09' ? (
            <Text style={styles.monthYearName}>Sep</Text>
          ) : items?.month == '10' ? (
            <Text style={styles.monthYearName}>Oct</Text>
          ) : items?.month == '11' ? (
            <Text style={styles.monthYearName}>Nov</Text>
          ) : items?.month == '12' ? (
            <Text style={styles.monthYearName}>Dec</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default YearAndMonth;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthYearName: {
    color: colors.THEME_ORANGE,
    fontSize: 12,
    fontWeight: '500',
    borderColor: colors.THEME_ORANGE,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
    paddingHorizontal:3
  },
});
