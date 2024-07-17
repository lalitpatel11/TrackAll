//external imports
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//internal imports
import AddBudgetary from '../screen/expenseManagement/AddBudgetary';
import AddExpense from '../screen/expenseManagement/AddExpenses';
import AddSplit from '../screen/expenseManagement/split/AddSplit';
import AddSplitBill from '../screen/expenseManagement/split/AddSplitBill';
import AddedBudgetary from '../screen/expenseManagement/AddedBudgetary';
import AddedSplit from '../screen/expenseManagement/split/AddedSplit';
import AllExpenses from '../screen/expenseManagement/AllExpenses';
import BusinessCommunity from '../screen/businessCommunity/BusinessCommunity';
import BusinessDetailsPage from '../screen/businessCommunity/BusinessDetailsPage';
import BusinessFollowedPages from '../screen/businessCommunity/BusinessFollowedPages';
import BusinessSubscribedPages from '../screen/businessCommunity/BusinessSubscribedPages';
import BusinessSubscriptionPayment from '../screen/businessCommunity/BussinessSubscriptionPayment';
import CommunityDetails from '../screen/community/CommunityDetails';
import CommunityDetailsPage from '../screen/businessCommunity/CommunityDetailsPage';
import CommunityFollowedPages from '../screen/businessCommunity/CommunityFollowedPages';
import CreateBusiness from '../screen/businessCommunity/CreateBusiness';
import CreateBusinessPost from '../screen/businessCommunity/CreateBusinessPost';
import CreateCommunity from '../screen/businessCommunity/CreateCommunity';
import CreateCommunityPost from '../screen/businessCommunity/CreateCommunityPost';
import CreateEvent from '../screen/eventManagement/CreateEvent';
import CreateEventDetail from '../screen/eventManagement/CreateEventDetail';
import CreateNotes from '../screen/notes/CreateNotes';
import CreateRoutine from '../screen/routine/CreateRoutine';
import CreateRoutineDetails from '../screen/routine/CreateRoutineDetails';
import CreateTask from '../screen/groups/CreateTask';
import EditBudgetary from '../screen/expenseManagement/EditBudgetary';
import EditBusiness from '../screen/businessCommunity/EditBusiness';
import EditBusinessPost from '../screen/businessCommunity/EditBusinessPost';
import EditCommunity from '../screen/businessCommunity/EditCommunity';
import EditCommunityPost from '../screen/businessCommunity/EditCommunityPost';
import EditEvent from '../screen/eventManagement/EditEvent';
import EditEventDetail from '../screen/eventManagement/EditEventDetail';
import EditExpanse from '../screen/expenseManagement/EditExpanse';
import EditNotes from '../screen/notes/EditNotes';
import EditProfile from '../screen/myProfile/EditProfile';
import EditRoutine from '../screen/routine/EditRoutine';
import EditTask from '../screen/groups/EditTask';
import EventAllComments from '../screen/eventManagement/EventAllComments';
import EventDetails from '../screen/eventManagement/EventDetails';
import EventManagement from '../screen/eventManagement/EventManagement';
import ExpenseManagement from '../screen/expenseManagement/ExpenseManagement';
import GroupDetails from '../screen/groups/GroupDetails';
import IntroPage from '../screen/introPages/IntroPage';
import MyBusinessPages from '../screen/businessCommunity/MyBusinessPages';
import MyCommunityPages from '../screen/businessCommunity/MyCommunityPages';
import MyGroups from '../screen/groups/MyGroups';
import MyProfile from '../screen/myProfile/MyProfile';
import NearByEvents from '../screen/eventManagement/NearByEvents';
import NotesAllComments from '../screen/notes/NotesAllComments';
import NotesDetails from '../screen/notes/NotesDetails';
import Notifications from '../screen/notifications/Notifications';
import PaymentPage from '../screen/subscriptionPlan/PaymentPage';
import PrivacyPolicy from '../screen/privacyPolicy/PrivacyPolicy';
import RecentActivityBusinessPages from '../screen/businessCommunity/RecentActivityBusinessPages';
import RecentActivityCommunityPages from '../screen/businessCommunity/RecentActivityCommunityPages';
import RecentlyVisitedBusinessPages from '../screen/businessCommunity/RecentlyVisitedBusinessPages';
import RoutineAllComments from '../screen/routine/RoutineAllComments';
import RoutineDetails from '../screen/routine/RoutineDetails';
import SettleSplitBill from '../screen/expenseManagement/split/SettleSplitBill';
import SettleSplitGroup from '../screen/expenseManagement/split/SettleSplitGroup';
import SharedGroups from '../screen/groups/SharedGroups';
import SharedRoutineDetails from '../screen/routine/SharedRoutineDetails';
import SharedRoutines from '../screen/routine/SharedRoutines';
import SignIn from '../screen/userAuthentication/SignIn';
import SignInOtp from '../screen/userAuthentication/SignInOtp';
import SignUp from '../screen/userAuthentication/SignUp';
import SignUpDetails from '../screen/userAuthentication/SignUpDetails';
import SignUpOtp from '../screen/userAuthentication/SignUpOtp';
import Splash from '../screen/introPages/Splash';
import SplitDetail from '../screen/expenseManagement/split/SplitDetail';
import SplitDetailViewMore from '../screen/expenseManagement/split/SplitDetailViewMore';
import SplitList from '../screen/expenseManagement/split/SplitList';
import SubscriptionPlan from '../screen/subscriptionPlan/SubscriptionPlan';
import SuggestedBusinessPages from '../screen/businessCommunity/SuggestedBusinessPages';
import SuggestedCommunityPages from '../screen/businessCommunity/SuggestedCommunityPages';
import TaskAllComments from '../screen/groups/TaskAllComments';
import TaskDetails from '../screen/groups/TaskDetails';
import TermAndCondition from '../screen/termAndCondition/TermAndCondition';
import UpcomingExpenses from '../screen/expenseManagement/UpcomingExpenses';
import UploadImageOnEvent from '../screen/eventManagement/UploadImageOnEvent';
import ViewAllInvitedEventMembers from '../screen/eventManagement/ViewAllInvitedEventMembers';
import ViewExpanses from '../screen/expenseManagement/ViewExpanses';
import WelcomePage from '../screen/introPages/WelcomePage';
import Routine from '../screen/routine/Routine';
import CreateGoalTracker from '../screen/goalTracker/CreateGoalTracker';
import CreateGoalTrackerDetails from '../screen/goalTracker/CreateGoalTrackerDetails';
import GoalTrackerDetails from '../screen/goalTracker/GoalTrackerDetails';
import EditGoalTracker from '../screen/goalTracker/EditGoalTracker';
import AllGoals from '../screen/goalTracker/AllGoals';
import AddBusiness from '../screen/homeScreen/AddBusiness';
import AddEmployeeOnOrganization from '../screen/homeScreen/AddEmployeeOnOrganization';
import AddNewAppointment from '../screen/businessCommunity/AddNewAppointment';
import AddNewOrganizationAppointment from '../screen/organization/organizationScheduleManagement/AddNewOrganizationAppointment';
import AllBusinessAppointments from '../screen/business/businessScheduleManagement/AllBusinessAppointments';
import AllOrganizationAppointment from '../screen/organization/organizationScheduleManagement/AllOrganizationAppointment';
import AllOrganizationEmployee from '../screen/homeScreen/AllOrganizationEmployee';
import AppointmentDetail from '../screen/business/businessScheduleManagement/AppointmentDetail';
import BusinessSignUp from '../screen/userAuthentication/BusinessSignUp';
import BusinessSubscriptionPage from '../screen/homeScreen/BusinessSubscriptionPage';
import CreateService from '../screen/businessCommunity/CreateService';
import EditAppointment from '../screen/business/businessScheduleManagement/EditAppointment';
import EditEmployeeOnOrganization from '../screen/homeScreen/EditEmployeeOnOrganization';
import EditMyBusiness from '../screen/homeScreen/EditMyBusiness';
import EmployeeDetailsOnOrganization from '../screen/homeScreen/EmployeeDetailsOnOrganization';
import ManageAvailability from '../screen/businessCommunity/ManageAvailability';
import MyAllTask from '../screen/homeScreen/MyAllTask';
import OrganizationSignUp from '../screen/userAuthentication/OrganizationSignUp';
import OrganizationSubscriptionPage from '../screen/homeScreen/OrganizationSubscriptionPage';
import SignUpIntroPage from '../screen/userAuthentication/SignUpIntroPage';
import SignUpOption from '../screen/userAuthentication/SignUpOption';
import AddNewBusinessAppointment from '../screen/business/businessScheduleManagement/AddNewBusinessAppointment';
import BusinessExpenseManagement from '../screen/business/businessExpenseManagement/BusinessExpenseManagement';
import OrganizationExpenseManagement from '../screen/organization/organizationExpenseManagement/OrganizationExpenseManagement';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="IntroPage" component={IntroPage} />
      <Stack.Screen name="WelcomePage" component={WelcomePage} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUpOtp" component={SignUpOtp} />
      <Stack.Screen name="SignInOtp" component={SignInOtp} />
      <Stack.Screen name="SignUpDetails" component={SignUpDetails} />
      <Stack.Screen name="SignUpIntroPage" component={SignUpIntroPage} />
      <Stack.Screen name="SignUpOption" component={SignUpOption} />
      <Stack.Screen name="BusinessSignUp" component={BusinessSignUp} />
      <Stack.Screen
        name="BusinessSubscriptionPage"
        component={BusinessSubscriptionPage}
      />
      <Stack.Screen name="OrganizationSignUp" component={OrganizationSignUp} />
      <Stack.Screen
        name="OrganizationSubscriptionPage"
        component={OrganizationSubscriptionPage}
      />
      <Stack.Screen name="ExpenseManagement" component={ExpenseManagement} />
      <Stack.Screen name="BusinessCommunity" component={BusinessCommunity} />
      <Stack.Screen name="EventManagement" component={EventManagement} />
      <Stack.Screen name="SubscriptionPlan" component={SubscriptionPlan} />
      <Stack.Screen name="TermAndCondition" component={TermAndCondition} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="MyGroups" component={MyGroups} />
      <Stack.Screen name="SharedGroups" component={SharedGroups} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="CreateTask" component={CreateTask} />
      <Stack.Screen name="GroupDetails" component={GroupDetails} />
      <Stack.Screen name="TaskAllComments" component={TaskAllComments} />
      <Stack.Screen name="CommunityDetails" component={CommunityDetails} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
      <Stack.Screen name="Routine" component={Routine} />
      <Stack.Screen name="SharedRoutines" component={SharedRoutines} />
      <Stack.Screen name="RoutineDetails" component={RoutineDetails} />
      <Stack.Screen
        name="SharedRoutineDetails"
        component={SharedRoutineDetails}
      />
      <Stack.Screen
        name="CreateRoutineDetails"
        component={CreateRoutineDetails}
      />
      <Stack.Screen name="CreateNotes" component={CreateNotes} />
      <Stack.Screen name="NotesDetails" component={NotesDetails} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
      <Stack.Screen name="EditTask" component={EditTask} />
      <Stack.Screen name="EditRoutine" component={EditRoutine} />
      <Stack.Screen name="EditNotes" component={EditNotes} />
      <Stack.Screen name="RoutineAllComments" component={RoutineAllComments} />
      <Stack.Screen name="NotesAllComments" component={NotesAllComments} />
      <Stack.Screen name="PaymentPage" component={PaymentPage} />
      <Stack.Screen name="AddedBudgetary" component={AddedBudgetary} />
      <Stack.Screen name="AddBudgetary" component={AddBudgetary} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
      <Stack.Screen name="AllExpenses" component={AllExpenses} />
      <Stack.Screen name="ViewExpanses" component={ViewExpanses} />
      <Stack.Screen name="EditExpanse" component={EditExpanse} />
      <Stack.Screen name="EditBudgetary" component={EditBudgetary} />
      <Stack.Screen name="AddedSplit" component={AddedSplit} />
      <Stack.Screen name="SettleSplitBill" component={SettleSplitBill} />
      <Stack.Screen name="AddSplit" component={AddSplit} />
      <Stack.Screen name="AddSplitBill" component={AddSplitBill} />
      <Stack.Screen name="SplitDetail" component={SplitDetail} />
      <Stack.Screen
        name="SplitDetailViewMore"
        component={SplitDetailViewMore}
      />
      <Stack.Screen name="SplitList" component={SplitList} />
      <Stack.Screen name="SettleSplitGroup" component={SettleSplitGroup} />
      <Stack.Screen
        name="BusinessFollowedPages"
        component={BusinessFollowedPages}
      />
      <Stack.Screen
        name="CommunityFollowedPages"
        component={CommunityFollowedPages}
      />
      <Stack.Screen
        name="BusinessSubscribedPages"
        component={BusinessSubscribedPages}
      />
      <Stack.Screen name="CreateBusiness" component={CreateBusiness} />
      <Stack.Screen name="CreateCommunity" component={CreateCommunity} />
      <Stack.Screen name="EditCommunity" component={EditCommunity} />
      <Stack.Screen
        name="BusinessDetailsPage"
        component={BusinessDetailsPage}
      />
      <Stack.Screen
        name="CommunityDetailsPage"
        component={CommunityDetailsPage}
      />
      <Stack.Screen name="CreateBusinessPost" component={CreateBusinessPost} />
      <Stack.Screen name="EditBusinessPost" component={EditBusinessPost} />
      <Stack.Screen name="MyBusinessPages" component={MyBusinessPages} />
      <Stack.Screen
        name="RecentlyVisitedBusinessPages"
        component={RecentlyVisitedBusinessPages}
      />
      <Stack.Screen
        name="SuggestedBusinessPages"
        component={SuggestedBusinessPages}
      />
      <Stack.Screen name="MyCommunityPages" component={MyCommunityPages} />
      <Stack.Screen
        name="SuggestedCommunityPages"
        component={SuggestedCommunityPages}
      />
      <Stack.Screen
        name="CreateCommunityPost"
        component={CreateCommunityPost}
      />
      <Stack.Screen name="EditBusiness" component={EditBusiness} />
      <Stack.Screen name="EditCommunityPost" component={EditCommunityPost} />
      <Stack.Screen
        name="BusinessSubscriptionPayment"
        component={BusinessSubscriptionPayment}
      />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
      <Stack.Screen name="EventAllComments" component={EventAllComments} />
      <Stack.Screen name="EditEvent" component={EditEvent} />
      <Stack.Screen name="EditEventDetail" component={EditEventDetail} />
      <Stack.Screen name="CreateEventDetail" component={CreateEventDetail} />
      <Stack.Screen name="UploadImageOnEvent" component={UploadImageOnEvent} />
      <Stack.Screen
        name="ViewAllInvitedEventMembers"
        component={ViewAllInvitedEventMembers}
      />
      <Stack.Screen name="NearByEvents" component={NearByEvents} />
      <Stack.Screen name="UpcomingExpenses" component={UpcomingExpenses} />
      <Stack.Screen
        name="RecentActivityCommunityPages"
        component={RecentActivityCommunityPages}
      />
      <Stack.Screen
        name="RecentActivityBusinessPages"
        component={RecentActivityBusinessPages}
      />
      <Stack.Screen name="CreateGoalTracker" component={CreateGoalTracker} />
      <Stack.Screen
        name="CreateGoalTrackerDetails"
        component={CreateGoalTrackerDetails}
      />
      <Stack.Screen name="GoalTrackerDetails" component={GoalTrackerDetails} />
      <Stack.Screen name="EditGoalTracker" component={EditGoalTracker} />
      <Stack.Screen name="AllGoals" component={AllGoals} />
      <Stack.Screen name="AddBusiness" component={AddBusiness} />
      <Stack.Screen
        name="AddNewBusinessAppointment"
        component={AddNewBusinessAppointment}
      />
      <Stack.Screen
        name="AllBusinessAppointments"
        component={AllBusinessAppointments}
      />
      <Stack.Screen
        name="AllOrganizationAppointment"
        component={AllOrganizationAppointment}
      />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetail} />
      <Stack.Screen name="EditAppointment" component={EditAppointment} />
      <Stack.Screen name="EditMyBusiness" component={EditMyBusiness} />
      <Stack.Screen
        name="AddNewOrganizationAppointment"
        component={AddNewOrganizationAppointment}
      />
      <Stack.Screen
        name="AddEmployeeOnOrganization"
        component={AddEmployeeOnOrganization}
      />
      <Stack.Screen
        name="AllOrganizationEmployee"
        component={AllOrganizationEmployee}
      />
      <Stack.Screen
        name="EditEmployeeOnOrganization"
        component={EditEmployeeOnOrganization}
      />
      <Stack.Screen
        name="EmployeeDetailsOnOrganization"
        component={EmployeeDetailsOnOrganization}
      />
      <Stack.Screen name="AddNewAppointment" component={AddNewAppointment} />
      <Stack.Screen name="MyAllTask" component={MyAllTask} />
      <Stack.Screen name="CreateService" component={CreateService} />
      <Stack.Screen name="ManageAvailability" component={ManageAvailability} />
      <Stack.Screen
        name="BusinessExpenseManagement"
        component={BusinessExpenseManagement}
      />
      <Stack.Screen
        name="OrganizationExpenseManagement"
        component={OrganizationExpenseManagement}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
