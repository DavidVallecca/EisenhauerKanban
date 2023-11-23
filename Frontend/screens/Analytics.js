import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Footer from "../components/Footer.js";

const AnalyticsScreen = ({ navigation }) => {
  const [toDo, setToDo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetch("http://localhost:3001/api/getAllToDos")
        .then((response) => response.json())
        .then((data) => setToDo(data))
        .catch((error) => {
          console.error("Fehler beim Abrufen der Daten:", error);
        });
    }, [])
  );
  const dataDoneCounter = toDo.filter((item) => item.categoryKanban === "Done");

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
      <View style={styles.containerContent}>
        <Text>{dataDoneCounter.length}</Text>
      </View>
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
