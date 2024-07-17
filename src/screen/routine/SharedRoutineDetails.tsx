//external imports
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
import React, {useEffect, useState} from 'react';
import moment from 'moment';
//internal imports
import AddedTimeTab from '../groups/AddedTimeTab';
import CommentsOnRoutine from './CommentsOnRoutine';
import CustomHeader from '../../constants/CustomHeader';
import RoutineService from '../../service/RoutineService';
import {colors} from '../../constants/ColorConstant';

const SharedRoutineDetails = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [commentCount, setCommentCount] = useState(0);
  const [pageLoader, setPageLoader] = useState(false);
  const [routineComments, setRoutineComments] = useState<any[]>([]);
  const [routineDetails, setRoutineDetails] = useState({});
  const [routineId, setRoutineId] = useState(route?.params?.id);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDetails();
      getComments();
      setRoutineId(route?.params?.id);
    });
    return unsubscribe;
  }, [navigation]);

  // function for get routine details data on api call
  const getDetails = async () => {
    let data: any = {
      routineid: routineId,
    };
    setPageLoader(true);
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

  // function for get all comments data on api call
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

  // navigation on routine comments page on view click
  const handleViewCommentsClick = (id: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'RoutineAllComments',
      params: {
        data: id,
        flow: 'SHAREDROUTINE',
      },
    });
  };

  // list for comments on routine
  const renderCommentsRoutine = ({item}: {item: any; index: any}) => {
    return (
      <CommentsOnRoutine
        data={item}
        viewCommentsClick={handleViewCommentsClick}
        routineId={routineDetails?.routineid}
      />
    );
  };

  // list for added time
  const renderAddedTime = ({item}: {item: any; index: any}) => {
    return <AddedTimeTab items={item} />;
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Routine Details'}
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
            {/* preference section */}
            <View style={styles.preferenceContainer}>
              <View style={styles.preferenceIcon}>
                {routineDetails?.preferenceicon ? (
                  <Image
                    style={{height: 45, width: 45}}
                    resizeMode="contain"
                    source={{
                      uri: `${routineDetails?.preferenceicon}`,
                    }}
                  />
                ) : null}
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.preferenceTitle}>
                  {routineDetails?.preferencename}
                </Text>

                {/* routine type */}
                <Text style={styles.routineType}>
                  ({routineDetails?.routinetype})
                </Text>
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
                  style={styles.icon}
                  source={require('../../assets/pngImage/CalendarBlank.png')}
                />
                <Text style={styles.date}>
                  {moment(routineDetails?.createddate).format('MM-DD-YYYY')}
                </Text>
              </View>

              {/* time section  */}
              {routineDetails?.time !== null ? (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={routineDetails?.time}
                  renderItem={renderAddedTime}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}
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
                    flow: 'SHAREDROUTINE',
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
                      flow: 'SHAREDROUTINE',
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
                tintColor={colors.WHITE}
                style={styles.noCommentImage}
                source={require('../../assets/pngImage/noCommentImage.png')}
              />
              <Text style={styles.noCommentText}>No Comments Available!</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </View>
  );
};
export default SharedRoutineDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
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
  nameContainer: {
    paddingHorizontal: 8,
    width: '63%',
  },
  preferenceTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 5,
  },
  routineType: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
  },
  titleContainer: {
    height: 'auto',
    paddingVertical: 10,
    width: '100%',
  },
  routineTitle: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
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
  icon: {
    height: 15,
    width: 15,
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
    height: 20,
    padding: 3,
    width: 20,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
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
    height: '30%',
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
  submitButtonContainer: {marginVertical: 20},
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
});
