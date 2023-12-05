import React, { useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from "react-native-base64";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        // decode Token to check Expiration date
        const expValue = base64
          .decode(userToken.split(".")[1])
          .match(/"exp":(\d+),?/)[1];

        const currentTime = Math.floor(Date.now() / 1000);

        if (expValue < currentTime) {
          navigation.navigate("Login");
        } else {
          navigation.navigate("Eisenhauer");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
      navigation.navigate("Login");
    }
  };

  return (
    <View>
      {/* Hier könnten ein Logo oder ein Ladebildschirm angezeigt werden */}
      <Text>Laden...</Text>
    </View>
  );
};

export default AuthLoadingScreen;
