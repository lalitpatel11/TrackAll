// external imports
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import AddCardModal from './AddCardModal';
import AddChequeModal from './AddChequeModal';
import AddEftModal from './AddEftModal';
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import ExpanseImageOnEdit from './ExpanseImageOnEdit';
import ExpansesImage from './ExpansesImage';
import ExpensesManagementService from '../../service/ExpensesManagementService';
import RepeatCalendarModal from '../groups/RepeatCalendarModal';
import SavedCardExpanse from './SavedCardExpanse';
import SavedChequeExpanse from './SavedChequeExpanse';
import SavedEftExpanse from './SavedEftExpanse';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {expansesValidation} from '../../constants/SchemaValidation';

const EditExpanse = ({navigation, route}: {navigation: any; route: any}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [addCardModal, setAddCardModal] = useState(false);
  const [addChequeModal, setAddChequeModal] = useState(false);
  const [addEftModal, setAddEftModal] = useState(false);
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [bankName, setBankName] = useState('');
  const [calendarModal, setCalendarModal] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardOrCash, setCardOrCash] = useState('Card');
  const [chequeNumber, setChequeNumber] = useState('');
  const [deletedImageId, setDeletedImageId] = useState<any[]>([]);
  const [err, setErr] = useState(false);
  const [expensesImage, setExpensesImage] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [savedCheque, setSavedCheque] = useState<any[]>([]);
  const [savedEft, setSavedEft] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [selectDate, setSelectDate] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  const [markEnable, setMarkEnable] = useState('0');
  const [monthYear, setMonthYear] = useState('M');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setExpensesImage([]);
      getSavedCard();

      // for preselected images
      if (route?.params?.data?.images != null) {
        let imageId = route?.params?.data?.images.map((e: any) => e.imageid);
        setArrayList(imageId); //for pre selected images id
      }
      // for payment type card and cash
      setCardOrCash(route?.params?.data?.payment_type);

      // for card name
      setCardName(route?.params?.data?.cardname);

      // for cheque and eft details
      setBankName(route?.params?.data?.bankname);
      setAccountNumber(route?.params?.data?.accountnumber);

      // for is recursive check
      setMarkEnable(route?.params?.data?.is_recursive);

      // for month and year radio
      if (route?.params?.data?.is_recursive == '1') {
        setMonthYear(route?.params?.data?.type);
      } else {
        setMonthYear('M');
      }

      // for date
      setSelectedDate(route?.params?.data?.expense_date);
      setSelectDate(
        moment(route?.params?.data?.expense_date).format('MM-DD-YYYY'),
      );
    });
    return unsubscribe;
  }, [navigation, route]);

  // function for get all saved card on api call
  const getSavedCard = () => {
    ExpensesManagementService.getSavedCards()
      .then((response: any) => {
        setLoader(false);
        setSavedCards(response.data.allcards);
        setSavedCheque(response.data.cheque);
        setSavedEft(response.data.eft);
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error);
      });
  };

  // list for all saved card
  const renderAllCards = ({item}: {item: any; index: any}) => {
    return (
      <SavedCardExpanse
        items={item}
        handleSelectCard={handleChecked}
        selectedCard={cardName}
      />
    );
  };

  // function for select card click
  const handleChecked = (cardName: string) => {
    setCardName(cardName);
    setErr(false);
  };

  // list for all cheque
  const renderAllCheque = ({item}: {item: any; index: any}) => {
    return (
      <SavedChequeExpanse
        items={item}
        handleSelectCard={handleChequeChecked}
        selectedCard={bankName}
      />
    );
  };

  // function for select cheque
  const handleChequeChecked = (data: any) => {
    setErr(false);
    setAccountNumber(data?.accountnumber);
    setBankName(data?.bankname);
  };

  // list for all EFT
  const renderAllEft = ({item}: {item: any; index: any}) => {
    return (
      <SavedEftExpanse
        items={item}
        handleSelectCard={handleEftChecked}
        selectedCard={bankName}
      />
    );
  };

  // function for select EFT
  const handleEftChecked = (data: any) => {
    setErr(false);
    setAccountNumber(data?.accountnumber);
    setBankName(data?.bankname);
  };

  // function for submit button click for add card
  const handleAddCardSubmitClick = (name: string) => {
    setAddCardModal(false);
    setErr(false);
    setSavedCards([...savedCards, name]);
  };

  // function for submit button click for add cheque
  const handleAddChequeSubmitClick = (
    accountNumber: any,
    chequeNumber: any,
    bankName: any,
  ) => {
    setAddChequeModal(false);
    setErr(false);
    setAccountNumber(accountNumber);
    setChequeNumber(chequeNumber);
    setBankName(bankName);
    const obj = {
      bankname: bankName,
      accountnumber: accountNumber,
    };
    setSavedCheque([...savedCheque, obj]);
  };

  // function for submit button click for add EFT
  const handleAddEftSubmitClick = (accountNumber: any, bankName: any) => {
    setAddEftModal(false);
    setErr(false);
    setAccountNumber(accountNumber);
    setBankName(bankName);
    const obj = {
      bankname: bankName,
      accountnumber: accountNumber,
    };
    setSavedEft([...savedEft, obj]);
  };

  // function for calender submit click with selected date for set state
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    setSelectDate(moment(selectDate).format('MM-DD-YYYY'));
  };

  // function for open camera
  const openCamera = async () => {
    try {
      let value = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then((image: any) => {
        const img = {
          name: image.path.slice(
            image.path.lastIndexOf('/'),
            image.path.length,
          ),
          uri: image.path,
          type: image.mime,
        };
        setExpensesImage([img]);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for open gallery
  const openLibrary = async () => {
    try {
      let imageList: any = [];
      let value = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then((image: any) => {
        image.map((e: any) => {
          imageList.push({
            name: e.path.slice(e.path.lastIndexOf('/'), e.path.length),
            uri: e.path,
            type: e.mime,
          });
        });
        setExpensesImage(imageList);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // list for expense images
  const renderAddExpenseImages = ({item}: {item: any; index: any}) => {
    return <ExpansesImage expenseImage={item} />;
  };

  // function for calender submit click after select date
  const renderPreAddedExpanseImages = ({item}: {item: any; index: any}) => {
    return (
      <ExpanseImageOnEdit
        commentImages={item}
        removeImage={handleRemoveImage}
        checkedList={arrayList}
      />
    );
  };

  // function for remove image
  const handleRemoveImage = (selectedImagesId: number) => {
    if (arrayList.includes(selectedImagesId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedImagesId));
      setDeletedImageId(arrayList.filter(ids => ids == selectedImagesId));
    }
  };

  // function for submit button click for select payment mode
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    if (cardOrCash === 'Card' && cardName !== '') {
      handleCallApi(values);
    } else if (
      cardOrCash === 'Cheque' &&
      accountNumber !== '' &&
      bankName !== ''
    ) {
      handleCallApi(values);
    } else if (
      cardOrCash === 'EFT' &&
      accountNumber !== '' &&
      bankName !== ''
    ) {
      handleCallApi(values);
    } else if (cardOrCash === 'Cash') {
      handleCallApi(values);
    } else {
      setErr(true);
    }
  };

  // function for submit button click for api call with payment mode and details to add expense
  const handleCallApi = (values: any) => {
    setErr(false);
    setLoader(true);
    const feedBackData = new FormData();
    if (expensesImage !== null) {
      expensesImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }
    feedBackData.append('expenseid', route?.params?.data?.expenseid);
    feedBackData.append('titile', values.title);
    feedBackData.append('description', values.description);
    feedBackData.append('amount', values.amount);
    feedBackData.append('paymenttype', cardOrCash);
    feedBackData.append('cardname', cardName);
    feedBackData.append('chequenumber', chequeNumber);
    feedBackData.append('bankname', bankName);
    feedBackData.append('accountnumber', accountNumber);
    feedBackData.append('date', selectedDate);
    feedBackData.append('type', monthYear);
    feedBackData.append('is_recursive', markEnable);
    if (deletedImageId !== null) {
      deletedImageId.map((e: any, index: any) => {
        feedBackData.append(`deleteimages[${index}]`, e);
      });
    }

    ExpensesManagementService.postEditExpanse(feedBackData)
      .then((response: any) => {
        setLoader(false);
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {screen: 'AllExpenses'});
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    title: route?.params?.data?.title,
    description: route?.params?.data?.description,
    amount: route?.params?.data?.editamount,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Expense'}
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
          validationSchema={expansesValidation}
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
                {/* title section  */}
                <View>
                  <Text style={styles.labelText}>Title</Text>
                  <TextInput
                    placeholder="Enter Title"
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

                {/*Description section  */}
                <View>
                  <Text style={styles.labelText}>Description</Text>
                  <TextInput
                    placeholder="Enter Description Here…"
                    placeholderTextColor={colors.textGray}
                    style={styles.descriptionInput}
                    value={values.description}
                    numberOfLines={3}
                    multiline={true}
                    textAlignVertical="top"
                    onChangeText={handleChange('description')}
                    onBlur={() => {
                      handleBlur('description');
                      setFieldTouched('description');
                    }}
                  />
                  <Text style={styles.errorMessage}>
                    {touched.description && errors.description}
                  </Text>
                </View>

                {/*amount section  */}
                <View>
                  <Text style={styles.labelText}>Amount</Text>
                  <TextInput
                    placeholder="Enter Amount"
                    placeholderTextColor={colors.textGray}
                    style={styles.textInput}
                    keyboardType={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    onBlur={() => {
                      handleBlur('amount');
                      setFieldTouched('amount');
                    }}
                  />

                  <Text style={styles.errorMessage}>
                    {touched.amount && errors.amount}
                  </Text>
                </View>

                {/* mark as recurring */}
                {/* <View style={styles.radioDirection}>
                  {markEnable == '0' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setMarkEnable('1');
                      }}
                      style={styles.checkBox}>
                      <Image
                        resizeMode="contain"
                        style={styles.checkIcon}
                        source={require('../../assets/pngImage/whitechcek.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setMarkEnable('0');
                      }}
                      style={styles.checkedBox}>
                      <Image
                        resizeMode="contain"
                        style={styles.checkIcon}
                        source={require('../../assets/pngImage/whitechcek.png')}
                      />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.cardName}>Mark as Recurring expense</Text>
                </View> */}

                {/* monthly and yearly type based on recurring */}
                {/* {markEnable == '1' ? (
                  <View style={styles.monthDirection}>
                    <TouchableOpacity
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
                  </View>
                ) : null} */}

                {/* date section */}
                <View style={{marginBottom: 5}}>
                  <Text style={styles.labelText}>Select Date</Text>
                  <View style={styles.calendarDateContainer}>
                    <TextInput
                      editable={false}
                      placeholder={'MM-DD-YYYY'}
                      placeholderTextColor={colors.WHITE}
                      value={selectDate}
                      style={{
                        color: colors.WHITE,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setCalendarModal(!calendarModal);
                      }}
                      style={styles.calendarIcon}>
                      <Image
                        resizeMode="contain"
                        tintColor={colors.THEME_ORANGE}
                        style={styles.image}
                        source={require('../../assets/pngImage/CalendarBlank1.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* pre selected image section  */}
                {route?.params?.data?.images?.length >= 0 ? (
                  <FlatList
                    data={route?.params?.data?.images}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderPreAddedExpanseImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : null}

                {/* uploaded media section  */}
                <View style={{marginVertical: 5}}>
                  {expensesImage?.length > 0 ? (
                    <FlatList
                      data={expensesImage}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderAddExpenseImages}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  ) : null}
                </View>

                {/* upload image section */}
                <TouchableOpacity
                  onPress={() => setCameraGalleryModal(true)}
                  style={styles.uploadMediaContainer}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>Upload image</Text>
                </TouchableOpacity>

                {/* Payment Method section  */}
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Select Payment Method</Text>
                </View>

                <View style={styles.textDirection}>
                  {/* Card section  */}
                  <TouchableOpacity
                    style={
                      cardOrCash === 'Card'
                        ? styles.cardContainerBorder
                        : styles.cardContainer
                    }
                    onPress={() => {
                      setCardOrCash('Card');
                      setErr(false);
                    }}>
                    <View style={styles.cardImage}>
                      <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={require('../../assets/pngImage/cardImage.png')}
                      />
                    </View>

                    <Text style={styles.cardText}>Card</Text>
                    {cardOrCash === 'Card' ? (
                      <View style={styles.checkedImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/CheckedIcon.png')}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>

                  {/* cash section  */}
                  <TouchableOpacity
                    style={
                      cardOrCash === 'Cash'
                        ? styles.cardContainerBorder
                        : styles.cardContainer
                    }
                    onPress={() => {
                      setCardOrCash('Cash');
                      setCardName('');
                      setAccountNumber('');
                      setChequeNumber('');
                      setBankName('');
                    }}>
                    <View style={styles.cardImage}>
                      <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={require('../../assets/pngImage/cashImage.png')}
                      />
                    </View>
                    <Text style={styles.cardText}>Cash</Text>
                    {cardOrCash === 'Cash' ? (
                      <View style={styles.checkedImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/CheckedIcon.png')}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>

                <View style={styles.textDirection}>
                  {/* Cheque section */}
                  <TouchableOpacity
                    style={
                      cardOrCash === 'Cheque'
                        ? styles.cardContainerBorder
                        : styles.cardContainer
                    }
                    onPress={() => {
                      setCardOrCash('Cheque');
                      setErr(false);
                    }}>
                    <View style={styles.cardImage}>
                      <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={require('../../assets/pngImage/cashImage.png')}
                      />
                    </View>

                    <Text style={styles.cardText}>Cheque</Text>
                    {cardOrCash === 'Cheque' ? (
                      <View style={styles.checkedImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/CheckedIcon.png')}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>

                  {/* EFT section  */}
                  <TouchableOpacity
                    style={
                      cardOrCash === 'EFT'
                        ? styles.cardContainerBorder
                        : styles.cardContainer
                    }
                    onPress={() => {
                      setCardOrCash('EFT');
                      setChequeNumber('');
                      setErr(false);
                    }}>
                    <View style={styles.cardImage}>
                      <Image
                        resizeMode="contain"
                        style={styles.image}
                        source={require('../../assets/pngImage/cardImage.png')}
                      />
                    </View>

                    <Text style={styles.cardText}>EFT</Text>
                    {cardOrCash === 'EFT' ? (
                      <View style={styles.checkedImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.image}
                          source={require('../../assets/pngImage/CheckedIcon.png')}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>

                {/* add from previous details or add new option for card  */}
                {cardOrCash === 'Card' ? (
                  <>
                    {/* add card section  */}
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Select</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddCardModal(true);
                        }}>
                        <Text style={styles.addEditText}>Add New Card</Text>
                      </TouchableOpacity>
                    </View>

                    {/* card name section with radio button  */}
                    {savedCards?.length >= 0 ? (
                      <View>
                        <FlatList
                          data={savedCards}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={renderAllCards}
                          keyExtractor={(item: any, index: any) =>
                            String(index)
                          }
                        />
                      </View>
                    ) : null}

                    {err ? (
                      <Text style={styles.errorMessage}>
                        *Please select card.
                      </Text>
                    ) : null}
                  </>
                ) : cardOrCash === 'Cheque' ? (
                  <>
                    {/* add from previous details or add new option for cheque  */}
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Select</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddChequeModal(true);
                        }}>
                        <Text style={styles.addEditText}>Add New Cheque</Text>
                      </TouchableOpacity>
                    </View>

                    {/* cheque name section with radio button  */}
                    {savedCheque?.length >= 0 ? (
                      <View>
                        <FlatList
                          data={savedCheque}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={renderAllCheque}
                          keyExtractor={(item: any, index: any) =>
                            String(index)
                          }
                        />
                      </View>
                    ) : null}

                    {err ? (
                      <Text style={styles.errorMessage}>
                        *Please select cheque.
                      </Text>
                    ) : null}
                  </>
                ) : cardOrCash === 'EFT' ? (
                  <>
                    {/* add from previous details or add new option for EFT  */}
                    <View style={styles.textDirection}>
                      <Text style={styles.labelText}>Select</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddEftModal(true);
                        }}>
                        <Text style={styles.addEditText}>Add New EFT</Text>
                      </TouchableOpacity>
                    </View>

                    {/* eft section with radio button  */}
                    {savedEft?.length >= 0 ? (
                      <View>
                        <FlatList
                          data={savedEft}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={renderAllEft}
                          keyExtractor={(item: any, index: any) =>
                            String(index)
                          }
                        />
                      </View>
                    ) : null}

                    {err ? (
                      <Text style={styles.errorMessage}>
                        *Please select EFT details.
                      </Text>
                    ) : null}
                  </>
                ) : null}

                {/* button with loader  */}
                <View style={styles.buttonContainer}>
                  <SubmitButton
                    loader={loader}
                    submitButton={handleSubmit}
                    buttonText={'Save'}
                  />
                </View>
              </ScrollView>

              {/* add card modal */}
              <AddCardModal
                visibleModal={addCardModal}
                onClose={() => {
                  setAddCardModal(false);
                }}
                onSubmitClick={handleAddCardSubmitClick}
              />

              {/* add cheque modal */}
              <AddChequeModal
                visibleModal={addChequeModal}
                onClose={() => {
                  setAddChequeModal(false);
                }}
                onSubmitClick={handleAddChequeSubmitClick}
              />

              {/* add EFT modal */}
              <AddEftModal
                visibleModal={addEftModal}
                onClose={() => {
                  setAddEftModal(false);
                }}
                onSubmitClick={handleAddEftSubmitClick}
              />

              {/* Camera Gallery Modal  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryModal}
                onClose={() => {
                  setCameraGalleryModal(false);
                }}
                cameraClick={openCamera}
                galleryClick={openLibrary}
              />

              {/* Calender modal */}
              <RepeatCalendarModal
                visibleModal={calendarModal}
                onClose={() => {
                  setCalendarModal(false);
                }}
                onSubmitClick={handleCalendarSubmitClick}
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

export default EditExpanse;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: 40,
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
    fontWeight: '500',
  },
  cardContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flexDirection: 'row',
    height: 60,
    padding: 3,
    width: '48%',
  },
  cardContainerBorder: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    padding: 3,
    width: '48%',
  },
  cardImage: {
    borderRadius: 50,
    height: 40,
    marginHorizontal: 10,
    width: 40,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  cardText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  checkedImage: {
    borderRadius: 50,
    height: 30,
    position: 'absolute',
    right: 10,
    width: 30,
    zIndex: 1,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 2,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 2,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 12,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  calendarDateContainer: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  calendarIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 50,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  monthDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '50%',
  },
  buttonContainer: {marginVertical: 20},
  unSelectedRadio: {
    alignItems: 'center',
    borderColor: colors.GRAY,
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
  radioDirection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 5,
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
});
