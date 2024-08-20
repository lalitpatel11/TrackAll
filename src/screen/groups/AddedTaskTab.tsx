// external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';
import AddedComments from './AddedComments';
import CommonToast from '../../constants/CommonToast';
import AddedTimeTab from './AddedTimeTab';

const AddedTaskTab = ({
  isEdit,
  items,
  myUserId,
  onTaskTabClick,
  viewTaskClicks,
}: {
  isEdit: any | boolean;
  items: any;
  myUserId: number;
  onTaskTabClick: Function;
  viewTaskClicks: Function;
}) => {
  const toastRef = useRef<any>();

  // list for added comments
  const renderAddedComments = ({item}: {item: any; index: any}) => {
    return (
      <AddedComments
        data={item}
        viewTaskClick={viewTaskClicks}
        taskId={items?.id}
        taskType={items?.task_type}
      />
    );
  };

  // list for added time
  const renderAddedTime = ({item}: {item: any; index: any}) => {
    return <AddedTimeTab items={item} />;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onTaskTabClick(items)}>
        <Text style={styles.taskType}>
          {items?.task_type === 'T'
            ? 'Task'
            : items?.task_type === 'R'
            ? 'Routine'
            : items?.task_type === 'N'
            ? 'Notes'
            : items?.task_type === 'A'
            ? 'Appointment'
            : null}
        </Text>

        {/* repeat type section  */}
        <Text style={styles.taskTitle}>{items?.name}</Text>
        {items?.task_type == 'T' ? (
          <Text style={styles.repeatType}>({items?.repeattype})</Text>
        ) : null}

        {/* date and priority section  */}
        <View style={styles.direction}>
          <View style={styles.dateTimeContainer}>
            <Image
              style={styles.imageStyle}
              resizeMode="contain"
              tintColor={colors.WHITE}
              source={require('../../assets/pngImage/CalendarBlank1.png')}
            />
            <Text style={styles.dateTime}>{items?.date}</Text>
          </View>

          {/* priority section  */}
          {items?.task_type == 'T' ? (
            <View style={styles.priorityContainer}>
              <Image
                style={styles.imageStyle}
                resizeMode="contain"
                source={require('../../assets/pngImage/WarningCircle.png')}
              />
              {items.priority == 'H' ? (
                <Text style={styles.priority}>High</Text>
              ) : items.priority == 'M' ? (
                <Text style={styles.priority}>Medium</Text>
              ) : (
                <Text style={styles.priority}>Low</Text>
              )}
            </View>
          ) : null}
        </View>

        {/* start and end time in appointment case */}
        {items?.task_type === 'A' ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.dateTime}> Start time: </Text>
              <Text style={styles.repeatType}>{items?.starttime}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.dateTime}> End time: </Text>
              <Text style={styles.repeatType}>{items?.endtime}</Text>
            </View>
          </View>
        ) : null}

        {/* time section  */}
        {items?.time !== null ? (
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={items?.time}
            renderItem={renderAddedTime}
            keyExtractor={(item: any, index: any) => String(index)}
          />
        ) : null}

        {/* comment section basis of user id and editable on  */}
        {items?.task_type === 'A' ? null : (
          <>
            {isEdit == 'false' ? (
              <>
                {/* icons container  */}
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={styles.iconStyle}
                    onPress={() => {
                      viewTaskClicks(items?.id, items?.task_type);
                    }}>
                    <Image
                      style={styles.imageStyle}
                      resizeMode="contain"
                      source={require('../../assets/pngImage/ChatCenteredText.png')}
                    />
                  </TouchableOpacity>
                </View>

                {/* comments section  */}
                {items?.commentdetails !== null ? (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={items?.commentdetails}
                    renderItem={renderAddedComments}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : null}
              </>
            ) : items?.created_by == myUserId ? (
              <>
                {/* icons container  */}
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={styles.iconStyle}
                    onPress={() => {
                      viewTaskClicks(items?.id, items?.task_type);
                    }}>
                    <Image
                      style={styles.imageStyle}
                      resizeMode="contain"
                      source={require('../../assets/pngImage/ChatCenteredText.png')}
                    />
                  </TouchableOpacity>
                </View>

                {/* comments section  */}
                {items?.commentdetails !== null ? (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={items?.commentdetails}
                    renderItem={renderAddedComments}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                ) : null}
              </>
            ) : null}
          </>
        )}
        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </TouchableOpacity>
    </>
  );
};

export default AddedTaskTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    flex: 1,
    marginVertical: 5,
    padding: 20,
  },
  taskType: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
    paddingRight: 10,
    width: '100%',
  },
  taskTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    width: '90%',
  },
  repeatType: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
  },
  dateTimeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    width: '65%',
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateTime: {
    color: colors.WHITE,
    fontSize: 16,
    marginHorizontal: 3,
  },
  imageStyle: {
    height: 20,
    width: 20,
    paddingHorizontal: 12,
  },
  priorityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '26%',
  },
  priority: {
    color: colors.lightOrange,
    fontSize: 16,
  },
  iconStyle: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
    marginRight: 5,
    shadowColor: colors.GRAY,
    shadowRadius: 4,
    width: 40,
  },
});
