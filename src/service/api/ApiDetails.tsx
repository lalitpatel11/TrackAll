// url constant
// const DOMAIN = 'https://nileprojects.in/trackall'; //local server
// const DOMAIN = 'https://dev.trackallpro.com'; //AWS server
const DOMAIN = 'https://www.trackallpro.com'; // TrackAll server

export const API = {
  // user auth section start
  SIGN_UP: DOMAIN + '/api/emailregister',
  SIGN_UP_OTP: DOMAIN + '/api/verifyregisterotp',
  PREFERENCE_LIST: DOMAIN + '/api/listpreference',
  SIGN_UP_DETAILS: DOMAIN + '/api/nameandinterest',
  SIGN_IN: DOMAIN + '/api/requestloginotp',
  SIGN_IN_OTP: DOMAIN + '/api/verifyloginotp',
  POST_GMAIL_SOCIAL_LOGIN: DOMAIN + '/api/sociallogin',
  POST_FB_SOCIAL_LOGIN: DOMAIN + '/api/facebooklogin',
  POST_USER_EMAIL_AVAILABLE: DOMAIN + '/api/useremailavailable',
  POST_SIGN_UP_EMAIL_AVAILABLE: DOMAIN + '/api/checkemailstatus',
  POST_BUSINESS_ORGANIZATION_SIGN_UP: DOMAIN + '/api/newsignuprequest',
  // individual home page start
  POST_HOME_DETAILS: DOMAIN + '/api/homedetail',
  POST_TASK_ON_HOME: DOMAIN + '/api/gethomedetailstask',
  POST_HIDE_TASK: DOMAIN + '/api/hidetask',
  // group and task start
  POST_CREATE_GROUP: DOMAIN + '/api/addgroups',
  POST_ALL_MEMBERS: DOMAIN + '/api/allmembers',
  POST_ADD_MEMBERS: DOMAIN + '/api/addgroupmembers',
  POST_GROUP_MEMBERS_DELETE: DOMAIN + '/api/groupmembersdelete',
  POST_RECENTLY_ADDED_MEMBERS: DOMAIN + '/api/recentlyaddedmembers',
  POST_EDIT_GROUP_NAME: DOMAIN + '/api/editgroupname',
  GET_GROUP_DETAILS: DOMAIN + '/api/groupdetails',
  POST_CREATE_TASK: DOMAIN + '/api/createtask',
  POST_EDIT_TASK: DOMAIN + '/api/edittask',
  POST_COMPLETE_TASK: DOMAIN + '/api/markascomplete',
  POST_IN_COMPLETE_TASK: DOMAIN + '/api/markasincomplete',
  GET_DELETE_TASK: DOMAIN + '/api/deletetask',
  GET_TASK_DETAILS: DOMAIN + '/api/taskdetail',
  POST_ADDED_TASK_IN_GROUP: DOMAIN + '/api/alltaskinagroup',
  POST_MANAGE_GROUP: DOMAIN + '/api/managegroup',
  GET_DELETE_GROUP: DOMAIN + '/api/deletegroup',
  GET_DELETE_MY_TASK: DOMAIN + '/api/deletemytask',
  GET_MY_GROUPS: DOMAIN + '/api/mygroups',
  GET_SHARED_GROUPS: DOMAIN + '/api/sharedgroupslisting',
  POST_SEARCH_GROUP_MEMBER: DOMAIN + '/api/searchgroupmembers',
  // comments section start
  POST_ADD_COMMENT: DOMAIN + '/api/taskcomment',
  POST_ALL_COMMENTS_ON_TASK: DOMAIN + '/api/allcommentsontaskid',
  POST_ADD_SUB_COMMENT: DOMAIN + '/api/recomment',
  POST_ALL_SUB_COMMENTS_ON_TASK: DOMAIN + '/api/allsubcommentsoncomment',
  POST_INVITE_USER: DOMAIN + '/api/inviteusers',
  POST_DELETE_COMMENT: DOMAIN + '/api/deletecomment',
  POST_EDIT_COMMENT: DOMAIN + '/api/editcomment',
  POST_REQUEST_TO_GROUP_ADD: DOMAIN + '/api/requesttogroupadd',
  // routine section start
  POST_ALL_COMMENTS_ON_ROUTINE: DOMAIN + '/api/allcommentonroutine',
  GET_COMMUNITY_ROUTINES: DOMAIN + '/api/searchcommunityroutines',
  POST_FILTER_COMMUNITY_ROUTINES: DOMAIN + '/api/communityRoutines',
  POST_MY_ROUTINES: DOMAIN + '/api/myroutines',
  ROUTINE_PREFERENCE_LIST: DOMAIN + '/api/listpreferencecategory',
  GET_SHARED_ROUTINES: DOMAIN + '/api/sharedroutinelisting',
  POST_ROUTINE_DETAILS: DOMAIN + '/api/routinedetails',
  POST_SHARE_ROUTINE: DOMAIN + '/api/shareroutine',
  //goal tracker start
  POST_ALL_GOAL: DOMAIN + '/api/viewhomegoals',
  POST_GOAL_ON_HOME: DOMAIN + '/api/viewhomegoalsaccordingtotime',
  POST_CREATE_GOAL: DOMAIN + '/api/creategoal',
  POST_MARK_COMPLETE_GOAL: DOMAIN + '/api/markcomplegoal',
  POST_MARK_INCOMPLETE_GOAL: DOMAIN + '/api/markasincompletegoal',
  POST_GOAL_DETAILS: DOMAIN + '/api/goaldetail',
  GET_DELETE_GOAL: DOMAIN + '/api/deletegoal',
  GET_TIME_WITH_DATE: DOMAIN + '/api/alltimesongoal',
  POST_EDIT_GOAL: DOMAIN + '/api/editgoal',
  // my profile section start
  GET_MY_PROFILE: DOMAIN + '/api/getmyprofile',
  POST_EDIT_PROFILE: DOMAIN + '/api/editprofile',
  POST_ADD_PREFERENCES: DOMAIN + '/api/updateuserinterests',
  GET_DELETE_PROFILE: DOMAIN + '/api/deleteuseraccount',
  // notes section start
  POST_MY_NOTES: DOMAIN + '/api/mynoteslisting',
  POST_SHARED_NOTES: DOMAIN + '/api/sharednoteslisting',
  POST_PUBLIC_NOTES: DOMAIN + '/api/publicnoteslisting',
  POST_PINNED_NOTES: DOMAIN + '/api/pinnednoteslisting',
  POST_CREATE_NOTES: DOMAIN + '/api/createnotes',
  POST_EDIT_NOTES: DOMAIN + '/api/editnote',
  GET_DELETE_NOTES: DOMAIN + '/api/deletenotes',
  GET_PIN_UNPIN_NOTES: DOMAIN + '/api/changepinstatus',
  // GET_UNPIN_NOTES: DOMAIN + '/api/unpinnoote',
  POST_SHARE_NOTES: DOMAIN + '/api/notesharing',
  POST_REMOVE_SHARE_NOTES: DOMAIN + '/api/removenotessharing',
  GET_NOTES_DETAILS: DOMAIN + '/api/notesdetails',
  POST_MANAGE_NOTES: DOMAIN + '/api/managenotes',
  // notification section start
  GET_ALL_NOTIFICATION: DOMAIN + '/api/getusernotification',
  GET_READ_NOTIFICATION: DOMAIN + '/api/readnotification',
  GET_CLEAR_ALL_NOTIFICATION: DOMAIN + '/api/clearallnotification',
  // subscription section start
  GET_ALL_SUBSCRIPTION: DOMAIN + '/api/subscriptionplanlisting',
  GET_MY_SUBSCRIPTION: DOMAIN + '/api/mycurrentsubscriptionplan',
  POST_NEW_SUBSCRIPTION: DOMAIN + '/api/processSubscription',
  GET_CANCEL_SUBSCRIPTION: DOMAIN + '/api/cancelsubscription',
  POST_PAYMENT_INTENT: DOMAIN + '/api/paymentintent',
  BUY_APPLE_SUBSCRIPTION: DOMAIN + '/api/purchasesubscriptionapple',
  // expenses management section start
  POST_LIST_EXPENSES_CATEGORY: DOMAIN + '/api/listexpensecategory',
  POST_LIST_EXPENSES_SUB_CATEGORY: DOMAIN + '/api/listexpensesubcategory',
  POST_LIST_BUDGETARY_RESTRICTION: DOMAIN + '/api/listbudgetaryrestrication',
  POST_ADD_USER_EXPANSE: DOMAIN + '/api/adduserexpense',
  POST_ALL_USER_EXPANSE: DOMAIN + '/api/alluserexpenses',
  POST_EDIT_EXPANSE: DOMAIN + '/api/editexpense',
  GET_DELETE_EXPANSE: DOMAIN + '/api/deleteexpense',
  POST_ADD_BUDGETARY_RESTRICTION: DOMAIN + '/api/adduserbudgetaryrestrication',
  POST_EDIT_BUDGETARY_RESTRICTION: DOMAIN + '/api/editbudgetaryrestrication',
  GET_DELETE_BUDGETARY_RESTRICTION: DOMAIN + '/api/deletebudgetaryrestrication',
  GET_SAVED_CARDS: DOMAIN + '/api/savedcards',
  POST_EXPANSE_HOME_SCREEN: DOMAIN + '/api/expensehomescreen',
  POST_ADD_CATEGORY: DOMAIN + '/api/addcategory',
  POST_ADD_SUB_CATEGORY: DOMAIN + '/api/addsubcategory',
  GET_DELETE_CATEGORY: DOMAIN + '/api/deletecategory',
  POST_ALL_UPCOMING_EXPENSES: DOMAIN + '/api/allupcommingexpenses',
  POST_LIST_ALL_BUDGETARY: DOMAIN + '/api/listallbudgetaccordingtoexpense',
  POST_ADD_EXPENSE_TO_BUDGET: DOMAIN + '/api/addexpensetobudget',
  POST_CHECK_MONTH_BUDGET: DOMAIN + '/api/checkmonthbudget',
  // split section start
  POST_ADD_SPLIT_GROUP: DOMAIN + '/api/addsplitgroup',
  POST_ADD_SPLIT_BILL: DOMAIN + '/api/addsplit',
  POST_SPLIT_GROUP_LIST: DOMAIN + '/api/splitgrouplist',
  POST_SPLIT_BILL_LIST: DOMAIN + '/api/addedsplits',
  POST_SETTLE_SPLIT_BILL_LIST: DOMAIN + '/api/splitbills',
  POST_MARK_SETTLE_SPLIT_BILL: DOMAIN + '/api/settlebill',
  GET_SPLIT_DETAILS: DOMAIN + '/api/splitgroupdetail',
  POST_ADD_SPLIT_COMMENT: DOMAIN + '/api/addgroupcomments',
  // business/community start
  POST_CREATE_BUSINESS: DOMAIN + '/api/createbusiness',
  POST_HOME_BUSINESS: DOMAIN + '/api/homepagebusiness',
  POST_MY_ALL_FOLLOWED_BUSINESS: DOMAIN + '/api/myfollowedbusiness',
  POST_MY_ALL_SUBSCRIBED_BUSINESS: DOMAIN + '/api/mysubscribedbusiness',
  POST_MY_ALL_BUSINESS: DOMAIN + '/api/homepagebusiness',
  POST_ALL_RECENTLY_BUSINESS: DOMAIN + '/api/recentlyvisitedbusiness',
  POST_ALL_SUGGESTED_BUSINESS: DOMAIN + '/api/suggestedbusiness',
  POST_FOLLOW_UN_FOLLOW_BUSINESS: DOMAIN + '/api/followbusiness',
  GET_BUSINESS_DETAILS: DOMAIN + '/api/businessdetail',
  POST_ALL_BUSINESS_FOLLOWERS: DOMAIN + '/api/allbusinessfollowers',
  POST_ALL_BUSINESS_SUBSCRIBERS: DOMAIN + '/api/allbusinessSubcribers',
  GET_DELETE_BUSINESS: DOMAIN + '/api/deletebusiness',
  POST_EDIT_BUSINESS: DOMAIN + '/api/editbusiness',
  POST_SUBSCRIBE_BUSINESS: DOMAIN + '/api/subscribebusiness',
  POST_ADD_POST: DOMAIN + '/api/addpost',
  GET_DELETE_POST: DOMAIN + '/api/deletePost',
  POST_EDIT_POST: DOMAIN + '/api/editPost',
  POST_BUSINESS_SUBSCRIPTION_PAYMENT:
    DOMAIN + '/api/businesssubscriptionpayment',
  POST_RECENT_ACTIVITY_BUSINESS: DOMAIN + '/api/recentactivitybusiness',
  POST_ALL_APPOINTMENT_ON_BUSINESS: DOMAIN + '/api/allappointmentrequest',
  POST_ADD_BUSINESS_SERVICE: DOMAIN + '/api/addbusinessservice',
  POST_ALL_BUSINESS_ON_SERVICE: DOMAIN + '/api/allservicelistonbusiness',
  POST_ALL_TIME_SLOT: DOMAIN + '/api/timeslotslisting',
  POST_REQUEST_FOR_APPOINTMENT: DOMAIN + '/api/requestforappointment',
  //community
  POST_CREATE_COMMUNITY: DOMAIN + '/api/createcommunity',
  POST_HOME_COMMUNITY: DOMAIN + '/api/allcommunity',
  POST_FOLLOW_UN_FOLLOW_COMMUNITY: DOMAIN + '/api/followcommunity',
  GET_COMMUNITY_DETAILS: DOMAIN + '/api/communitydetail',
  POST_ALL_COMMUNITY_FOLLOWERS: DOMAIN + '/api/allcommunityfollower',
  GET_DELETE_COMMUNITY: DOMAIN + '/api/deletecommunity',
  POST_EDIT_COMMUNITY: DOMAIN + '/api/editcommunity',
  // event start
  POST_SHARED_EVENTS: DOMAIN + '/api/sharedevents',
  POST_MY_EVENTS: DOMAIN + '/api/myevents',
  GET_EVENT_DETAILS: DOMAIN + '/api/eventdetails',
  GET_DELETE_EVENT: DOMAIN + '/api/deleteevent',
  POST_SHARE_EVENT: DOMAIN + '/api/shareevent',
  POST_LIKE_UNLIKE_EVENT: DOMAIN + '/api/likeevent',
  GET_ALL_COMMENTS_ON_EVENT: DOMAIN + '/api/allcommentsonevent',
  POST_ADD_EVENT_COMMENTS: DOMAIN + '/api/addcommenttoevent',
  POST_CREATE_EVENT: DOMAIN + '/api/createevent',
  POST_EDIT_EVENT: DOMAIN + '/api/editevent',
  POST_UPLOAD_IMAGE_ON_EVENT: DOMAIN + '/api/uploadimagestoevent',
  POST_VIEW_ALL_EVENT_MEMBERS: DOMAIN + '/api/viewalleventmembers',
  POST_REMOVE_EVENT_MEMBER: DOMAIN + '/api/removeeventmembers',
  POST_NEAR_BY_EVENT: DOMAIN + '/api/nearbyevents',
  // business home page start
  POST_BUSINESS_HOME_DETAILS: DOMAIN + '/api/businesshome',
  POST_MY_ALL_BUSINESS_LIST: DOMAIN + '/api/myallbusiness',
  POST_ADD_NEW_BUSINESS: DOMAIN + '/api/addmorebusiness',
  POST_EDIT_MY_BUSINESS: DOMAIN + '/api/editbusinessaccount',
  GET_DELETE_MY_BUSINESS: DOMAIN + '/api/deletemybusiness',
  POST_APPOINTMENT_ON_CALENDAR: DOMAIN + '/api/appointmentcalender',
  POST_ADD_BUSINESS_APPOINTMENT: DOMAIN + '/api/addappointment',
  POST_ALL_APPOINTMENT_ON_DATE: DOMAIN + '/api/allappointmentsondate',
  GET_APPOINTMENT_DETAILS: DOMAIN + '/api/appointmentdetail',
  GET_DELETE_APPOINTMENT: DOMAIN + '/api/deleteappointment',
  POST_EDIT_APPOINTMENT: DOMAIN + '/api/editappointment',
  POST_ACCEPT_APPOINTMENT: DOMAIN + '/api/acceptappointment',
  POST_REJECT_APPOINTMENT: DOMAIN + '/api/rejectappointment',
  POST_BUSINESS_UNAVAILABILITY_SERVICE:
    DOMAIN + '/api/unavailabilityservicedates',
  POST_BUSINESS_MANAGE_UNAVAILABILITY_SERVICE:
    DOMAIN + '/api/manageunavailability',
  POST_DELETE_SERVICE: DOMAIN + '/api/deleteservice',
  POST_BUSINESS_HOURS: DOMAIN + '/api/getbusinesshours',
  POST_UPDATE_BUSINESS_HOURS: DOMAIN + '/api/updatebusinesshours',
  // organisation employee section start
  POST_ORGANIZATION_HOME_DETAILS: DOMAIN + '/api/organizationhome',
  POST_ADD_EMPLOYEE: DOMAIN + '/api/addemployee',
  POST_ALL_EMPLOYEE: DOMAIN + '/api/allemployeelist',
  GET_DELETE_ORGANIZATION_EMPLOYEE: DOMAIN + '/api/deleteemployee',
  POST_EDIT_ORGANIZATION_EMPLOYEE: DOMAIN + '/api/updateemployee',
  //web view section for payment
  GET_WEB_LINK_SUBSCRIPTION: DOMAIN + '/user/upgradeplan',
  // privacy policy
  GET_PRIVACY_POLICY: DOMAIN + '/privacypolicymobile',
  // term and condition
  GET_TERM_AND_CONDITION: DOMAIN + '/mobiletermsandcondition',
};
