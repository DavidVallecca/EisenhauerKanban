import React, { useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        // Wenn ein Token vorhanden ist, navigiere zur Hauptseite (Eisenhauer o.ä.)
        navigation.navigate("Eisenhauer");
      } else {
        // Wenn kein Token vorhanden ist, navigiere zur Anmeldeseite
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
      // Im Falle eines Fehlers ebenfalls zur Anmeldeseite navigieren
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
