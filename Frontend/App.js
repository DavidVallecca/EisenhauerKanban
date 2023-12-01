import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/LoginScreen.js";
import Register from "./screens/RegisterScreen.js";
import Eisenhauer from "./screens/Eisenhauer.js";
import Kanban from "./screens/Kanban.js";
import Analytics from "./screens/Analytics.js";
import AuthLoading from "./screens/AuthLoadingScreen.js";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoading}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Eisenhauer"
          component={Eisenhauer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Kanban"
          component={Kanban}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Analytics"
          component={Analytics}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
