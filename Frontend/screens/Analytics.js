import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Footer from "../components/Footer.js";

const AnalyticsScreen = ({ navigation }) => {
  const moveToKanban = () => {
    navigation.navigate("Kanban");
  };

  const moveToEisenhauer = () => {
    navigation.navigate("Eisenhauer");
  };

  const moveToAnalytics = () => {
    navigation.navigate("Analytics");
  };

  const moveToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerContent}></View>
      <Footer
        pageProp={"Analytics"}
        switchToKanban={moveToKanban}
        switchToEisenhauer={moveToEisenhauer}
        switchToLogin={moveToLogin}
        switchToAnalytics={moveToAnalytics}
      />
    </View>
  );
};
export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "22%",
  },
  containerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
