//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import CustomHeader from '../../constants/CustomHeader';
import MyRoutineTab from '../community/MyRoutineTab';
import RoutineService from '../../service/RoutineService';
import {colors} from '../../constants/ColorConstant';

const SharedRoutines = ({navigation}: {navigation: any}) => {
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sharedRoutines, setSharedRoutines] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      // function for get all shared data on api call
      RoutineService.getAllSharedRoutines()
        .then((response: any) => {
          setPageLoader(false);
          setSharedRoutines(response.data.allroutines);
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    });
    return unsubscribe;
  }, [navigation]);

  // function for search all community data on api call
  const searchSharedRoutine = (text: string) => {
    setPageLoader(true);
    RoutineService.getSearchSharedRoutines(text)
      .then((response: any) => {
        if (response.data.allroutines.length > 0) {
          setNoData(false);
          setSharedRoutines(response.data.allroutines);
          setPageLoader(false);
        } else {
          setSharedRoutines(response.data.allroutines);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for shared routine tab
  const renderShareRoutineItem = ({item}: {item: any; index: any}) => {
    return <MyRoutineTab item={item} onTabClick={handleOnTabClick} />;
  };

  // navigation on routine details on tab click
  const handleOnTabClick = (routineId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'SharedRoutineDetails',
      params: {id: routineId, screen: 'SHAREDROUTINE'},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Shared Routines'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('Home');
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search Routine By Name"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={(text: string) => {
                setSearchText(text);
                searchSharedRoutine(text);
              }}
            />
          </View>

          <View style={styles.searchContainer}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/searchIcon.png')}
            />
          </View>
        </View>

        {/* shared routing list  */}
        {!pageLoader ? (
          sharedRoutines?.length > 0 ? (
            <View style={{height: '90%'}}>
              <FlatList
                data={sharedRoutines}
                renderItem={renderShareRoutineItem}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>No Routine Shared Yet.</Text>
              ) : (
                <Text style={styles.noDataText}>No Result Found</Text>
              )}
            </View>
          )
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}
      </View>
    </View>
  );
};

export default SharedRoutines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  body: {
    padding: 10,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  morningRoutineContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
    padding: 5,
  },
  createRoutineContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  createRoutineIcon: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 20,
    padding: 5,
    width: 20,
  },
  createRoutineText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingLeft: 5,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderRadius: 8,
    width: '83%',
  },
  searchInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
    paddingLeft: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    justifyContent: 'center',
    width: '14%',
  },
  noDataContainer: {
    alignItems: 'center',
    height: '90%',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: 150,
  },
});
