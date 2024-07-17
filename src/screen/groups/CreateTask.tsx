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
import ToggleSwitch from 'toggle-switch-react-native';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import AllTimeWithCross from './AllTimeWithCross';
import CameraGalleryModal from './CameraGalleryModal';
import CommentImagesTab from './CommentImagesTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import CustomModal from './CustomModal';
import GroupServices from '../../service/GroupServices';
import RecentlyAddedMembersTab from './RecentlyAddedMembersTab';
import RepeatCalendarModal from './RepeatCalendarModal';
import RepeatModal from './RepeatModal';
import SubmitButton from '../../constants/SubmitButton';
import TaskAssignMemberModal from './TaskAssignMemberModal';
import {colors} from '../../constants/ColorConstant';
import {taskName} from '../../constants/SchemaValidation';

const CreateTask = ({route, navigation}: {route: any; navigation: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [daysList, setDaysList] = useState<any[]>([]);
  const [groupId, setGroupId] = useState(
    route?.params?.groupDetails?.groupid
      ? route?.params?.groupDetails?.groupid
      : route?.params?.data,
  );
  const [assignMemberModal, setAssignMemberModal] = useState(false);
  const [autoHideTask, setAutoHideTask] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errMsg, setErrMsg] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [priorityChecked, setPriorityChecked] = useState('L');
  const [repeatModal, setRepeatModal] = useState(false);
  const [repeatValue, setRepeatValue] = useState('O');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<number[]>([]);
  const [showRepeatValue, setShowRepeatValue] = useState('Once');
  const [timeList, setTimeList] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFeedbackImage([]);
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
        image.map((e: any) => {
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
      } else if (text === 'D') {
        setRepeatValue('D');
        setShowRepeatValue('Daily');
      } else if (text === 'T') {
        setRepeatValue('T');
        setShowRepeatValue('Date');
        setCalendarModal(true);
      } else if (text === 'C') {
        setRepeatValue('C');
        setShowRepeatValue('Custom');
        setCustomModal(true);
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
    if (timeList.includes(selectedValue)) {
      setTimeList(timeList.filter(ids => ids !== selectedValue));
    } else {
      setTimeList([...timeList, selectedValue]);
    }
    setErrMsg(false);
  };

  // list for comments images
  const renderAddedTaskImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // function for assign member for task submit click
  const handleAssignMemberSubmitClick = (
    memberList: any[],
    userList: any[],
  ) => {
    setAssignMemberModal(false);
    setSelectedMembersId(memberList);
    setSelectedMembersList(userList);
  };

  // list for recently added members
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  //  function for task submit button click api call to create task
  const onSubmit = (values: any) => {
    if (timeList.length >= 1) {
      setButtonLoader(true);
      setErrMsg(false);
      Keyboard.dismiss();
      const feedBackData = new FormData();

      if (feedbackImage !== null) {
        feedbackImage.map((e: any, index: any) => {
          feedBackData.append(`images[${index}]`, e);
        });
      }
      feedBackData.append('name', values.taskName);
      feedBackData.append('description', '');
      feedBackData.append('priority', priorityChecked);
      timeList.map((e: number, index: any) => {
        feedBackData.append(`schedule_time[${index}]`, e);
      });
      feedBackData.append('repeat', repeatValue);
      daysList.map((e: number, index: any) => {
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
      if (selectedMembersId !== null) {
        selectedMembersId.map((e: number, index: any) => {
          feedBackData.append(`taskassignmembers[${index}]`, e);
        });
      }

      GroupServices.postCreateTask(feedBackData)
        .then((response: any) => {
          setButtonLoader(false);
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('StackNavigation', {
            screen: 'GroupDetails',
            params: {
              data: groupId,
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
    taskName: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Task'}
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
            <View style={styles.body}>
              {/* task name  */}
              <View>
                <Text style={styles.labelText}>Task Name</Text>
                <TextInput
                  placeholder="Enter Task Name"
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
              <View style={{marginTop: 15}}>
                <Text style={styles.labelText}>Time</Text>

                <DatePicker
                  modal
                  open={open}
                  date={date}
                  title={'Select Time'}
                  mode={'time'}
                  theme="dark"
                  buttonColor={colors.THEME_ORANGE}
                  dividerColor={colors.THEME_ORANGE}
                  textColor={colors.THEME_ORANGE}
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

                {timeList?.length > 0 ? (
                  <FlatList
                    data={timeList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderAllTimeTab}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : (
                  <Text style={styles.noTimeText}>
                    No Time Selected. Click on
                    <Text style={styles.noTimeTextOrange}> “Add Time” </Text>
                    to add time.
                  </Text>
                )}

                {errMsg ? (
                  <Text style={styles.errorMessage}>Please Choose Time</Text>
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

                {/* uploaded images  */}
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
                  <Text style={styles.uploadMediaText}>Upload Task Image</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/repeatArrow.png')}
                />
              </TouchableOpacity>

              {/* task assign member section */}
              <View style={{marginTop: 10}}>
                <Text style={styles.labelText}>Assigned Members</Text>

                {/*recently added members  */}
                {selectedMembersList?.length > 0 ? (
                  <FlatList
                    data={selectedMembersList}
                    renderItem={renderAddedMembers}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : (
                  <View style={styles.noMembersContainer}>
                    <Text style={styles.noMembersText}>No Members Added</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.addMembersContainer}
                  onPress={() => {
                    setAssignMemberModal(true);
                  }}>
                  <Text style={styles.addTimeText}>Assign Member</Text>
                </TouchableOpacity>
              </View>

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

              {/* Remove Member from group modal  */}
              <TaskAssignMemberModal
                visibleModal={assignMemberModal}
                onClose={() => {
                  setAssignMemberModal(false);
                }}
                onSubmitClick={handleAssignMemberSubmitClick}
                navigation={navigation}
                groupId={groupId}
              />
            </View>
          )}
        </Formik>

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 20,
    paddingBottom: '10%',
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
    fontSize: 16,
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
    width: '35%',
    alignItems: 'center',
  },
  selectedPriorityContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 23,
    justifyContent: 'center',
    width: '35%',
    alignItems: 'center',
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
    marginVertical: 5,
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
  noTimeText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noTimeTextOrange: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginVertical: 15,
  },
  buttonContainer: {marginVertical: 20},
});
