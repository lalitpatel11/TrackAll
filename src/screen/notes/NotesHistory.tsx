//external imports
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
//internal imports
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';

const NotesHistory = ({route, navigation}: {route: any; navigation: any}) => {
  const [notesId, setNotesId] = useState(route?.params?.data);
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNotesId(route?.params?.data);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = () => {};

  return (
    <View style={styles.container}>
      <CustomHeader
        headerText={'Notes History'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      <View style={styles.body}>
        {!pageLoader ? (
          <>
            {/* comment details  */}
            <View style={styles.taskNameContainer}>
              <Text style={styles.taskTitle}>Notes Name:</Text>
              <Text style={styles.taskName}>Nottttt</Text>
            </View>
          </>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}
      </View>
    </View>
  );
};

export default NotesHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: 10,
  },
  taskNameContainer: {
    flexDirection: 'row',
    width: '95%',
  },
  taskTitle: {
    color: colors.BLACK,
    fontSize: 20,
    fontWeight: '500',
    paddingRight: 10,
  },
  taskName: {
    color: colors.THEME_GRAY,
    fontSize: 20,
    width: '60%',
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
