//external imports
import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
//internal imports
import Years from './Years';

const BudgetaryYears = ({
  yearList,
  setYearArrayList,
  setYearArrayChecked,
  yearArrayList,
  yearArrayChecked,
}: {
  yearList?: any;
  setYearArrayList: Function;
  setYearArrayChecked: Function;
  yearArrayList: any;
  yearArrayChecked: boolean;
}) => {
  useEffect(() => {
    if (yearList?.length >= 1) {
      setYearArrayList(yearList);
    }
  }, []);

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

  // list for custom years
  const renderYears = ({item}: {item: any; index: any}) => {
    return (
      <Years
        item={item}
        handleChecked={handleYearChecked}
        checked={yearArrayChecked}
        checkedList={yearArrayList}
      />
    );
  };

  // function on select months
  const handleYearChecked = (selectedId: number) => {
    setYearArrayChecked(true);
    if (yearArrayList.includes(selectedId)) {
      setYearArrayList(
        yearArrayList.filter((ids: number) => ids !== selectedId),
      );
    } else {
      setYearArrayList([...yearArrayList, selectedId]);
    }
  };

  return (
    <View style={styles.container}>
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

export default BudgetaryYears;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    justifyContent: 'center',
  },
});
