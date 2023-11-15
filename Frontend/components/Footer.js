import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Footer = ({
  pageProp,
  switchToKanban,
  switchToEisenhauer,
  switchToAnalytics,
  switchToLogin,
}) => {
  const handleButtonEisenhauer = () => {
    switchToEisenhauer();
  };

  const handleButtonKanban = () => {
    switchToKanban();
  };

  const handleButtonAnalytics = () => {
    switchToAnalytics();
  };

  const handleButtonLogout = () => {
    switchToLogin();
  };

  return (
    <View style={styles.FooterContainer}>
      <View style={styles.buttonSpacing}>
        <TouchableOpacity
          style={styles.buttonLogout}
          onPress={handleButtonLogout}
        >
          <Text style={styles.buttonLogoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonSpacing}>
        <TouchableOpacity
          style={
            pageProp === "Eisenhauer"
              ? styles.buttonSelected
              : styles.buttonNotSelected
          }
          onPress={handleButtonEisenhauer}
        >
          <Text style={styles.buttonText}>E</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonSpacing}>
        <TouchableOpacity
          style={
            pageProp === "Kanban"
              ? styles.buttonSelected
              : styles.buttonNotSelected
          }
          onPress={handleButtonKanban}
        >
          <Text style={styles.buttonText}>K</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonSpacing}>
        <TouchableOpacity
          style={
            pageProp === "Analytics"
              ? styles.buttonSelected
              : styles.buttonNotSelected
          }
          onPress={handleButtonAnalytics}
        >
          <Text style={styles.buttonText}>A</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  FooterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "black",
    height: 70,
  },
  buttonSpacing: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonSelected: {
    paddingHorizontal: 35,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "#363534",
  },
  buttonText: {
    fontSize: 28,
    color: "white",
  },
  buttonLogoutText: {
    fontSize: 24,
    color: "white",
  },
  buttonNotSelected: {
    paddingHorizontal: 35,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "grey",
  },
  buttonLogout: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "grey",
  },
});
