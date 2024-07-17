// external imports
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BarChart} from 'react-native-gifted-charts';
import {useIsFocused} from '@react-navigation/native';
// internal imports
import AddExpansesButton from './AddExpansesButton';
import AddedBudgetaryTab from './AddedBudgetaryTab';
import AddedExpensesTab from './AddedExpensesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import RecentMonthData from './RecentMonthData';
import {colors} from '../../constants/ColorConstant';

const ExpenseManagement = ({navigation}: {navigation: any}) => {
  const [barData, setBarData] = useState<any[]>([]);
  const [budgetaryData, setBudgetaryData] = useState({});
  const [budgetaryId, setBudgetaryId] = useState(0);
  const [budgetaryRestriction, setBudgetaryRestriction] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [expansesDetails, setExpansesDetails] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
  const [warningModal, setWarningModal] = useState(false);
  const isFocus = useIsFocused();
  const toastRef = useRef<any>();

  useEffect(() => {
    setPageLoader(true);
    getData();
    getBudgetaryData();
    return () => {
      stateBlank(); // to set graph state empty
    };
  }, [isFocus == true]);

  //function to set graph state empty
  const stateBlank = () => {
    setBarData([]);
  };

  // function for get all expense data on api call
  const getData = async () => {
    ExpensesManagementService.postExpanseManagementHome()
      .then((response: any) => {
        setExpansesDetails(response?.data);
        if (barData.length > 0) {
        } else {
          for (let index = 0; index < 12; index++) {
            const pData = {
              value: parseFloat(response?.data?.previousyeardata[index]?.value),
              label: response?.data?.previousyeardata[index]?.label,
              spacing: 2,
              labelWidth: 40,
              labelTextStyle: {color: colors.WHITE},
              frontColor: colors.brightGray,
            };
            barData.push(pData);

            const cData = {
              value: parseFloat(response?.data?.currentyeardata[index]?.value),
              frontColor: colors.THEME_ORANGE,
            };
            barData.push(cData);
            setBarData([...barData]);
          }
        }
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for all months
  const renderRecentMonths = ({item}: {item: any; index: any}) => {
    return <RecentMonthData items={item} />;
  };

  // function for get all budgetary data on api call
  const getBudgetaryData = () => {
    ExpensesManagementService.postListBudgetaryRestriction()
      .then((response: any) => {
        setPageLoader(false);
        setBudgetaryRestriction(response.data.budgetaryrestrication);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for all expenses
  const renderAddedExpenses = ({item}: {item: any; index: any}) => {
    return <AddedExpensesTab items={item} />;
  };

  // list for all budgetary
  const renderAddedBudgetary = ({item}: {item: any; index: any}) => {
    return (
      <AddedBudgetaryTab
        items={item}
        addExpensesClick={handleAddExpensesClick}
        viewDetailsClick={handleViewDetailsClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    );
  };

  // navigation on add expense click
  const handleAddExpensesClick = (item: any) => {
    if (item?.percentage >= 100) {
      setWarningModal(true);
      setBudgetaryData(item);
    } else {
      navigation.navigate('StackNavigation', {
        screen: 'AddExpense',
        params: {
          data: item,
        },
      });
    }
  };

  // navigation on view expense click
  const handleViewDetailsClick = (item: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'ViewExpanses',
      params: {
        data: item,
      },
    });
  };

  // navigation on edit budgetary click
  const handleEditClick = (data: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EditBudgetary',
      params: {
        data: data,
      },
    });
  };

  // function for open modal on delete icon click
  const handleDeleteClick = (id: any) => {
    setDeleteModal(true);
    setBudgetaryId(id);
  };

  // function for delete button click on api call to delete budgetary
  const handleDelete = () => {
    setDeleteModal(false);
    ExpensesManagementService.getDeleteBudgetaryRestriction(budgetaryId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getBudgetaryData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Expenses'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('BottomNavigator', {
              screen: 'Home',
            });
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <>
          {expansesDetails !== null ? (
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              style={styles.container}>
              <View style={styles.body}>
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Overview</Text>
                </View>

                {/* month wise data */}
                {expansesDetails?.monthwisedata?.length > 0 ? (
                  <View style={styles.expansesContainer}>
                    <FlatList
                      data={expansesDetails?.monthwisedata}
                      renderItem={renderRecentMonths}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                ) : (
                  <View style={styles.expansesContainer}>
                    <Text style={styles.noExpansesText}>No Data added.</Text>
                  </View>
                )}

                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Recent Expenses</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'AllExpenses',
                      });
                    }}>
                    {expansesDetails?.expenses?.length > 0 ? (
                      <Text style={styles.addEditText}>View All</Text>
                    ) : null}
                  </TouchableOpacity>
                </View>

                {/*recently added expanses section  */}
                {expansesDetails?.expenses?.length > 0 ? (
                  <View style={styles.expansesContainer}>
                    <FlatList
                      data={expansesDetails?.expenses}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderAddedExpenses}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                ) : (
                  <View style={styles.expansesContainer}>
                    <Text style={styles.noExpansesText}>
                      No Recently Expenses Added.
                    </Text>
                  </View>
                )}

                {/* graph section */}
                {barData?.length > 0 ? (
                  <View style={{marginTop: 15, paddingBottom: 20}}>
                    {barData?.length > 0 ? (
                      <BarChart
                        data={barData}
                        barWidth={10}
                        spacing={25}
                        roundedTop
                        roundedBottom
                        hideRules
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{color: colors.WHITE}}
                        stepValue={2000}
                        maxValue={10000}
                        noOfSections={5}
                        yAxisLabelTexts={['0', '2k', '4k', '6k', '8k', '10k']}
                        height={170}
                        width={300}
                      />
                    ) : null}

                    {/* current and previous year indication section */}
                    <View style={styles.graphLabelContainer}>
                      <View style={styles.graphDirection}>
                        <View style={styles.graphLabelColor1} />
                        <Text style={styles.graphLabelText}>
                          Year {expansesDetails?.previousyear}
                        </Text>
                      </View>
                      <View style={styles.graphDirection}>
                        <View style={styles.graphLabelColor2} />
                        <Text style={styles.graphLabelText}>
                          Year {expansesDetails?.currentyear}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}

                {budgetaryRestriction?.length > 0 ? (
                  <>
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Recent Budget</Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('StackNavigation', {
                            screen: 'AddedBudgetary',
                          });
                        }}>
                        <Text style={styles.addEditText}>View All</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.container}>
                      <FlatList
                        data={budgetaryRestriction}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderAddedBudgetary}
                        keyExtractor={(item: any, index: any) => String(index)}
                      />
                    </View>
                  </>
                ) : null}
              </View>

              {/* Delete alert modal for delete budgetary */}
              <DeleteAlertModal
                visibleModal={deleteModal}
                onRequestClosed={() => {
                  setDeleteModal(false);
                }}
                onPressRightButton={() => {
                  handleDelete();
                }}
                subHeading={'Are you sure you want to delete this budgetary ?'}
              />

              {/* Delete alert modal for limit cross alert*/}
              <DeleteAlertModal
                visibleModal={warningModal}
                onRequestClosed={() => {
                  setWarningModal(false);
                }}
                onPressRightButton={() => {
                  setWarningModal(false);
                  navigation.navigate('StackNavigation', {
                    screen: 'AddExpense',
                    params: {
                      data: budgetaryData,
                    },
                  });
                }}
                subHeading={
                  'You have exceed the budgetary limit. Are you sure you want add expense ?'
                }
              />

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </ScrollView>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No Budget Data Created. {'\n'}Click on the "+" icon to create a
                Budget.
              </Text>
            </View>
          )}

          {/* create expense icon  */}
          <View style={styles.createIconContainer}>
            <AddExpansesButton navigation={navigation} />
          </View>
        </>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </View>
  );
};

export default ExpenseManagement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 5,
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
  },
  expansesContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 195,
    justifyContent: 'center',
    marginVertical: 5,
  },
  noExpansesText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
  },
  month: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  selectedDate: {
    backgroundColor: colors.THEME_ORANGE,
    color: colors.WHITE,
  },
  createIconContainer: {
    bottom: 30,
    position: 'absolute',
    right: 40,
    zIndex: 1,
  },
  graphLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  graphDirection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  graphLabelColor1: {
    backgroundColor: colors.brightGray,
    borderRadius: 6,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  graphLabelColor2: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 6,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  graphLabelText: {
    color: colors.WHITE,
    fontSize: 14,
    paddingBottom: 5,
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
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
  },
});
