// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
// internal imports
import AddedTimeTab from '../groups/AddedTimeTab';
import AllTimeWithComplete from '../groups/AllTimeWithComplete';
import CommentsOnRoutine from '../routine/CommentsOnRoutine';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import GroupServices from '../../service/GroupServices';
import RoutineService from '../../service/RoutineService';
import {colors} from '../../constants/ColorConstant';

const CommunityDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [commentCount, setCommentCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [markCompleteModal, setMarkCompleteModal] = useState(false);
  const [markInCompleteModal, setMarkInCompleteModal] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [pageLoader, setPageLoader] = useState(false);
  const [routineComments, setRoutineComments] = useState<any[]>([]);
  const [routineDetails, setRoutineDetails] = useState({});
  const [routineId, setRoutineId] = useState(route?.params?.id);
  const [timeValue, setTimeValue] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRoutineId(route?.params?.id);
      getDetails();
      getComments();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all community data api call
  const getDetails = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    setPageLoader(true);
    let data: any = {
      routineid: routineId,
    };

    RoutineService.postRoutineDetails(data)
      .then((response: any) => {
        setPageLoader(false);
        setRoutineDetails(response.data.routines);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all comment on routine api call
  const getComments = () => {
    let data: any = {
      routineid: routineId,
    };
    RoutineService.postAllCommentOnRoutine(data)
      .then((response: any) => {
        setRoutineComments(response.data.commentdetails);
        setCommentCount(response.data.commentsCount);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // navigation for routine comments page
  const handleViewCommentsClick = (id: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'RoutineAllComments',
      params: {
        data: id,
        flow: 'COMMUNITYROUTINE',
      },
    });
  };

  // list for comments on community details page
  const renderCommentsRoutine = ({item}: {item: any; index: any}) => {
    return (
      <CommentsOnRoutine
        data={item}
        viewCommentsClick={handleViewCommentsClick}
        routineId={routineDetails?.routineid}
      />
    );
  };

  // list for added time on community details page
  const renderAddedTime = ({item}: {item: any; index: any}) => {
    return <AddedTimeTab items={item} />;
  };

  // list for added time with complete mark on community details page
  const renderAddedTimeWithComplete = ({item}: {item: any; index: any}) => {
    return (
      <AllTimeWithComplete
        items={item}
        handleMarkComplete={handleMarkComplete}
        handleMarkInComplete={handleMarkInComplete}
      />
    );
  };

  // function for delete task click api call
  const handleDelete = () => {
    setDeleteModal(false);
    GroupServices.getDeleteTask(routineId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for complete mark click for modal open
  const handleMarkComplete = (value: string) => {
    setMarkCompleteModal(true);
    setTimeValue(value);
  };

  // function for complete mark click api call
  const handleCompleteTask = () => {
    setMarkCompleteModal(false);
    const data = {
      taskid: routineId,
      time: timeValue,
    };
    GroupServices.postCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for incomplete mark click for modal open
  const handleMarkInComplete = (value: string) => {
    setMarkInCompleteModal(true);
    setTimeValue(value);
  };

  // function for incomplete mark click api call
  const handleInCompleteTask = () => {
    setMarkInCompleteModal(false);
    const data = {
      taskid: routineId,
      time: timeValue,
    };
    GroupServices.postInCompleteTask(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.goBack();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Community Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <View style={styles.body}>
          {/* details container */}
          <View style={styles.detailsContainer}>
            <View style={styles.direction}>
              {/* preference section */}
              <View style={styles.preferenceContainer}>
                <View style={styles.preferenceIcon}>
                  {routineDetails?.preferenceicon ? (
                    <Image
                      style={{height: 25, width: 25}}
                      resizeMode="contain"
                      source={{
                        uri: `${routineDetails?.preferenceicon}`,
                      }}
                    />
                  ) : null}
                </View>

                <Text style={styles.preferenceTitle}>
                  {routineDetails?.preferencename}
                </Text>
              </View>

              {/* display complete, edit and delete icon basis of customer id match  */}
              <View style={styles.iconsContainer}>
                {myUserId == routineDetails?.routineCreatedBy ? (
                  <View style={styles.direction}>
                    {/* edit icon  */}
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'EditRoutine',
                          params: {
                            data: routineDetails,
                          },
                        });
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 18, width: 18}}
                        source={require('../../assets/pngImage/editIcon.png')}
                      />
                    </TouchableOpacity>

                    {/* delete icon  */}
                    <TouchableOpacity
                      style={styles.editContainer}
                      onPress={() => {
                        setDeleteModal(true);
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 18, width: 18}}
                        source={require('../../assets/pngImage/Trash.png')}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>

            {/* title and sub title container  */}
            <View style={styles.titleContainer}>
              <Text style={styles.routineTitle}>{routineDetails?.title}</Text>
              <Text style={styles.routineSubTitle}>
                {routineDetails?.subtitle}
              </Text>
            </View>

            {/* date time section  */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.direction}>
                <Image
                  resizeMode="contain"
                  tintColor={colors.WHITE}
                  style={{height: 15, width: 15}}
                  source={require('../../assets/pngImage/CalendarBlank.png')}
                />
                <Text style={styles.date}>
                  {moment(routineDetails?.createddate).format('MM-DD-YYYY')}
                </Text>
              </View>

              {/* time section  */}
              {myUserId == routineDetails?.routineCreatedBy ? (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={routineDetails?.time}
                  renderItem={renderAddedTimeWithComplete}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={routineDetails?.time}
                  renderItem={renderAddedTime}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              )}
            </View>

            {/* description section  */}
            <View style={styles.descriptionContainer}>
              <ScrollView nestedScrollEnabled={true}>
                <Text style={styles.descriptionText}>
                  {routineDetails?.description}
                </Text>
              </ScrollView>
            </View>
          </View>

          {/* Comments section */}
          <View style={styles.commentLabelContainer}>
            <Text style={styles.commentCount}>Comments ({commentCount})</Text>
            <TouchableOpacity
              style={styles.createRoutineContainer}
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'RoutineAllComments',
                  params: {
                    data: routineDetails?.routineid,
                    flow: 'COMMUNITYROUTINE',
                  },
                });
              }}>
              <Text style={styles.createRoutineText}>Add Comment</Text>
              <View style={styles.createRoutineIcon}>
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={require('../../assets/pngImage/editIcon.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* other users comments on this task*/}
          {routineComments?.length > 0 ? (
            <View style={styles.commentContainer}>
              <FlatList
                data={routineComments}
                scrollEnabled={false}
                renderItem={renderCommentsRoutine}
                keyExtractor={(item: any, index: any) => String(index)}
              />

              {/* view all comments  */}
              <TouchableOpacity
                style={{width: 140}}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'RoutineAllComments',
                    params: {
                      data: routineDetails?.routineid,
                      flow: 'COMMUNITYROUTINE',
                    },
                  });
                }}>
                <Text style={styles.viewAllText}>View All Comments</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noCommentContainer}>
              <Image
                resizeMode="contain"
                style={styles.noCommentImage}
                tintColor={colors.WHITE}
                source={require('../../assets/pngImage/noCommentImage.png')}
              />
              <Text style={styles.noCommentText}>No Comments Available</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Delete alert modal for routine delete  */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this routine ?'}
      />

      {/* Delete alert modal for routine mark complete */}
      <DeleteAlertModal
        visibleModal={markCompleteModal}
        onRequestClosed={() => {
          setMarkCompleteModal(false);
        }}
        onPressRightButton={handleCompleteTask}
        subHeading={'Are you sure you want to complete this routine ?'}
      />

      {/* Delete alert modal for routine mark complete */}
      <DeleteAlertModal
        visibleModal={markInCompleteModal}
        onRequestClosed={() => {
          setMarkInCompleteModal(false);
        }}
        onPressRightButton={handleInCompleteTask}
        subHeading={'Are you sure you want to incomplete this routine ?'}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default CommunityDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    margin: 10,
    padding: 10,
  },
  detailsContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  preferenceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 65,
  },
  preferenceIcon: {
    alignItems: 'center',
    backgroundColor: colors.brightGray,
    borderRadius: 50,
    height: 63,
    justifyContent: 'center',
    width: 63,
  },
  preferenceTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 8,
    width: '63%',
  },
  titleContainer: {
    height: 'auto',
    paddingVertical: 10,
    width: '100%',
  },
  routineTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
  },
  routineSubTitle: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
  },
  dateTimeContainer: {
    width: '95%',
  },
  date: {
    color: colors.THEME_WHITE,
    fontSize: 12,
    marginBottom: 10,
    paddingLeft: 5,
  },
  descriptionContainer: {
    height: 'auto',
    marginVertical: 5,
    maxHeight: 160,
    padding: 5,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    textAlign: 'justify',
  },
  commentLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentCount: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 10,
  },
  createRoutineContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 20,
    flexDirection: 'row',
    height: 32,
    justifyContent: 'center',
    width: 127,
  },
  createRoutineIcon: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    height: 24,
    padding: 3,
    width: 24,
  },
  image: {height: '100%', width: '100%', borderRadius: 50},
  createRoutineText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 5,
  },
  viewAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 5,
  },
  commentContainer: {height: '30%'},
  noCommentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: '40%',
    justifyContent: 'center',
  },
  noCommentImage: {
    height: 135,
    width: 135,
  },
  noCommentText: {
    color: colors.THEME_BLACK,
    fontSize: 18,
    fontWeight: '500',
    padding: 20,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  iconsContainer: {width: '20%'},
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
});
