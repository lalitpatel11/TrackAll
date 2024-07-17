// external imports
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
// import Slider from '@react-native-community/slider';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import AddCategoryModal from './AddCategoryModal';
import AddSubCategoryModal from './AddSubCategoryModal';
import AllCategoryTab from './AllCategoryTab';
import AllSubCategoryTab from './AllSubCategoryTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import SubmitButton from '../../constants/SubmitButton';
import {budgetaryValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';
import BudgetaryMonths from './BudgetaryMonths';
import BudgetaryYears from './BudgetaryYears';

const AddBudgetary = ({navigation}: {navigation: any}) => {
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [addSubCategoryModal, setAddSubCategoryModal] = useState(false);
  const [allExpenseCategory, setAllExpenseCategory] = useState([]);
  const [allExpenseSubCategory, setAllExpenseSubCategory] = useState([]);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [budgetaryAmount, setBudgetaryAmount] = useState(1);
  const [checked, setChecked] = useState(false);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const [mainCategory, setMainCategory] = useState('P');
  const [monthYear, setMonthYear] = useState('M');
  const [myUserId, setMyUserId] = useState<any>();
  const [pageLoader, setPageLoader] = useState(false);
  const [subCategoryChecked, setSubCategoryChecked] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);
  const toastRef = useRef<any>();
  const [monthArrayList, setMonthArrayList] = useState<any[]>([]);
  const [monthChecked, setMonthChecked] = useState(true);
  const [yearList, setYearList] = useState<any[]>([]);
  const [yearChecked, setYearChecked] = useState(true);
  const [yearArrayList, setYearArrayList] = useState<any[]>([]);
  const [yearArrayChecked, setYearArrayChecked] = useState(true);
  const [monthErr, setMonthErr] = useState(false);
  const [yearErr, setYearErr] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all expanse category list data on api call
  const getData = async () => {
    setChecked(false);
    setArrayList([]);

    setPageLoader(true);
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    ExpensesManagementService.postListExpensesCategory()
      .then((response: any) => {
        setPageLoader(false);
        setAllExpenseCategory(response.data.allexpensecategory);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for category
  const renderCategoryTab = ({item}: {item: any; index: any}) => {
    return (
      <AllCategoryTab
        item={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
        myUserId={myUserId}
        handleDelete={handleCategoryDelete}
      />
    );
  };

  // function for select category
  const handleChecked = async (selectedId: number) => {
    setChecked(true);
    setArrayList([selectedId]);
    getListExpensesSubCategory(selectedId); //for sub category according to category
  };

  // function for delete category api call
  const handleCategoryDelete = (categoryId: any) => {
    ExpensesManagementService.getDeleteCategory(categoryId)
      .then((response: any) => {
        setPageLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all expanse sub category list data on api call
  const getListExpensesSubCategory = (selectedId: number) => {
    const data = {
      categoryid: selectedId,
    };
    ExpensesManagementService.postListExpensesSubCategory(data)
      .then((response: any) => {
        setAllExpenseSubCategory(response.data.allexpensesubcategory);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // list for all sub category
  const renderSubCategoryTab = ({item}: {item: any; index: any}) => {
    return (
      <AllSubCategoryTab
        items={item}
        handleChecked={handleSubCategoryChecked}
        checked={subCategoryChecked}
        checkedList={subCategoryList}
        myUserId={myUserId}
        handleDelete={handleCategoryDelete}
      />
    );
  };
  // function for select sub category
  const handleSubCategoryChecked = (selectedSubCategoryId: number) => {
    setErr(false);
    setSubCategoryChecked(true);
    setSubCategoryList([selectedSubCategoryId]);
  };

  // function for submit button click for api call to add Budget
  const onSubmit = async (values: any) => {
    if (subCategoryList[0] != null) {
      setErr(false);

      // error msg based on year and month select
      if (monthYear === 'M') {
        // for month select error msg
        if (monthArrayList.length > 0 && yearList.length > 0) {
          setMonthErr(false);
          api(values);
        } else {
          setMonthErr(true);
        }
      } else {
        // for year select error msg
        if (yearArrayList.length > 0) {
          setYearErr(false);
          api(values);
        } else {
          setYearErr(true);
        }
      }
    } else {
      setErr(true);
    }
  };

  //  function for api call
  const api = async (values: any) => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    setLoader(true);

    const feedBackData = new FormData();
    if (monthYear === 'M') {
      monthArrayList.map((e: any, index: any) => {
        feedBackData.append(`selectmonths[${index}]`, e);
      });
      feedBackData.append('selectyear', yearList[0]);
    }
    if (monthYear === 'Y') {
      yearArrayList.map((e: any, index: any) => {
        feedBackData.append(`selectyears[${index}]`, e);
      });
    }
    feedBackData.append('category_id', subCategoryList[0]);
    feedBackData.append('type', monthYear);
    feedBackData.append('budget', budgetaryAmount);
    feedBackData.append('budgetaryname', values.title);
    if (userType == '2') {
      feedBackData.append('accountId', accountId);
    }
    ExpensesManagementService.postAddBudgetaryRestriction(feedBackData)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response?.data?.message, 'success');
        navigation.navigate('StackNavigation', {screen: 'AddedBudgetary'});
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    title: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Add Budget'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Formik
          validationSchema={budgetaryValidation}
          initialValues={initialValues}
          onSubmit={values => {
            onSubmit(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <View style={styles.body}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Categories</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setAddCategoryModal(true);
                    }}>
                    <Text style={styles.addEditText}>Add Category</Text>
                  </TouchableOpacity>
                </View>

                {/* category tab section */}
                {!pageLoader ? (
                  <View style={{height: 110}}>
                    <FlatList
                      data={allExpenseCategory}
                      renderItem={renderCategoryTab}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                ) : (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator
                      size="large"
                      color={colors.THEME_ORANGE}
                    />
                  </View>
                )}

                {arrayList[0] != null ? (
                  <>
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Sub Categories</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddSubCategoryModal(true);
                        }}>
                        <Text style={styles.addEditText}>Add Sub Category</Text>
                      </TouchableOpacity>
                    </View>

                    {/* sub category tab section  */}
                    <View>
                      <FlatList
                        data={allExpenseSubCategory}
                        renderItem={renderSubCategoryTab}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index: any) => String(index)}
                      />
                    </View>
                  </>
                ) : null}

                {err ? (
                  <Text style={styles.errorMessage}>
                    *Please select category and sub category.
                  </Text>
                ) : null}

                {/* Budget Restriction section  */}
                <View>
                  <View style={styles.textDirection}>
                    <Text style={styles.labelText}>Budget Title</Text>
                  </View>
                  <TextInput
                    placeholder="Enter title"
                    placeholderTextColor={colors.textGray}
                    style={styles.textInput}
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={() => {
                      handleBlur('title');
                      setFieldTouched('title');
                    }}
                  />

                  <Text style={styles.errorMessage}>
                    {touched.title && errors.title}
                  </Text>
                </View>

                {/* Budget Restriction section  */}
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Budget Restriction</Text>
                </View>

                <View style={styles.budgetaryContainer}>
                  <Text style={styles.selectText}>Select months and year</Text>
                  <View style={styles.monthDirection}>
                    {/* <TouchableOpacity
                      style={styles.radioDirection}
                      onPress={() => {
                        setMonthYear('M');
                        setYearErr(false);
                      }}>
                      <View
                        style={
                          monthYear === 'M'
                            ? styles.selectedRadio
                            : styles.unSelectedRadio
                        }>
                        <View
                          style={
                            monthYear === 'M' ? styles.selectedRadioFill : null
                          }
                        />
                      </View>
                      <Text style={styles.cardName}>Monthly</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity
                      style={styles.radioDirection}
                      onPress={() => {
                        setMonthYear('Y');
                        setMonthErr(false);
                      }}>
                      <View
                        style={
                          monthYear === 'Y'
                            ? styles.selectedRadio
                            : styles.unSelectedRadio
                        }>
                        <View
                          style={
                            monthYear === 'Y' ? styles.selectedRadioFill : null
                          }
                        />
                      </View>
                      <Text style={styles.cardName}>Yearly</Text>
                    </TouchableOpacity> */}
                  </View>

                  {/* month and year based on selection */}
                  <View>
                    {monthYear === 'M' ? (
                      <BudgetaryMonths
                        setMonthArrayList={setMonthArrayList}
                        setMonthChecked={setMonthChecked}
                        setYearList={setYearList}
                        setYearChecked={setYearChecked}
                        monthArrayList={monthArrayList}
                        monthChecked={monthChecked}
                        yearList={yearList}
                        yearChecked={yearChecked}
                      />
                    ) : (
                      <BudgetaryYears
                        setYearArrayList={setYearArrayList}
                        setYearArrayChecked={setYearArrayChecked}
                        yearArrayList={yearArrayList}
                        yearArrayChecked={yearArrayChecked}
                      />
                    )}
                  </View>

                  {/* error message for month and year select */}
                  {monthErr ? (
                    <Text style={styles.errorMessage}>
                      *Please select month and year.
                    </Text>
                  ) : null}
                  {yearErr ? (
                    <Text style={styles.errorMessage}>
                      *Please select year.
                    </Text>
                  ) : null}

                  {/* price  */}
                  <View>
                    <Text style={styles.selectText}>Price ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={
                        budgetaryAmount > 0 ? budgetaryAmount.toString() : ''
                      }
                      maxLength={5}
                      keyboardType="numeric"
                      onChangeText={(text: any) => {
                        setBudgetaryAmount(parseInt(text, 10));
                      }}
                    />
                  </View>

                  {/* process bar section  */}
                  {/* <View style={{marginVertical: 10}}>
                    {budgetaryAmount > 0 ? (
                      <Slider
                        style={{width: 330}}
                        minimumValue={1}
                        maximumValue={10000}
                        onValueChange={(item: any) => {
                          setBudgetaryAmount(parseInt(item));
                        }}
                        value={budgetaryAmount}
                        thumbTintColor={colors.THEME_ORANGE}
                        minimumTrackTintColor={colors.THEME_ORANGE}
                        maximumTrackTintColor={colors.GRAY}
                      />
                    ) : (
                      <Slider
                        style={{width: 330}}
                        minimumValue={1}
                        maximumValue={10000}
                        thumbTintColor={colors.THEME_ORANGE}
                        minimumTrackTintColor={colors.THEME_ORANGE}
                        maximumTrackTintColor={colors.GRAY}
                      />
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '96%',
                      }}>
                      <Text style={styles.progressText}>$1.00</Text>
                      <Text style={styles.progressText}>$10000.00</Text>
                    </View>
                  </View> */}
                </View>

                {/* next button section */}
                <View style={styles.buttonContainer}>
                  <SubmitButton
                    buttonText={'Save'}
                    submitButton={handleSubmit}
                    loader={loader}
                  />
                </View>
              </ScrollView>

              {/* add category modal */}
              <AddCategoryModal
                visibleModal={addCategoryModal}
                onClose={() => {
                  setAddCategoryModal(false);
                }}
                mainCategory={mainCategory}
                onSubmitClick={(id: any) => {
                  setAddCategoryModal(false);
                  getData();
                  setChecked(true);
                  setArrayList([id]);
                }}
              />

              {/* add sub category modal */}
              <AddSubCategoryModal
                visibleModal={addSubCategoryModal}
                onClose={() => {
                  setAddSubCategoryModal(false);
                }}
                onSubmitClick={(id: any) => {
                  setAddSubCategoryModal(false);
                  getListExpensesSubCategory(arrayList[0]);
                  setSubCategoryChecked(true);
                  setSubCategoryList([id]);
                }}
                categoryId={arrayList[0]}
              />

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddBudgetary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  categoryContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flexDirection: 'row',
  },
  categoryTab: {width: '33%'},
  categoryTabBorder: {
    borderBottomColor: colors.THEME_ORANGE,
    borderBottomWidth: 3,
    width: '33%',
  },
  categoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 3,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
  },
  budgetaryContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 'auto',
    padding: 20,
  },
  selectText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 10,
  },
  monthDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  buttonContainer: {marginVertical: 20},
  radioDirection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  unSelectedRadio: {
    alignItems: 'center',
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadio: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 24,
  },
  selectedRadioFill: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderColor: colors.WHITE,
    borderRadius: 12,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 20,
  },
  cardName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 5,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.lightGray,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    paddingLeft: 20,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  progressText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  checkBox: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.GRAY,
    borderRadius: 5,
    borderWidth: 2,
    height: 25,
    justifyContent: 'center',
    marginRight: 5,
    width: 25,
  },
  checkedBox: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    marginRight: 5,
    width: 25,
  },
  checkIcon: {
    height: 18,
    width: 18,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
