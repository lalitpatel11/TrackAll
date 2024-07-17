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
import React, {useEffect, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//internal imports
import CameraGalleryModal from '../groups/CameraGalleryModal';
import CommentImagesTab from '../groups/CommentImagesTab';
import CustomHeader from '../../constants/CustomHeader';
import NotesService from '../../service/NotesService';
import SubmitButton from '../../constants/SubmitButton';
import {colors} from '../../constants/ColorConstant';
import {notesValidation} from '../../constants/SchemaValidation';
import InviteMemberOnRoutineModal from '../routine/InviteMemberOnRoutineModal';
import RecentlyAddedMembersTab from '../groups/RecentlyAddedMembersTab';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateNotes = ({navigation, route}: {navigation: any; route: any}) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<any[]>([]);
  const [notesId, setNotesId] = useState();
  const [notesType, setNotesType] = useState('S');
  const [memberIdModal, setMemberIdModal] = useState(false);
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<any[]>([]);
  const [groupId, setGroupId] = useState(route?.params?.data);
  const [userType, setUserType] = useState('1');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // group id
      setGroupId(route?.params?.data);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

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

  // list for images on comments
  const renderAddNotesImages = ({item}: {item: any; index: any}) => {
    return <CommentImagesTab commentImages={item} />;
  };

  // function for member modal close
  const handleMemberIdModalClose = () => {
    setMemberIdModal(false);
  };

  // function for close modal after member add
  const handleMemberIdAddClick = (memberList: any[], userList: any[]) => {
    setMemberIdModal(false);
    setSelectedMembersId(memberList);
    setSelectedMembersList(userList);
  };

  // list for time with cross icon
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  //  function for notes submit button click with api call
  const onSubmit = (values: any) => {
    setButtonLoader(true);

    const feedBackData = new FormData();
    if (feedbackImage !== null) {
      feedbackImage.map((e: any, index: any) => {
        feedBackData.append(`images[${index}]`, e);
      });
    }
    feedBackData.append('privacy', notesType);
    feedBackData.append('title', values.title);
    feedBackData.append('description', values.description);
    feedBackData.append('tags', values.notesTag);
    if (selectedMembersId?.length > 0) {
      selectedMembersId.map((e: number, index: any) => {
        feedBackData.append(`userid[${index}]`, e);
      });
    }

    if (route?.params?.data != null || route?.params?.data != '') {
      feedBackData.append('group_id', route?.params?.data);
    }

    NotesService.postCreateNotes(feedBackData)
      .then((response: any) => {
        setButtonLoader(false);
        navigation.replace('StackNavigation', {
          screen: 'NotesDetails',
          params: {
            id: response?.data?.noteid,
          },
        });
        setNotesId(response?.data?.noteid);
      })
      .catch((error: any) => {
        setButtonLoader(false);
        console.log(error);
      });
  };

  const initialValues = {
    description: '',
    title: '',
    notesTag: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Create Note'}
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
          validationSchema={notesValidation}
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
              <View>
                <TextInput
                  placeholder="Enter Title"
                  placeholderTextColor={colors.textGray}
                  style={styles.titleInput}
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

              {/*Description section  */}
              <View>
                <TextInput
                  placeholder="Type Note Description…"
                  placeholderTextColor={colors.textGray}
                  style={styles.descriptionInput}
                  value={values.description}
                  numberOfLines={8}
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

              {/* tags section  */}
              <View>
                <TextInput
                  placeholder="Notes tag (Optional)"
                  placeholderTextColor={colors.textGray}
                  style={styles.titleInput}
                  value={values.notesTag}
                  onChangeText={handleChange('notesTag')}
                  onBlur={() => {
                    handleBlur('notesTag');
                    setFieldTouched('notesTag');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {/* {touched.notesTag && errors.notesTag} */}
                </Text>
              </View>

              {feedbackImage?.length > 0 ? (
                <FlatList
                  data={feedbackImage}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderAddNotesImages}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : null}

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

              {/* invite member section */}
              {userType == '1' ? (
                <View>
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
                </View>
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
              <View style={{paddingBottom: 20}}>
                <SubmitButton
                  buttonText={'Submit'}
                  submitButton={handleSubmit}
                  loader={buttonLoader}
                />
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
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateNotes;

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
