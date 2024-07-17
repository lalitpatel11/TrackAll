// external imports
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
// internal imports
import CustomHeader from '../../constants/CustomHeader';
import FilterCommunityModal from './FilterCommunityModal';
import MyRoutineTab from './MyRoutineTab';
import RoutineService from '../../service/RoutineService';
import {colors} from '../../constants/ColorConstant';

const Community = ({navigation}: {navigation: any}) => {
  const [communityRoutines, setCommunityRoutines] = useState<any[]>([]);
  const [filterCommunityModal, setFilterCommunityModal] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      setSearchText('');
    });
    return unsubscribe;
  }, [navigation]);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  // function for get all my community data api call
  const getData = () => {
    setPageLoader(true);
    RoutineService.getAllCommunityRoutines()
      .then((response: any) => {
        setPageLoader(false);
        setCommunityRoutines(response.data.communityroutines);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // function for get all my community routine data api call
  const getAllSearchCommunityRoutines = (text: string) => {
    setPageLoader(true);
    RoutineService.getAllSearchCommunityRoutines(text)
      .then((response: any) => {
        setPageLoader(false);
        if (response.data.communityroutines.length > 0) {
          setCommunityRoutines(response.data.communityroutines);
          setPageLoader(false);
          setNoData(false);
        } else {
          setCommunityRoutines(response.data.communityroutines);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // function for filter community routine api call
  const handleFilterCommunityApplyClick = (
    selectedId: number[],
    selectDate: string,
  ) => {
    const filterData = {
      preference_id: selectedId,
      publish_date: selectDate,
    };

    setFilterCommunityModal(false);
    setPageLoader(true);

    RoutineService.postFilterCommunityRoutines(filterData)
      .then((response: any) => {
        if (response.data.communityroutines.length > 0) {
          setNoData(false);
          setCommunityRoutines(response.data.communityroutines);
          setPageLoader(false);
        } else {
          setCommunityRoutines(response.data.communityroutines);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // function for filter click
  const handleFilterCommunityResetClick = () => {
    setFilterCommunityModal(false);
    getData();
  };

  // list for routine tab
  const renderRoutineItem = ({item}: {item: any; index: any}) => {
    return <MyRoutineTab item={item} onTabClick={handleOnTabClick} />;
  };

  // navigation for community details page
  const handleOnTabClick = (communityId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'CommunityDetails',
      params: {id: communityId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Community'}
        drawerButton={{
          visible: true,
          onClick: () => {
            handleOpenDrawer();
          },
        }}
        bellButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'Notifications',
            });
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        <View>
          <View style={styles.searchBoxContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Search By Title, Sub Title And Description"
                placeholderTextColor={colors.textGray}
                style={styles.searchInput}
                value={searchText}
                onChangeText={(text: string) => {
                  setSearchText(text);
                  getAllSearchCommunityRoutines(text);
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => {
                setFilterCommunityModal(true);
              }}>
              <Image
                resizeMode="contain"
                source={require('../../assets/pngImage/filter.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.publishedRoutineContainer}>
          <Text style={styles.publishedRoutineTitle}>Published Routines</Text>
          <TouchableOpacity
            style={styles.createContainer}
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'CreateRoutine',
                params: {screenName: 'COMMUNITY'},
              });
            }}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/Add.png')}
            />
            <Text style={styles.createTitle}>Create Routine</Text>
          </TouchableOpacity>
        </View>

        {/* body section  */}
        {!pageLoader ? (
          communityRoutines?.length > 0 ? (
            <View style={styles.publishedRoutinesBox}>
              <FlatList
                data={communityRoutines}
                renderItem={renderRoutineItem}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>
                  No Routine Created. {'\n'}Click on the "+ Create Routine" to
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

      {/* FilterCommunityModal modal  */}
      <FilterCommunityModal
        visibleModal={filterCommunityModal}
        onClose={() => {
          setFilterCommunityModal(false);
        }}
        onSubmitClick={handleFilterCommunityApplyClick}
        onResetClick={handleFilterCommunityResetClick}
      />
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  publishedRoutineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  publishedRoutineTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  createContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  createTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingLeft: 5,
  },
  publishedRoutinesBox: {
    height: '83%',
    paddingBottom: 30,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 14,
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
});
