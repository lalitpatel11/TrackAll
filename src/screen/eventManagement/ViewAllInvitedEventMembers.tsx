// external imports
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
// internal imports
import AllInvitedEventMemberTab from './AllInvitedEventMemberTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import RemoveEventMemberModal from './RemoveEventMemberModal';
import {colors} from '../../constants/ColorConstant';

const ViewAllInvitedEventMembers = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [eventId, setEventId] = useState<number>(route?.params?.id);
  const [eventMembers, setEventMembers] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [removeMemberIdModal, setRemoveMemberIdModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEventId(route?.params?.id);
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all event member data on api call
  const getData = () => {
    const data = {
      eventid: eventId,
    };
    EventService.postViewAllEventMember(data)
      .then((response: any) => {
        setPageLoader(false);
        setEventMembers(response.data.users);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all event member data on api call
  const getSearchMemberData = (text: string) => {
    setPageLoader(true);
    const data = {
      eventid: eventId,
      search: text,
    };
    EventService.postViewAllEventMember(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response.data.users.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setEventMembers(response.data.users);
        } else {
          setPageLoader(false);
          setNoData(true);
          setEventMembers(response.data.users);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for all invited members
  const renderEventMember = ({item}: {item: any; index: any}) => {
    return <AllInvitedEventMemberTab item={item} />;
  };

  // function for remove event member on api call
  const handleRemoveMemberIdSubmitClick = (memberList: number[]) => {
    Keyboard.dismiss();
    setRemoveMemberIdModal(false);
    const data = new FormData();
    data.append('eventid', eventId);
    memberList.map((e: number, index: any) => {
      data.append(`userid[${index}]`, e);
    });
    EventService.postRemoveEventMember(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData(); // refresh the member list
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'All Members'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* search field  */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search By Member Name"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              getSearchMemberData(text);
            }}
          />
        </View>
        <View style={styles.searchContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/searchIcon.png')}
          />
        </View>
      </View>

      {/* body section */}
      {!pageLoader ? (
        eventMembers?.length > 0 ? (
          <View style={styles.body}>
            {/* all members and remove button section */}
            <View style={styles.textDirection}>
              <Text style={styles.labelText}>All Members</Text>
              <TouchableOpacity
                onPress={() => {
                  setRemoveMemberIdModal(true);
                }}>
                <Text style={styles.viewAllText}>Remove Members</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: '95%',
              }}>
              <FlatList
                data={eventMembers}
                renderItem={renderEventMember}
                numColumns={3}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>No Member Invited. </Text>
            ) : (
              <Text style={styles.noDataText}>No Result Found</Text>
            )}
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Remove Member from group modal  */}
      <RemoveEventMemberModal
        visibleModal={removeMemberIdModal}
        onClose={() => {
          setRemoveMemberIdModal(false);
        }}
        onSubmitClick={handleRemoveMemberIdSubmitClick}
        eventId={eventId}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default ViewAllInvitedEventMembers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
    flex: 1,
    paddingBottom: 40,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
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
    height: 45,
    justifyContent: 'center',
    width: '14%',
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
  },
  viewAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
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
    height: '83%',
    justifyContent: 'center',
  },
});
