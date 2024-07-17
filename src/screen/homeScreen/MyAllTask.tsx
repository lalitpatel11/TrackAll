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
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';
import HomeScreenService from '../../service/HomeScreenService';
import TaskTab from './TaskTab';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import GroupServices from '../../service/GroupServices';
import CalendarModal from '../expenseManagement/CalendarModal';
import moment from 'moment';

const MyAllTask = ({navigation}: {navigation: any}) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [allTask, setAllTask] = useState([]);
  const toastRef = useRef<any>();
  const [markCompleteModal, setMarkCompleteModal] = useState(false);
  const [markHideModal, setMarkHideModal] = useState(false);
  const [markInCompleteModal, setMarkInCompleteModal] = useState(false);
  const [markUnHideModal, setMarkUnHideModal] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [timeValue, setTimeValue] = useState('');
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getTask(selectedDate);
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all task data on api call
  const getTask = async (date: any) => {
    setPageLoader(true);
    const body = {
      date: date ? date : selectedDate,
    };
    HomeScreenService.postTaskOnHome(body)
      .then((response: any) => {
        setAllTask(response?.data?.tasks);
        setPageLoader(false);
      })
      .catch(error => {
        console.log(error, 'error');
        setPageLoader(false);
      });
  };

  // list for my tasks
  const renderTaskItems = ({item}: {item: any; index: any}) => {
    return (
      <TaskTab
        data={item}
        onTaskTabClick={handleTaskTabClick}
        hideClick={handleHideClick}
        unHideClick={HandleUnHideClick}
        handleMarkComplete={handleMarkComplete}
        handleMarkInComplete={handleMarkInComplete}
      />
    );
  };

  // navigation on task details and routine details
  const handleTaskTabClick = (taskData: any) => {
    {
      taskData?.tasktype === 'T'
        ? navigation.navigate('StackNavigation', {
            screen: 'TaskDetails',
            params: {id: taskData?.id},
          })
        : taskData?.tasktype === 'R'
        ? navigation.navigate('StackNavigation', {
            screen: 'RoutineDetails',
            params: {id: taskData?.id},
          })
        : null;
    }
  };
  // function for open modal on hide click
  const handleHideClick = (id: number, value: string) => {
    setMarkHideModal(true);
    setTaskId(id);
    setTimeValue(value);
  };

  // function for hide click on api call to hide task
  const handleHideYesClick = () => {
    setMarkHideModal(false);
    const data = {
      taskid: taskId,
      hidestatus: '1',
      time: timeValue,
    };
    HomeScreenService.postHideTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(selectedDate); //for refresh the tasks
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  // function for open modal on unHide click
  const HandleUnHideClick = (id: number, value: string) => {
    setMarkUnHideModal(true);
    setTaskId(id);
    setTimeValue(value);
  };

  // function for unHide click on api call to unHide task
  const handleUnHideYesClick = () => {
    setMarkUnHideModal(false);
    const data = {
      taskid: taskId,
      hidestatus: '0',
      time: timeValue,
    };
    HomeScreenService.postHideTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(selectedDate); //for refresh the tasks
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  // function for open modal on mark complete click
  const handleMarkComplete = (id: number, value: string) => {
    setMarkCompleteModal(true);
    setTaskId(id);
    setTimeValue(value);
  };

  // function for mark complete click on api call to complete task
  const handleCompleteTask = () => {
    setMarkCompleteModal(false);
    const data = {
      taskid: taskId,
      time: timeValue,
    };
    GroupServices.postCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(selectedDate); //for refresh the tasks
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for open modal on mark incomplete click
  const handleMarkInComplete = (id: number, value: string) => {
    setMarkInCompleteModal(true);
    setTaskId(id);
    setTimeValue(value);
  };

  // function for mark incomplete click on api call to incomplete task
  const handleInCompleteTask = () => {
    setMarkInCompleteModal(false);
    const data = {
      taskid: taskId,
      time: timeValue,
    };
    GroupServices.postInCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getTask(selectedDate); //for refresh the tasks
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for calender submit click after select date
  const handleCalendarSubmitClick = (selectDate: string) => {
    setCalendarModal(false);
    setSelectedDate(moment(selectDate).format('YYYY-MM-DD'));
    getTask(moment(selectDate).format('YYYY-MM-DD'));
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'All Task'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {/* search box */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Filter task by date"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            editable={false}
            // onChangeText={text => {
            //   setSearchText(text);
            //   searchGroup(text);
            // }}
          />
        </View>
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => {
            setCalendarModal(true);
          }}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/filter.png')}
          />
        </TouchableOpacity>
      </View>

      {/* body section */}
      {!pageLoader ? (
        allTask?.length > 0 ? (
          <View style={styles.body}>
            {/* my task list  */}
            <View style={{height: '90%'}}>
              <FlatList
                data={allTask}
                scrollEnabled={true}
                renderItem={renderTaskItems}
                listKey={'myGroupList'}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No result found</Text>
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Delete alert modal for hide task */}
      <DeleteAlertModal
        visibleModal={markHideModal}
        onRequestClosed={() => {
          setMarkHideModal(false);
        }}
        onPressRightButton={handleHideYesClick}
        subHeading={'Are you sure you want to hide ?'}
      />

      {/* Delete alert modal for un hide task */}
      <DeleteAlertModal
        visibleModal={markUnHideModal}
        onRequestClosed={() => {
          setMarkUnHideModal(false);
        }}
        onPressRightButton={handleUnHideYesClick}
        subHeading={'Are you sure you want to unhide ?'}
      />

      {/* Delete alert modal for task mark complete */}
      <DeleteAlertModal
        visibleModal={markCompleteModal}
        onRequestClosed={() => {
          setMarkCompleteModal(false);
        }}
        onPressRightButton={handleCompleteTask}
        subHeading={'Are you sure you want to complete this task ?'}
      />

      {/* Delete alert modal for task mark inComplete */}
      <DeleteAlertModal
        visibleModal={markInCompleteModal}
        onRequestClosed={() => {
          setMarkInCompleteModal(false);
        }}
        onPressRightButton={handleInCompleteTask}
        subHeading={'Are you sure you want to incomplete this task ?'}
      />

      {/* Calender modal */}
      <CalendarModal
        visibleModal={calendarModal}
        onClose={() => {
          setCalendarModal(false);
        }}
        onSubmitClick={handleCalendarSubmitClick}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default MyAllTask;

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
    height: 65,
    justifyContent: 'space-between',
    padding: 10,
  },
  inputContainer: {
    borderRadius: 8,
    width: '84%',
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
  createIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 100,
    bottom: 60,
    height: 60,
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    right: 25,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.THEME_BLACK,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
