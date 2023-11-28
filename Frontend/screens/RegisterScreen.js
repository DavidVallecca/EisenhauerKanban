import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { sha256 } from "react-native-sha256";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateAndRegister = () => {
    const isEmailValid = /^[a-zA-Z0-9@.+\-_~]+$/.test(email);
    const isPasswordValid =
      /^[a-zA-Z0-9~!@#$%^&*()_\-+=<>?/{}[\]|;:',.]+$/.test(password);

    if (isEmailValid && isPasswordValid) {
      hashPasswordAndRegister();
    } else {
      if (!isEmailValid) {
        Alert.alert("Ungültige E-Mail-Adresse");
      } else {
        Alert.alert("Ungültiges Passwort");
      }
    }
  };

  const hashPasswordAndRegister = () => {
    sha256(password).then((hash) => {
      handleRegister(hash);
    });
  };

  const handleRegister = (hash) => {
    try {
      fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: hash,
        }),
      })
        .then((response) => {
          if (response.ok) {
            navigation.navigate("Login");
          }
        })
        .catch((error) => {
          console.error("Fehler beim Hinzufügen der Person:", error);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registrieren</Text>
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
      <TouchableOpacity
        style={styles.registerButton}
        onPress={validateAndRegister}
      >
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
  registerButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    width: 300,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default RegisterScreen;
