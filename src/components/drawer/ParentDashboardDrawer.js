import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AppState} from 'constants/app';
import {connect} from 'react-redux';
import {skipLogin} from 'actions/appAction';

import {
  LOCATION,
  MESSAGE,
  NOTIFICATION,
  HOME,
  LOGIN,
  LOGOUT,
  REGISTER,
  APP_TYPE,
} from 'constants';
import {PermissionsAndroid} from 'react-native';
import Geocoder from 'react-native-geocoding';
import ParentHome from 'screens/parent/home/ParentHomeScreen';
import Login from 'screens/parent/authenticate/LoginScreen';
import Register from 'screens/parent/authenticate/RegisterScreen';
import Logout from 'screens/parent/authenticate/LogoutScreen';
import ChooseAppTypeScreen from 'screens/common/settings/ChooseAppTypeScreen';
import ChildLocationScreen from 'screens/parent/location/ChildLocationScreen';
import ChildNotificationScreen from 'screens/parent/notification/ChildNotificationScreen';
import MessageScreen from 'screens/parent/message/MessageScreen';

const Drawer = createDrawerNavigator();

const DashboardDrawer = props => {
  const isAuthenticated = props.appState === AppState.AUTHENTICATED;

  async function requestLocationPermission() {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    Geocoder.init('AIzaSyB785g-zg89YA-DzRL8zmrMxXIV3T5e5-A');
    requestLocationPermission();
  }, []);

  return (
    <Drawer.Navigator>
      {isAuthenticated ? (
        <>
          <Drawer.Screen name={HOME} component={ParentHome} />
          <Drawer.Screen name={LOCATION} component={ChildLocationScreen} />
          <Drawer.Screen name={MESSAGE} component={MessageScreen} />
          <Drawer.Screen
            name={NOTIFICATION}
            component={ChildNotificationScreen}
          />
          <Drawer.Screen name={LOGOUT} component={Logout} />
          <Drawer.Screen name={APP_TYPE} component={ChooseAppTypeScreen} />
        </>
      ) : (
        <>
          <Drawer.Screen name={LOGIN} component={Login} />
          <Drawer.Screen name={REGISTER} component={Register} />
          <Drawer.Screen name={APP_TYPE} component={ChooseAppTypeScreen} />
          <Drawer.Screen name={'Skip login'} component={RenderSkipLogin} />
        </>
      )}
    </Drawer.Navigator>
  );
};

const mapStateToProps = state => ({
  appState: state.app.state,
  currentUser: state.app.user,
});

export default connect(
  mapStateToProps,
  {},
)(DashboardDrawer);

//TODO: remove all below
const SkipLogin = props => {
  props.skipLogin();
  return null;
};

const RenderSkipLogin = connect(
  mapStateToProps,
  {skipLogin},
)(SkipLogin);