//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//internal imports
import CustomHeader from '../../constants/CustomHeader';
import MyRoutineTab from '../community/MyRoutineTab';
import RoutineService from '../../service/RoutineService';
import {colors} from '../../constants/ColorConstant';

const Routine = ({navigation}: {navigation: any}) => {
  const [myRoutines, setMyRoutines] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);

      // function for get all my routine data on api call
      RoutineService.postAllMyRoutines()
        .then((response: any) => {
          setPageLoader(false);
          setMyRoutines(response.data.myroutines);
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    });
    return unsubscribe;
  }, [navigation]);

  // function for search all my routine data on api call
  const getSearchMyRoutines = (text?: string) => {
    setPageLoader(true);
    const data = {
      search: text,
    };

    RoutineService.postAllMyRoutines(data)
      .then((response: any) => {
        if (response.data.myroutines.length > 0) {
          setNoData(false);
          setMyRoutines(response.data.myroutines);
          setPageLoader(false);
        } else {
          setMyRoutines(response.data.myroutines);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for routines
  const renderRoutineItem = ({item}: {item: any; index: any}) => {
    return <MyRoutineTab item={item} onTabClick={handleOnTabClick} />;
  };

  // navigation on routine details on tab click
  const handleOnTabClick = (communityId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'RoutineDetails',
      params: {id: communityId, screen: 'ROUTINE'},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Routines'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('Home');
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* routines tabs  */}
        <View style={styles.createRoutineContainer}>
          <View style={styles.routineBox}>
            <View style={styles.textContainer}>
              <Text style={styles.textStyle}>Create New Routine</Text>
              <TouchableOpacity
                style={{width: 35}}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'CreateRoutine',
                  });
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/ArrowCircleRight.png')}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Image
                style={styles.image}
                resizeMode="contain"
                source={require('../../assets/pngImage/lifestyle.png')}
              />
              <Image
                style={styles.image}
                resizeMode="contain"
                source={require('../../assets/pngImage/Group.png')}
              />
            </View>
          </View>

          <View style={styles.routineBox}>
            <View style={styles.textContainer}>
              <Text style={styles.textStyle}>Shared Routines</Text>
              <TouchableOpacity
                style={{width: 35}}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'SharedRoutines',
                  });
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/ArrowCircleRight.png')}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Image
                style={styles.image}
                resizeMode="contain"
                source={require('../../assets/pngImage/share.png')}
              />
              <Image
                style={styles.image}
                resizeMode="contain"
                source={require('../../assets/pngImage/ShareNetwork.png')}
              />
            </View>
          </View>
        </View>

        {/* search box */}
        <Text style={styles.routineHeading}>My Routine</Text>
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search Routine By Title"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={(text: string) => {
                setSearchText(text);
                getSearchMyRoutines(text);
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

        {/* My routines start  */}
        {!pageLoader ? (
          myRoutines?.length > 0 ? (
            <View style={styles.displayRoutines}>
              <FlatList
                data={myRoutines}
                renderItem={renderRoutineItem}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>
                  No Routine Created. {'\n'}Click on the "Create New Routine" to
                  create a Routine.
                </Text>
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

export default Routine;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
  createRoutineContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 120,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  routineHeading: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  routineBox: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    flexDirection: 'row',
    height: 110,
    padding: 10,
    width: '48%',
  },
  textContainer: {
    height: 100,
    marginRight: 2,
    right: 0,
    width: '60%',
  },
  textStyle: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    height: 60,
  },
  image: {
    height: 45,
    marginBottom: 3,
    width: 45,
  },
  displayRoutines: {
    height: '65%',
    paddingVertical: 10,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: 100,
  },
  noDataContainer: {
    alignItems: 'center',
    height: '60%',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
