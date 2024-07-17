//external imports
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommentImageOnEditModal from '../groups/CommentImageOnEditModal';
import CommentImagesTab from '../groups/CommentImagesTab';
import CustomHeader from '../../constants/CustomHeader';
import NotesService from '../../service/NotesService';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import RecentlyAddedMembersTab from '../groups/RecentlyAddedMembersTab';
import InviteMemberOnRoutineModal from '../routine/InviteMemberOnRoutineModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditNotes = ({navigation, route}: {navigation: any; route: any}) => {
  const [arrayList, setArrayList] = useState<any[]>([]);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [descriptionState, setDescriptionState] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const [notesDescription, setNotesDescription] = useState<string>();
  const [notesTitle, setNotesTitle] = useState<string>();
  const [notesTags, setNotesTags] = useState<string>();
  const [titleState, setTitleState] = useState(false);
  const [notesType, setNotesType] = useState('S');
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<any[]>([]);
  const [userType, setUserType] = useState('1');

  useEffect(() => {
    getData();

    setFeedbackImage([]);
    // for public or private type
    if (route?.params?.data?.privacy === 'Private') {
      setNotesType('S');
    } else {
      setNotesType('P');
    }
    //for pre selected images id
    if (route?.params?.data?.imagedetails != null) {
      let imageId = route?.params?.data?.imagedetails.map(
        (e: any) => e.imageid,
      );
      setArrayList(imageId);
    }
    // for title
    setNotesTitle(route?.params?.data?.notes_title);
    // for description
    setNotesDescription(route?.params?.data?.notes_text);
    // for tags
    if (route?.params?.data?.tags != null) {
      setNotesTags(route?.params?.data?.tags);
    }
    //pre selected member list
    let memberIdList = route?.params?.data?.allmembers?.map((e: any) => e.id);
    setSelectedMembersId(memberIdList);
    setSelectedMembersList(route?.params?.data?.allmembers);
  }, []);

  // function for get user type
  const getData = async () => {
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);
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

  // function for submit button click on api call to edit notes
  const handleSubmit = (values: any) => {
    if (notesTitle == '') {
      setTitleState(true);
    } else if (notesDescription == '') {
      setDescriptionState(true);
    } else {
      setTitleState(false);
      setDescriptionState(false);

      const editData = new FormData();
      if (feedbackImage !== null) {
        feedbackImage.map((e: any, index: any) => {
          editData.append(`images[${index}]`, e);
        });
      }
      editData.append('privacy', notesType);
      editData.append('id', route?.params?.data?.id);
      editData.append('title', notesTitle);
      editData.append('description', notesDescription);
      editData.append('tags', notesTags);
      if (selectedMembersId?.length > 0) {
        selectedMembersId.map((e: number, index: any) => {
          editData.append(`userid[${index}]`, e);
        });
      }

      if (arrayList !== null) {
        arrayList.forEach((e: any) =>
          editData.append('preselectedimagesid[]', e),
        );
      }

      NotesService.postEditNotes(editData)
        .then((response: any) => {
          navigation.navigate('StackNavigation', {
            screen: 'NotesDetails',
          });
        })
        .catch(error => {
          console.log('error', JSON.stringify(error));
        });
    }
  };
  // function for member modal close
  const handleMemberIdModalClose = () => {
    setMemberIdModal(false);
  };

  // function for close modal after member add
  const handleMemberIdAddClick = (memberIdList: any[], memberList: any[]) => {
    setMemberIdModal(false);
    setSelectedMembersId(memberIdList);
    setSelectedMembersList(memberList);
  };

  // function on remove selected members
  const handleRemoveImage = (selectedImagesId: number) => {
    if (arrayList.includes(selectedImagesId)) {
      setArrayList(arrayList.filter(ids => ids !== selectedImagesId));
    }
  };

  // list for pre added notes image
  const renderPreAddedNotesImages = ({item}: {item: any; index: any}) => {
    return (
      <CommentImageOnEditModal
        commentImages={item}
        removeImage={handleRemoveImage}
        checkedList={arrayList}
      />
    );
  };

  // list for image son comments
  const renderAddedNotesImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // list for time with cross icon
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Edit Notes'}
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
        <>
          {/* public and private section  */}
          {userType == '1' ? (
            <View style={styles.notesContainer}>
              <TouchableOpacity
                style={
                  notesType === 'S'
                    ? styles.selectedPublicContainer
                    : styles.publicContainer
                }
                onPress={() => {
                  setNotesType('S');
                }}>
                <Image
                  resizeMode="contain"
                  style={
                    notesType === 'S'
                      ? styles.selectedIcon
                      : styles.unselectedIcon
                  }
                  source={require('../../assets/pngImage/Lock.png')}
                />
                <Text
                  style={
                    notesType === 'S'
                      ? styles.selectedPublicText
                      : styles.publicText
                  }>
                  Private Notes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  notesType === 'P'
                    ? styles.selectedPublicContainer
                    : styles.publicContainer
                }
                onPress={() => {
                  setNotesType('P');
                }}>
                <Image
                  resizeMode="contain"
                  style={
                    notesType === 'P'
                      ? styles.selectedIcon
                      : styles.unselectedIcon
                  }
                  source={require('../../assets/pngImage/Globe.png')}
                />
                <Text
                  style={
                    notesType === 'P'
                      ? styles.selectedPublicText
                      : styles.publicText
                  }>
                  Public Notes
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* title section  */}
          <TextInput
            value={notesTitle}
            style={styles.titleInput}
            onChangeText={text => {
              setNotesTitle(text);
              setTitleState(false);
            }}
          />
          {/* error section is case of empty field  */}
          <Text style={styles.errorMessage}>
            {titleState ? '*Title is required' : null}
          </Text>

          <TextInput
            style={styles.titleInput}
            value={notesDescription}
            numberOfLines={6}
            multiline={true}
            textAlignVertical="top"
            onChangeText={text => {
              setNotesDescription(text);
              setDescriptionState(false);
            }}
          />
          {/* error section is case of empty field  */}
          <Text style={styles.errorMessage}>
            {descriptionState ? '*Description is required' : null}
          </Text>

          {/* tags section */}
          <View style={{marginBottom: 10}}>
            <TextInput
              value={notesTags}
              style={styles.titleInput}
              onChangeText={text => {
                setNotesTags(text);
              }}
            />
          </View>

          {/* pre selected image section  */}
          {route?.params?.data?.imagedetails?.length >= 0 ? (
            <FlatList
              data={route?.params?.data?.imagedetails}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={renderPreAddedNotesImages}
              keyExtractor={(item: any, index: any) => String(index)}
            />
          ) : null}

          <View style={{marginVertical: 5}}>
            {feedbackImage?.length >= 0 ? (
              <FlatList
                data={feedbackImage}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderAddedNotesImages}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            ) : null}
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setCameraGalleryModal(true)}
              style={styles.uploadMediaContainer}>
              <Image
                style={styles.uploadImageStyle}
                resizeMode="contain"
                source={require('../../assets/pngImage/UploadMedia.png')}
              />
              <Text style={styles.uploadMediaText}>Upload Media</Text>
            </TouchableOpacity>
          </View>

          {/* invite member section */}
          {userType == '1' ? (
            <TouchableOpacity
              style={styles.inviteMemberContainer}
              onPress={() => {
                setMemberIdModal(true);
              }}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={require('../../assets/pngImage/UserPlus.png')}
              />
              <Text style={styles.inviteMemberText}>Invite new user</Text>
            </TouchableOpacity>
          ) : null}

          {selectedMembersList?.length > 0 ? (
            <FlatList
              data={selectedMembersList}
              renderItem={renderAddedMembers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any, index: any) => String(index)}
            />
          ) : null}

          {/* save group button  */}
          <View style={{paddingTop: 20}}>
            <SubmitButton buttonText={'Submit'} submitButton={handleSubmit} />
          </View>

          {/* Camera Gallery Modal  */}
          <CameraGalleryModal
            visibleModal={cameraGalleryModal}
            onClose={() => {
              setCameraGalleryModal(false);
            }}
            cameraClick={openCamera}
            galleryClick={openLibrary}
          />

          {/* Member Email Id modal  */}
          <InviteMemberOnRoutineModal
            visibleModal={memberIdModal}
            onClose={handleMemberIdModalClose}
            onSubmitClick={handleMemberIdAddClick}
            navigation={navigation}
            selectedMembersId={selectedMembersId}
            selectedMembersList={selectedMembersList}
          />
        </>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditNotes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  notesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  publicContainer: {
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '45%',
  },
  publicText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  selectedPublicContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '45%',
  },
  selectedPublicText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  unselectedIcon: {
    tintColor: colors.WHITE,
  },
  selectedIcon: {
    tintColor: colors.THEME_ORANGE,
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
    marginVertical: 20,
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  uploadMediaText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
  },
  inviteMemberContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK2,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 30,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
    marginBottom: 10,
    width: '48%',
  },
  inviteMemberText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  titleInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderColor: colors.brightGray,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.WHITE,
    fontSize: 16,
    height: 150,
    padding: 15,
  },
  errorMessage: {
    color: colors.RED,
    paddingHorizontal: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
});
