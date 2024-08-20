import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../constants/ColorConstant';
import CustomHeader from '../../constants/CustomHeader';
import GoalTrackerService from '../../service/GoalTrackerService';
import GoalTrackerTabs from './GoalTrackerTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllGoals = ({navigation}: {navigation: any}) => {
  const [goals, setGoals] = useState([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //   setPageLoader(true);
      setSearchText('');
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all note data on api call
  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');

    if (userType == '2') {
      const body = {
        accountId: accountId,
      };

      GoalTrackerService.getAllGoal(body)
        .then((response: any) => {
          setPageLoader(false);
          setGoals(response.data.goals);
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log(error);
        });
    } else {
      GoalTrackerService.getAllGoal()
        .then((response: any) => {
          setPageLoader(false);
          setGoals(response.data.goals);
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log(error);
        });
    }
  };

  // function for search all community data on api call
  const searchGoal = async (text: string) => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    setPageLoader(true);

    const data = new FormData();
    data.append('search', text);

    if (userType == '2') {
      data.append('accountId', accountId);
    }

    GoalTrackerService.getSearchAllGoal(data)
      .then((response: any) => {
        if (response.data.goals.lenght > 0) {
          setGoals(response.data.goals);
          setPageLoader(false);
          setNoData(false);
        } else {
          setGoals(response.data.goals);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for all goals
  const renderGoalsItem = ({item}: {item: any; index: any}) => {
    return <GoalTrackerTabs item={item} onTabClick={handleViewGoal} />;
  };

  // navigation for notes details on notes tab click
  const handleViewGoal = (goalId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'GoalTrackerDetails',
      params: {id: goalId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Goal Tracker'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* search box */}
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search Goals By Name"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                searchGoal(text);
              }}
            />
          </View>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require('../../assets/pngImage/searchIcon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {goals?.length > 0 ? (
        <>
          <Text style={styles.goalHeading}>All Goals</Text>

          <View style={styles.goalContainer}>
            <FlatList
              data={goals}
              renderItem={renderGoalsItem}
              numColumns={2}
              keyExtractor={(item: any, index: any) => String(index)}
            />
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          {!noData ? (
            <Text style={styles.noDataText}>
              No Goals Created. {'\n'}Click on the "Create Icon" to create a
              Goal.
            </Text>
          ) : (
            <Text style={styles.noDataText}>No Result Found</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AllGoals;

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
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalHeading: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  allGoals: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingLeft: 5,
    marginRight: 10,
  },
  goalContainer: {
    flex: 1,
    marginBottom: 10,
    paddingBottom: 10,
    paddingVertical: 5,
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
  },
});
