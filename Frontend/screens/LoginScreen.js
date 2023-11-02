import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        navigation.navigate("Eisenhauer");
      })
      .catch((error) => {
        console.error("Fehler beim Anmelden:", error);
      });
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Anmelden</Text>
      <TextInput
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Anmelden</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrieren</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    width: 300,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    width: 300,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default LoginScreen;
