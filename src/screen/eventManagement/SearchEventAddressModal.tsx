// external imports
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {Dimensions} from 'react-native';
// internal imports
import CustomHeader from '../../constants/CustomHeader';
import EventService from '../../service/EventService';
import SearchEventAddress from './SearchEventAddress';
import {colors} from '../../constants/ColorConstant';
import {debounce} from 'lodash';
import {height} from './EventAllComments';

const SearchEventAddressModal = ({
  onArrowClick,
  onRequestClosed,
  selectedEventAddress,
  visibleModal,
}: {
  onArrowClick: Function;
  onRequestClosed: Function;
  selectedEventAddress: Function;
  visibleModal: boolean;
}) => {
  const [nextPageToken, setNextPageToken] = useState('');
  const [pullRefresh, setPullRefresh] = useState(false);
  const [receivedSearchEventAddress, setReceivedSearchEventAddress] = useState<
    any[]
  >([]);
  const newStyles = styles({windowHeight});
  const windowHeight = Dimensions.get('window').height;

  // function for Search Event Address api call
  const handleSearchEventAddress = (text: string) => {
    EventService.getEventAddress(text)
      .then((response: any) => {
        setReceivedSearchEventAddress(response.data.results);
        setNextPageToken(response.data.next_page_token);
      })
      .catch((error: any) => {});
  };

  // function for address click
  const handleAddressClick = (item: any) => {
    onRequestClosed(item);
    selectedEventAddress(item);
  };

  // list for suggested location for event
  const renderEventItem = ({item}: {item: any}) => {
    return (
      <>
        <SearchEventAddress item={item} onAddressClick={handleAddressClick} />
      </>
    );
  };

  //function : modal function
  const closeModal = () => {
    onArrowClick();
  };

  const eventAddressOnPageLoad = (loadMore: boolean) => {
    setPullRefresh(true);
    EventService.getEventAddress(nextPageToken)
      .then((response: any) => {
        setPullRefresh(false);
        !loadMore
          ? setReceivedSearchEventAddress(response.data.results)
          : setReceivedSearchEventAddress([
              ...receivedSearchEventAddress,
              ...response.data.results,
            ]);
      })
      .catch((error: any) => {
        setPullRefresh(false);
      });
  };

  const onRefresh = () => {
    eventAddressOnPageLoad(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlerSearch = useCallback(
    debounce((value: string) => handleSearchEventAddress(value), 1000),
    [],
  );

  const handleEmpty = (
    <View
      style={{
        flex: 1,
      }}>
      <Image
        resizeMode="contain"
        source={require('../../assets/pngImage/searchAddBg.png')}
        style={{
          width: '100%',
          height: height / 2,
          alignSelf: 'center',
          opacity: 0.3,
        }}
      />
    </View>
  );

  return (
    <Modal
      animationType="fade"
      visible={visibleModal}
      onRequestClose={() => {
        onRequestClosed();
      }}>
      <SafeAreaView style={newStyles.mainContainer}>
        <View style={newStyles.mainContainer}>
          {/* header section */}
          <CustomHeader
            headerText={'Search Address'}
            backButton={{
              visible: true,
              onClick: () => {
                onArrowClick();
              },
            }}
          />
          <View style={newStyles.mainView}>
            <View style={newStyles.subContainer}>
              <View style={newStyles.searchContainer}>
                <View style={newStyles.searchUserTextField}></View>

                <View>
                  <TextInput
                    placeholder={'Search Address'}
                    style={newStyles.searchUserText}
                    onChangeText={(text: string) => {
                      handlerSearch(text); // function call on every text change
                    }}
                    placeholderTextColor={colors.WHITE}
                  />
                </View>
              </View>
              {receivedSearchEventAddress?.length > 0 ? (
                <View style={newStyles.listContainer}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    data={receivedSearchEventAddress}
                    renderItem={renderEventItem}
                    keyExtractor={item => item.id}
                    refreshing={pullRefresh}
                    onRefresh={onRefresh}
                    onEndReached={() => {
                      // eventAddressOnPageLoad(true);
                    }}
                  />
                </View>
              ) : (
                <>{handleEmpty}</>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchEventAddressModal;

const styles = () =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: colors.BLACK + '66',
      flex: 1,
    },
    mainView: {
      padding: 20,
    },
    subContainer: {
      paddingHorizontal: 20,
    },
    searchContainer: {
      borderRadius: 8,
      backgroundColor: colors.GRAY,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchUserTextField: {
      left: 10,
      position: 'absolute',
      top: 18,
      zIndex: 1,
    },
    searchUserText: {
      backgroundColor: colors.GRAY,
      color: colors.WHITE,
      height: 50,
      marginLeft: 30,
      width: '85%',
    },
    listContainer: {
      marginVertical: 10,
      borderRadius: 10,
      height: 'auto',
      maxHeight: '86%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loaderContainer: {
      alignSelf: 'center',
      top: 150,
    },
    buttonContainer: {
      paddingBottom: 20,
    },
    emptyData: {
      color: colors.GRAY,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 50,
      textAlign: 'center',
    },
  });
