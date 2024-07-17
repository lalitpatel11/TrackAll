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
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
// internal imports
import CustomHeader from '../../constants/CustomHeader';
import NotesService from '../../service/NotesService';
import ShareNotesModal from './ShareNotesModal';
import ShareNotesSuccessModal from './ShareNotesSuccessModal';
import {colors} from '../../constants/ColorConstant';
import PinUnpinNotesCard from './PinUnpinNotesCard';

const Notes = ({navigation}: {navigation: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [shareNotesId, setShareNotesId] = useState(0);
  const [shareNotesModal, setShareNotesModal] = useState(false);
  const [sharedNotesSuccessModal, setSharedNotesSuccessModal] = useState(false);
  const [notesTitle, setNotesTitle] = useState('MyNotes');
  const [myNotes, setMyNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [groupId, setGroupId] = useState([]);

  // function for open side menu
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setNotesTitle('MyNotes');
      setSearchText('');
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get my note data on api call
  const getData = () => {
    setPageLoader(true);
    NotesService.getMyNotes()
      .then((response: any) => {
        setPageLoader(false);
        setMyNotes(response?.data?.mynoteslisting);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get shared note data on api call
  const getSharedNotesData = () => {
    NotesService.getSharedNotes()
      .then((response: any) => {
        setPageLoader(false);
        setSharedNotes(response?.data?.sharednoteslisting);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get public note data on api call
  const getPublicNotesData = () => {
    NotesService.getPublicNotes()
      .then((response: any) => {
        setPageLoader(false);
        setPublicNotes(response?.data?.publicnoteslisting);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get my note data on api call
  const getPinnedNotesData = () => {
    NotesService.getPinnedNotes()
      .then((response: any) => {
        setPageLoader(false);
        setPinnedNotes(response?.data?.pinnednoteslisting);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  /* my notes, shared notes, public notes and pinned notes on api call section */
  const searchNotes = (text: string) => {
    const data = {
      search: text,
    };
    setPageLoader(true);
    if (notesTitle == 'MyNotes') {
      NotesService.getSearchMyNotes(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response?.data?.mynoteslisting.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setMyNotes(response?.data?.mynoteslisting);
          } else {
            setPageLoader(false);
            setNoData(true);
            setMyNotes(response?.data?.mynoteslisting);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    } else if (notesTitle == 'SharedNotes') {
      NotesService.getSearchSharedNotes(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response?.data?.sharednoteslisting.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setSharedNotes(response?.data?.sharednoteslisting);
          } else {
            setPageLoader(false);
            setNoData(true);
            setSharedNotes(response?.data?.sharednoteslisting);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    } else if (notesTitle == 'PublicNotes') {
      NotesService.getSearchPublicNotes(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response?.data?.publicnoteslisting?.length >= 0) {
            setPageLoader(false);
            setNoData(false);
            setPublicNotes(response?.data?.publicnoteslisting);
          } else {
            setPageLoader(false);
            setNoData(true);
            setPublicNotes(response?.data?.publicnoteslisting);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    } else if (notesTitle == 'PinnedNotes') {
      NotesService.getSearchPinnedNotes(data)
        .then((response: any) => {
          setPageLoader(false);
          if (response?.data?.pinnednoteslisting.length > 0) {
            setPageLoader(false);
            setNoData(false);
            setPinnedNotes(response?.data?.pinnednoteslisting);
          } else {
            setPageLoader(false);
            setNoData(true);
            setPinnedNotes(response?.data?.pinnednoteslisting);
          }
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    }
  };

  // list for all pined and unpinned notes
  const renderPinUnPinNotesItem = ({item}: {item: any; index: any}) => {
    return (
      <PinUnpinNotesCard
        items={item}
        handleView={handleViewNotes}
        handleUnpin={handleUnpinNotes}
        handleShareNote={handleShareNotes}
        handlePin={handlePinNotes}
      />
    );
  };

  // function for open modal on share icon click
  const handleShareNotes = (id: number, data: any) => {
    setShareNotesId(id);
    setShareNotesModal(true);
    setGroupId(data);
  };

  // function for submit button click on api call to un pin any notes
  const handleUnpinNotes = (unpinNotesId: number) => {
    const body = {
      status: 0,
      noteid: unpinNotesId,
    };

    NotesService.getPinUnPinNotes(body)
      .then((response: any) => {
        getData(); // for refresh the notes page
        getSharedNotesData();
        getPublicNotesData();
        getPinnedNotesData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for submit button click on api call to pin any notes
  const handlePinNotes = (pinNotesId: number) => {
    const body = {
      status: 1,
      noteid: pinNotesId,
    };

    NotesService.getPinUnPinNotes(body)
      .then((response: any) => {
        getData(); // for refresh the notes page
        getSharedNotesData();
        getPublicNotesData();
        getPinnedNotesData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // navigation for notes details on notes tab click
  const handleViewNotes = (notesId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'NotesDetails',
      params: {id: notesId},
    });
  };

  // function for close modal on share note close click
  const handleShareNotesModalClose = () => {
    setShareNotesModal(false);
  };

  // function for submit button click on api call to share notes
  const handleShareNotesSubmitClick = (list: any[]) => {
    setButtonLoader(true);
    const feedBackData = new FormData();
    feedBackData.append('note_id', shareNotesId);
    list.map((e: number, index: any) => {
      feedBackData.append(`group_id[${index}]`, e);
    });
    setGroupCount(list.length);

    NotesService.postShareNotes(feedBackData)
      .then((response: any) => {
        setButtonLoader(false);
        setShareNotesModal(false);
        setSharedNotesSuccessModal(true);
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  // function for close modal on success share click
  const handleShareRoutineSuccessModalClose = () => {
    setSharedNotesSuccessModal(false);
  };

  // navigation for notes details on notes click
  const handleShareRoutineSuccessSubmitClick = () => {
    setSharedNotesSuccessModal(false);
    navigation.navigate('StackNavigation', {
      screen: 'NotesDetails',
      params: {id: shareNotesId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Notes'}
        drawerButton={{
          visible: true,
          onClick: () => {
            handleOpenDrawer();
          },
        }}
        bellButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'Notifications',
            });
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* my notes, shared notes, public notes and pinned notes button section */}
        <View style={styles.categoryContainer}>
          {/* my notes section  */}
          <TouchableOpacity
            onPress={() => {
              setNotesTitle('MyNotes');
              getData();
            }}
            style={styles.selectedCategoryTab}>
            <Image
              style={styles.categoryImage}
              tintColor={
                notesTitle === 'MyNotes' ? colors.THEME_ORANGE : colors.WHITE
              }
              resizeMode="contain"
              source={require('../../assets/pngImage/myevent.png')}
            />
            <Text
              style={
                notesTitle === 'MyNotes'
                  ? styles.selectedCategoryText
                  : styles.unSelectedCategoryText
              }>
              My Notes
            </Text>
          </TouchableOpacity>

          {/* shared notes section  */}
          <TouchableOpacity
            onPress={() => {
              setNotesTitle('SharedNotes');
              getSharedNotesData();
            }}
            style={styles.selectedCategoryTab}>
            <Image
              style={styles.categoryImage}
              tintColor={
                notesTitle === 'SharedNotes'
                  ? colors.THEME_ORANGE
                  : colors.WHITE
              }
              resizeMode="contain"
              source={require('../../assets/pngImage/sharedevent.png')}
            />
            <Text
              style={
                notesTitle === 'SharedNotes'
                  ? styles.selectedCategoryText
                  : styles.unSelectedCategoryText
              }>
              Shared Notes
            </Text>
          </TouchableOpacity>

          {/* public notes section  */}
          <TouchableOpacity
            onPress={() => {
              setNotesTitle('PublicNotes');
              getPublicNotesData();
            }}
            style={styles.selectedCategoryTab}>
            <Image
              style={styles.categoryImage}
              tintColor={
                notesTitle === 'PublicNotes'
                  ? colors.THEME_ORANGE
                  : colors.WHITE
              }
              resizeMode="contain"
              source={require('../../assets/pngImage/nearbyevent.png')}
            />
            <Text
              style={
                notesTitle === 'PublicNotes'
                  ? styles.selectedCategoryText
                  : styles.unSelectedCategoryText
              }>
              Public Notes
            </Text>
          </TouchableOpacity>

          {/* pinned notes section  */}
          <TouchableOpacity
            onPress={() => {
              setNotesTitle('PinnedNotes');
              getPinnedNotesData();
            }}
            style={styles.selectedCategoryTab}>
            <Image
              style={styles.categoryImage}
              tintColor={
                notesTitle === 'PinnedNotes'
                  ? colors.THEME_ORANGE
                  : colors.WHITE
              }
              resizeMode="contain"
              source={require('../../assets/pngImage/nearbyevent.png')}
            />
            <Text
              style={
                notesTitle === 'PinnedNotes'
                  ? styles.selectedCategoryText
                  : styles.unSelectedCategoryText
              }>
              Pinned Notes
            </Text>
          </TouchableOpacity>
        </View>

        {/* search box */}
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search notes by name"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                searchNotes(text);
              }}
            />
          </View>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require('../../assets/pngImage/searchIcon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {!pageLoader ? (
        <View style={{height: '74%'}}>
          {/* notes body */}
          {notesTitle == 'MyNotes' ? (
            <>
              {myNotes?.length > 0 ? (
                <>
                  <View style={styles.unPinedNotesContainer}>
                    <FlatList
                      data={myNotes}
                      renderItem={renderPinUnPinNotesItem}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  {!noData ? (
                    <Text style={styles.noDataText}>
                      No Notes created yet. {'\n'}Click on the "Create Icon" to
                      create a Notes.
                    </Text>
                  ) : (
                    <Text style={styles.noDataText}>No result found</Text>
                  )}
                </View>
              )}
            </>
          ) : notesTitle == 'SharedNotes' ? (
            <>
              {sharedNotes?.length > 0 ? (
                <>
                  <View style={styles.unPinedNotesContainer}>
                    <FlatList
                      data={sharedNotes}
                      renderItem={renderPinUnPinNotesItem}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  {!noData ? (
                    <Text style={styles.noDataText}>No Notes shared yet.</Text>
                  ) : (
                    <Text style={styles.noDataText}>No result found</Text>
                  )}
                </View>
              )}
            </>
          ) : notesTitle == 'PublicNotes' ? (
            <>
              {publicNotes?.length > 0 ? (
                <>
                  <View style={styles.unPinedNotesContainer}>
                    <FlatList
                      data={publicNotes}
                      renderItem={renderPinUnPinNotesItem}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  {!noData ? (
                    <Text style={styles.noDataText}>
                      No Notes created yet. {'\n'}Click on the "Create Icon" to
                      create a Notes.
                    </Text>
                  ) : (
                    <Text style={styles.noDataText}>No result found</Text>
                  )}
                </View>
              )}
            </>
          ) : notesTitle == 'PinnedNotes' ? (
            <>
              {pinnedNotes?.length > 0 ? (
                <>
                  <View style={styles.unPinedNotesContainer}>
                    <FlatList
                      data={pinnedNotes}
                      renderItem={renderPinUnPinNotesItem}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  {!noData ? (
                    <Text style={styles.noDataText}>No Notes pinned yet.</Text>
                  ) : (
                    <Text style={styles.noDataText}>No result found</Text>
                  )}
                </View>
              )}
            </>
          ) : null}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create notes icon  */}
      <LinearGradient
        colors={['#F28520', '#F5BD35']}
        style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'CreateNotes',
            });
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Share Routine Modal */}
      <ShareNotesModal
        buttonLoader={buttonLoader}
        visibleModal={shareNotesModal}
        onClose={handleShareNotesModalClose}
        onSubmitClick={handleShareNotesSubmitClick}
        notesData={groupId}
      />

      {/* Share Routine Success Modal */}
      <ShareNotesSuccessModal
        groupCount={groupCount}
        visibleModal={sharedNotesSuccessModal}
        onClose={handleShareRoutineSuccessModalClose}
        onSubmitClick={handleShareRoutineSuccessSubmitClick}
      />
    </View>
  );
};

export default Notes;

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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputContainer: {
    borderRadius: 8,
    width: '83%',
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
  notesHeading: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  pinedNotesContainer: {
    height: 'auto',
    maxHeight: '35%',
    paddingVertical: 5,
  },
  unPinedNotesContainer: {
    flex: 1,
    marginBottom: 10,
    paddingBottom: 10,
    paddingVertical: 5,
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
    height: '58%',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  selectedCategoryTab: {
    alignItems: 'center',
    width: '25%',
  },
  categoryImage: {
    height: 20,
    marginTop: 5,
    width: 20,
  },
  selectedCategoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.THEME_ORANGE,
    fontSize: 12,
    fontWeight: '500',
    padding: 2,
    textAlign: 'center',
  },
  unSelectedCategoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    padding: 2,
    textAlign: 'center',
  },
});
