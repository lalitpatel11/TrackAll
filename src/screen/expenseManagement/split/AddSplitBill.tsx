// external imports
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import CameraGalleryModal from '../../groups/CameraGalleryModal';
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import ExpansesImage from '../ExpansesImage';
import SplitService from '../../../service/SplitService';
import SubmitButton from '../../../constants/SubmitButton';
import {colors} from '../../../constants/ColorConstant';
import {expansesValidation} from '../../../constants/SchemaValidation';
import CalendarModal from '../CalendarModal';

const AddSplitBill = ({navigation, route}: {navigation: any; route: any}) => {
  const [calendarModal, setCalendarModal] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [splitBillImage, setSplitBillImage] = useState<any[]>([]);
  const [splitId, setSplitId] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [selectDate, setSelectDate] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  const toastRef = useRef<any>();

  useEffect(() => {
    setSplitId(route?.params?.data);
  }, [navigation]);

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
        setSplitBillImage([img]);
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
        setSplitBillImage(imageList);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // list for images
  const renderAddExpenseImages = ({item}: {item: any; index: any}) => {
    return <ExpansesImage expenseImage={item} />;
  };

  // function for calender submit click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    setSelectDate(moment(selectDate).format('MM-DD-YYYY'));
  };

  // function for submit button click for api call to add split bill in split group
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    setLoader(true);

    const data = new FormData();
    if (splitBillImage !== null) {
      splitBillImage.map((e: any, index: any) => {
        data.append(`images[${index}]`, e);
      });
    }
    data.append('groupid', splitId);
    data.append('title', values.title);
    data.append('description', values.description);
    data.append('amount', values.amount);
    data.append('date', selectedDate);

    SplitService.postAddSplitBill(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('StackNavigation', {
            screen: 'SplitList',
            params: {
              data: splitId,
            },
          });
        } else if (response.data.status === 0) {
          toastRef.current.getToast(response.data.message, 'success');
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error');
      });
  };

  const initialValues = {
    amount: '',
    description: '',
    title: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Add Split Bill'}
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
              {/* title section */}
              <View>
                <Text style={styles.labelText}>Title</Text>
                <TextInput
                  placeholder="Enter Title"
                  placeholderTextColor={colors.WHITE}
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

              {/*Description section */}
              <View>
                <Text style={styles.labelText}>Description</Text>
                <TextInput
                  placeholder="Enter Description Here…"
                  placeholderTextColor={colors.WHITE}
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

              {/*amount section */}
              <View>
                <Text style={styles.labelText}>Amount ($)</Text>
                <TextInput
                  placeholder="Enter Amount"
                  placeholderTextColor={colors.WHITE}
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

              {/* date section */}
              <View>
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
                      style={{height: 18, width: 18}}
                      source={require('../../../assets/pngImage/CalendarBlank1.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* uploaded media section */}
              {splitBillImage?.length > 0 ? (
                <FlatList
                  data={splitBillImage}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderAddExpenseImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}

              {/* upload image section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryModal(true)}
                style={styles.uploadMediaContainer}>
                <Image
                  style={styles.uploadImageStyle}
                  resizeMode="contain"
                  source={require('../../../assets/pngImage/UploadMedia.png')}
                />
                <Text style={styles.uploadMediaText}>Upload Image</Text>
              </TouchableOpacity>

              {/* button with loader */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loader={loader}
                  submitButton={handleSubmit}
                  buttonText={'Save'}
                />
              </View>

              {/* Camera Gallery Modal */}
              <CameraGalleryModal
                visibleModal={cameraGalleryModal}
                onClose={() => {
                  setCameraGalleryModal(false);
                }}
                cameraClick={openCamera}
                galleryClick={openLibrary}
              />

              {/* Calender modal */}
              <CalendarModal
                visibleModal={calendarModal}
                onClose={() => {
                  setCalendarModal(false);
                }}
                onSubmitClick={handleCalendarSubmitClick}
              />

              {/* toaster message for error response from API */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddSplitBill;

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
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 3,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 10,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 5,
  },
  calendarDateContainer: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    marginBottom: 20,
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
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 50,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    marginTop: 5,
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  buttonContainer: {paddingTop: 30},
});
