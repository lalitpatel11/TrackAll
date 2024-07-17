//external imports
import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
//internal imports
import Months from './Months';
import Years from './Years';

const BudgetaryMonths = ({
  monthList,
  year,
  setMonthArrayList,
  setMonthChecked,
  setYearList,
  setYearChecked,
  monthArrayList,
  monthChecked,
  yearList,
  yearChecked,
}: {
  monthList?: any;
  year?: any;
  setMonthArrayList: Function;
  setMonthChecked: Function;
  setYearList: Function;
  setYearChecked: Function;
  monthArrayList: any;
  monthChecked: boolean;
  yearList: any;
  yearChecked: boolean;
}) => {
  useEffect(() => {
    if (monthList?.length >= 1) {
      setMonthArrayList(monthList);
      setYearList(year);
    }
  }, []);

  const months = [
    {id: 1, title: 'Jan', value: '01'},
    {id: 2, title: 'Feb', value: '02'},
    {id: 3, title: 'Mar', value: '03'},
    {id: 4, title: 'Apr', value: '04'},
    {id: 5, title: 'May', value: '05'},
    {id: 6, title: 'Jun', value: '06'},
    {id: 7, title: 'Jul', value: '07'},
    {id: 8, title: 'Aug', value: '08'},
    {id: 9, title: 'Sep', value: '09'},
    {id: 10, title: 'Oct', value: '10'},
    {id: 11, title: 'Nov', value: '11'},
    {id: 12, title: 'Dec', value: '12'},
  ];

  const years = [
    {id: 1, value: '2020'},
    {id: 2, value: '2021'},
    {id: 3, value: '2022'},
    {id: 4, value: '2023'},
    {id: 5, value: '2024'},
    {id: 6, value: '2025'},
    {id: 7, value: '2026'},
    {id: 8, value: '2027'},
    {id: 9, value: '2028'},
    {id: 10, value: '2029'},
    {id: 11, value: '2030'},
    {id: 12, value: '2031'},
  ];
  // list for custom months
  const renderMonths = ({item}: {item: any; index: any}) => {
    return (
      <Months
        item={item}
        handleChecked={handleMonthChecked}
        checked={monthChecked}
        checkedList={monthArrayList}
      />
    );
  };

  // function on select months
  const handleMonthChecked = (selectedId: number) => {
    setMonthChecked(true);
    if (monthArrayList.includes(selectedId)) {
      setMonthArrayList(
        monthArrayList.filter((ids: number) => ids !== selectedId),
      );
    } else {
      setMonthArrayList([...monthArrayList, selectedId]);
    }
  };

  // list for custom months
  const renderYears = ({item}: {item: any; index: any}) => {
    return (
      <Years
        item={item}
        handleChecked={handleYearChecked}
        checked={yearChecked}
        checkedList={yearList}
      />
    );
  };

  // function on select months
  const handleYearChecked = (selectedId: number) => {
    setYearChecked(true);
    setYearList([selectedId]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={months}
        renderItem={renderMonths}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: any, index: any) => String(index)}
      />
      <FlatList
        data={years}
        renderItem={renderYears}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: any, index: any) => String(index)}
      />
    </View>
  );
};

export default BudgetaryMonths;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    justifyContent: 'center',
  },
});
