import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/LoginScreen.js";
import Register from "./screens/RegisterScreen.js";
import Eisenhauer from "./screens/Eisenhauer.js";
import Kanban from "./screens/Kanban.js";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
