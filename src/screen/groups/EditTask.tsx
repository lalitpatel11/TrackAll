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
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import AllTimeWithCross from './AllTimeWithCross';
import CameraGalleryModal from './CameraGalleryModal';
import CommentImageOnEditModal from './CommentImageOnEditModal';
import CommentImagesTab from './CommentImagesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import CustomModal from './CustomModal';
import GroupServices from '../../service/GroupServices';
import RepeatCalendarModal from './RepeatCalendarModal';
import RepeatModal from './RepeatModal';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {taskName} from '../../constants/SchemaValidation';
import ToggleSwitch from 'toggle-switch-react-native';

const EditTask = ({route, navigation}: {route: any; navigation: any}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [autoHideTask, setAutoHideTask] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [daysList, setDaysList] = useState<any[]>([]);
  const [deletedImageId, setDeletedImageId] = useState<any[]>([]);
  const [errMsg, setErrMsg] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const [groupId, setGroupId] = useState(0);
  const [open, setOpen] = useState(false);
  const [priorityChecked, setPriorityChecked] = useState('L');
  const [repeatModal, setRepeatModal] = useState(false);
  const [repeatValue, setRepeatValue] = useState('O');
  const [selectedDate, setSelectedDate] = useState('');
  const [showRepeatValue, setShowRepeatValue] = useState('Once');
  const [taskId, setTaskId] = useState(0);
  const [timeChecked, setTimeChecked] = useState(true);
  const [timeList, setTimeList] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // task id
      setTaskId(route?.params?.data?.id);
      // group id
      setGroupId(route?.params?.data.groupid);

      // for repeat type
      if (route?.params?.data?.repeattype === 'Once') {
        setRepeatValue('O');
        setShowRepeatValue('Once');
      } else if (route?.params?.data?.repeattype === 'Daily') {
        setRepeatValue('D');
        setShowRepeatValue('Daily');
      } else if (route?.params?.data?.repeattype === 'Date') {
        setRepeatValue('T');
        setShowRepeatValue('Date');
        setSelectedDate(route?.params?.data?.repeatdate); //for pre selected repeat date
      } else if (route?.params?.data?.repeattype === 'Custom') {
        setRepeatValue('C');
        setShowRepeatValue('Custom');
        let days = route?.params?.data?.repeatdays?.map((e: any) => e.day);
        setDaysList(days); //for pre selected custom days
      } else {
        setRepeatValue('');
        setShowRepeatValue('');
      }

      // for time list
      let time = route?.params?.data?.time?.map((e: any) => e.times);
      setTimeList(time);

      // for priority check
      setPriorityChecked(route?.params?.data?.priority);

      // for preselected images
      if (route?.params?.data?.taskimages != null) {
        let imageId = route?.params?.data?.taskimages?.map(
          (e: any) => e.imageid,
        );
        setArrayList(imageId); //for pre selected images id
      }

      // for hide unHide task status
      setAutoHideTask(route?.params?.data?.autoHideTask);
    });
    return unsubscribe;
  }, [navigation, route]);

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
        setFeedbackImage([img]);
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
        image?.map((e: any) => {
          imageList.push({
            name: e.path.slice(e.path.lastIndexOf('/'), e.path.length),
            uri: e.path,
            type: e.mime,
          });
        });
        setFeedbackImage(imageList);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for close modal after select the repeat data
  const handleRepeatModalClose = (text: string) => {
    setRepeatModal(false);

    if (text === '' && repeatValue == '') {
      setRepeatValue('O');
      setShowRepeatValue('Once');
    } else {
      if (text === 'O') {
        setRepeatValue('O');
        setShowRepeatValue('Once');
        setDaysList([]); //empty felid in case user select different repeat option
        setSelectedDate(''); //empty felid in case user select different repeat option
      } else if (text === 'D') {
        setRepeatValue('D');
        setShowRepeatValue('Daily');
        setDaysList([]); //empty felid in case user select different repeat option
        setSelectedDate(''); //empty felid in case user select different repeat option
      } else if (text === 'T') {
        setRepeatValue('T');
        setShowRepeatValue('Date');
        setCalendarModal(true);
        setDaysList([]); //empty felid in case user select different repeat option
      } else if (text === 'C') {
        setRepeatValue('C');
        setShowRepeatValue('Custom');
        setCustomModal(true);
        setSelectedDate(''); //empty felid in case user select different repeat option
      }
    }
  };

  // function for close modal after select the once data
  const handleCustomModalClose = () => {
    setCustomModal(false);
    setRepeatValue('O');
    setShowRepeatValue('Once');
  };

  // function for close modal after select the custom data
  const handleCustomSubmitClick = (dayList: any) => {
    setCustomModal(false);
    setDaysList(dayList);
  };

  // function for close calender modal after select the date
  const handleCalendarModalClose = () => {
    setCalendarModal(false);
    setRepeatValue('O');
    setShowRepeatValue('Once');
  };

  // function for close calender modal after select the date and submit click
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
  };

  // list for time with cross icon
  const renderAllTimeTab = ({item}: {item: any; index: any}) => {
    return (
      <AllTimeWithCross items={item} handleChecked={handleTimeCrossCLick} />
    );
  };

  // function for cross click on time
  const handleTimeCrossCLick = (selectedValue: any) => {
    setTimeChecked(true);
    if (timeList.includes(selectedValue)) {
      setTimeList(timeList.filter(ids => ids !== selectedValue));
    } else {
      setTimeList([...timeList, selectedValue]);
    }
    setErrMsg(false);
  };

  const renderPreAddedTaskImages = ({item}: {item: any; index: any}) => {
    return (
      <CommentImageOnEditModal
        commentImages={item}
        removeImage={handleRemoveImage}
        checkedList={arrayList}
      />
    );
  };

  // function for cross click on time
  const handleRemoveImage = (selectedImagesId: number) => {
    if (arrayList.includes(selectedImagesId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedImagesId));
      setDeletedImageId(arrayList.filter(ids => ids == selectedImagesId));
    }
  };

  // list for comments images
  const renderAddedTaskImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  //  function for task submit button click api call to edit task
  const onSubmit = (values: any) => {
    Keyboard.dismiss();

    if (timeList.length >= 1) {
      setButtonLoader(true);
      setErrMsg(false);

      const feedBackData = new FormData();

      if (feedbackImage !== null) {
        feedbackImage?.map((e: any, index: any) => {
          feedBackData.append(`images[${index}]`, e);
        });
      }
      feedBackData.append('taskid', taskId);
      feedBackData.append('name', values.taskName);
      feedBackData.append('description', '');
      feedBackData.append('priority', priorityChecked);
      timeList?.map((e: number, index: any) => {
        feedBackData.append(`schedule_time[${index}]`, e);
      });
      feedBackData.append('repeat', repeatValue);
      daysList?.map((e: number, index: any) => {
        feedBackData.append(`custom[${index}]`, e);
      });
      feedBackData.append('date', selectedDate);
      feedBackData.append('editing', 1);
      feedBackData.append('group_id', groupId);
      feedBackData.append('task_type', 'T');
      feedBackData.append('repeat_time', 0);
      feedBackData.append('privacy', '');
      feedBackData.append('preference_id', 0);
      feedBackData.append('autoHideTask', autoHideTask);
      if (deletedImageId !== null) {
        deletedImageId?.map((e: any, index: any) => {
          feedBackData.append(`deleteimagesid[${index}]`, e);
        });
      }

      GroupServices.postEditTask(feedBackData)
        .then((response: any) => {
          setButtonLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('StackNavigation', {
            screen: 'TaskDetails',
            params: {
              id: groupId,
            },
          });
        })
        .catch((error: any) => {
          setButtonLoader(false);
          console.log(error);
        });
    } else {
      setErrMsg(true);
    }
  };

  const initialValues = {
    taskName: route?.params?.data?.name,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Task'}
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
        style={styles.body}>
        <Formik
          validationSchema={taskName}
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
            <>
              {/* task name  */}
              <View>
                <Text style={styles.labelText}>Task Name</Text>
                <TextInput
                  placeholder="Enter task name"
                  placeholderTextColor={colors.THEME_WHITE}
                  style={styles.textInput}
                  value={values.taskName}
                  onChangeText={handleChange('taskName')}
                  onBlur={() => {
                    handleBlur('taskName');
                    setFieldTouched('taskName');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.taskName && errors.taskName}
                </Text>
              </View>

              {/* choose priority  */}
              <View>
                <Text style={styles.labelText}>Choose Priority</Text>
                <View style={styles.direction}>
                  <TouchableOpacity
                    style={
                      priorityChecked === 'L'
                        ? styles.selectedPriorityContainer
                        : styles.priorityContainer
                    }
                    onPress={() => setPriorityChecked('L')}>
                    <Text
                      style={
                        priorityChecked === 'L'
                          ? styles.selectPriorityText
                          : styles.priorityText
                      }>
                      Low
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      priorityChecked === 'M'
                        ? styles.selectedPriorityContainer
                        : styles.priorityContainer
                    }
                    onPress={() => {
                      setPriorityChecked('M');
                    }}>
                    <Text
                      style={
                        priorityChecked === 'M'
                          ? styles.selectPriorityText
                          : styles.priorityText
                      }>
                      Medium
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      priorityChecked === 'H'
                        ? styles.selectedPriorityContainer
                        : styles.priorityContainer
                    }
                    onPress={() => setPriorityChecked('H')}>
                    <Text
                      style={
                        priorityChecked === 'H'
                          ? styles.selectPriorityText
                          : styles.priorityText
                      }>
                      High
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* choose time  */}
              <View>
                <Text style={styles.labelText}>Time</Text>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  theme="dark"
                  buttonColor={colors.THEME_ORANGE}
                  dividerColor={colors.THEME_ORANGE}
                  textColor={colors.THEME_ORANGE}
                  title={'Select Time'}
                  mode={'time'}
                  minuteInterval={15}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                    setErrMsg(false);

                    let selectedTime = moment(date).format('hh:mm A');
                    if (timeList.includes(selectedTime)) {
                    } else {
                      setTimeList([...timeList, selectedTime]);
                    }
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />

                <FlatList
                  data={timeList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderAllTimeTab}
                  keyExtractor={(item: any, index: any) => String(index)}
                />

                {errMsg ? (
                  <Text style={styles.errorMessage}>Please choose time</Text>
                ) : null}

                <TouchableOpacity
                  style={styles.addTimeContainer}
                  onPress={() => {
                    setOpen(true);
                  }}>
                  <Text style={styles.addTimeText}>Add Time</Text>
                </TouchableOpacity>
              </View>

              {/* repeat container */}
              <TouchableOpacity
                onPress={() => setRepeatModal(true)}
                style={styles.repeatContainer}>
                <Text style={styles.labelText}>Select Repeat Option</Text>
                <TouchableOpacity
                  onPress={() => setRepeatModal(true)}
                  style={styles.direction}>
                  <Text style={styles.repeatValue}>{showRepeatValue}</Text>
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/pngImage/repeatArrow.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* auto fill event create details toggle section */}
              {/* <View style={styles.toggleContainer}>
                <Text style={styles.labelText}>Hide Task</Text>
                <ToggleSwitch
                  isOn={autoHideTask}
                  onColor={colors.lightOrange}
                  offColor={colors.lightGray}
                  size="medium"
                  onToggle={() => setAutoHideTask(!autoHideTask)}
                />
              </View> */}

              {/* upload media section */}
              <View style={{marginTop: 10}}>
                <Text style={styles.labelText}>Upload media</Text>

                {/* pre selected image section  */}
                {route?.params?.data?.taskimages?.length >= 0 ? (
                  <FlatList
                    data={route?.params?.data?.taskimages}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderPreAddedTaskImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : null}
              </View>

              {/* uploaded images  */}
              <View style={{marginVertical: 5}}>
                {feedbackImage?.length >= 0 ? (
                  <FlatList
                    data={feedbackImage}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAddedTaskImages}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : null}
              </View>

              {/* upload image section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryModal(true)}
                style={styles.uploadMediaContainer}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={styles.uploadImageStyle}
                    resizeMode="contain"
                    source={require('../../assets/pngImage/UploadMedia.png')}
                  />
                  <Text style={styles.uploadMediaText}>Upload task image</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {/* save group button  */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loader={buttonLoader}
                  buttonText={'Submit'}
                  submitButton={handleSubmit}
                />
              </View>

              {/* repeat modal  */}
              <RepeatModal
                visibleModal={repeatModal}
                onClose={handleRepeatModalClose}
                repeatValue={repeatValue}
              />

              {/* Custom modal  */}
              <CustomModal
                visibleModal={customModal}
                onClose={handleCustomModalClose}
                onSubmitClick={handleCustomSubmitClick}
              />

              {/* Calender modal  */}
              <RepeatCalendarModal
                visibleModal={calendarModal}
                onClose={handleCalendarModalClose}
                onSubmitClick={handleCalendarSubmitClick}
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
            </>
          )}
        </Formik>

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  direction: {flexDirection: 'row'},
  profileImage: {
    borderRadius: 50,
    height: 80,
    marginRight: 10,
    width: 80,
  },
  copyImage: {marginTop: 5},
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 8,
  },
  addTimeContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 16,
    height: 30,
    justifyContent: 'center',
    marginTop: 8,
    width: 89,
  },
  addTimeText: {
    color: colors.WHITE,
    fontSize: 12,
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  priorityContainer: {
    justifyContent: 'center',
    width: 120,
  },
  selectedPriorityContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 23,
    justifyContent: 'center',
    width: 120,
  },
  priorityText: {
    alignSelf: 'center',
    color: colors.THEME_WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 15,
    textAlign: 'center',
  },
  selectPriorityText: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 15,
    textAlign: 'center',
  },
  repeatContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  repeatValue: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  addMembersContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 16,
    height: 35,
    justifyContent: 'center',
    marginTop: 8,
    width: 128,
  },
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.THEME_WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 20,
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
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginVertical: 15,
  },
  buttonContainer: {marginVertical: 20},
});
