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
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
// import Slider from '@react-native-community/slider';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal import
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import SubmitButton from '../../constants/SubmitButton';
import {budgetaryValidation} from '../../constants/SchemaValidation';
import {colors} from '../../constants/ColorConstant';
import AllCategoryEditBudgetary from './AllCategoryEditBudgetary';
import AllSubCategoryEditBudgetary from './AllSubCategoryEditBudgetary';

const EditBudgetary = ({navigation, route}: {navigation: any; route: any}) => {
  const [allExpenseCategory, setAllExpenseCategory] = useState([]);
  const [allExpenseSubCategory, setAllExpenseSubCategory] = useState([]);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [budgetaryAmount, setBudgetaryAmount] = useState('');
  const [checked, setChecked] = useState(true);
  const [loader, setLoader] = useState(false);
  const [monthYear, setMonthYear] = useState('M');
  const [pageLoader, setPageLoader] = useState(false);
  const [subCategoryChecked, setSubCategoryChecked] = useState(true);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //for month and year
      setMonthYear(route?.params?.data?.type);

      // for main category
      getData();

      // for expense category
      setArrayList([route?.params?.data?.categoryid]);
      getListExpensesSubCategory(route?.params?.data?.categoryid);

      // for expense sub category
      setSubCategoryList([route?.params?.data?.subcategoryid]);

      // for set budget amount
      setBudgetaryAmount(route?.params?.data?.budgetamount);
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all expense list data on api call
  const getData = () => {
    setPageLoader(true);

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

  // list for all category
  const renderCategoryTab = ({item}: {item: any; index: any}) => {
    return (
      <AllCategoryEditBudgetary
        item={item}
        handleChecked={handleChecked}
        checked={checked}
        checkedList={arrayList}
      />
    );
  };

  // function for select category
  const handleChecked = async (selectedId: number) => {
    setChecked(true);
    setArrayList([selectedId]);
    getListExpensesSubCategory(selectedId); //for sub category according to category
  };

  // function for get all sub category list data on api call
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

  // list for sub category
  const renderSubCategoryTab = ({item}: {item: any; index: any}) => {
    return (
      <AllSubCategoryEditBudgetary
        items={item}
        handleChecked={handleSubCategoryChecked}
        checked={subCategoryChecked}
        checkedList={subCategoryList}
      />
    );
  };

  // function for select sub category
  const handleSubCategoryChecked = (selectedSubCategoryId: number) => {
    setSubCategoryChecked(true);
    setSubCategoryList([selectedSubCategoryId]);
  };

  // function for submit button click on api call to edit budget
  const onSubmit = (values: any) => {
    setLoader(true);
    const data = {
      category_id: subCategoryList[0],
      type: monthYear,
      budget: budgetaryAmount,
      budgetaryname: values.title,
      budgetaryid: route?.params?.data?.budgetaryid,
    };

    ExpensesManagementService.postEditBudgetaryRestriction(data)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.navigate('StackNavigation', {screen: 'AddedBudgetary'});
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    title: route?.params?.data?.name,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section  */}
      <CustomHeader
        headerText={'Edit Budget'}
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
                </View>

                {/* category tab section  */}
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

                {allExpenseSubCategory?.length > 0 ? (
                  <>
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Sub Categories</Text>
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

                {/* budget Restriction section  */}
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

                {/* budget Restriction section  */}
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Budget Restriction</Text>
                </View>

                <View style={styles.budgetaryContainer}>
                  {/* <Text style={styles.selectText}>Select</Text> */}
                  {/* <View style={styles.monthDirection}>
                    <TouchableOpacity
                      disabled={true}
                      style={styles.radioDirection}
                      onPress={() => {
                        setMonthYear('M');
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
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={true}
                      style={styles.radioDirection}
                      onPress={() => {
                        setMonthYear('Y');
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
                    </TouchableOpacity>
                  </View> */}

                  {/* price  */}
                  <View>
                    <Text style={styles.selectText}>Price ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={budgetaryAmount}
                      maxLength={5}
                      editable={false}
                      // keyboardType="numeric"
                      // onChangeText={(text: any) => {
                      //   setBudgetaryAmount(parseInt(text));
                      // }}
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

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditBudgetary;

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
