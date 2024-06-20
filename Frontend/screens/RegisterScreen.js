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

  const validateAndHashAndRegister = async () => {
    if (!email || !password) {
      Alert.alert("Bitte füllen Sie alle Felder aus");
      return;
    }
    const isEmailValid = /^[a-zA-Z0-9@.+\-_~]+$/.test(email.trim());
    const isPasswordValid =
      /^[a-zA-Z0-9~!@#$%^&*()_\-+=<>?/{}[\]|;:',.]+$/.test(password);

    if (isEmailValid && isPasswordValid) {
      try {
        //const hash = await sha256(password);
        //await handleRegister(hash);
        await handleRegister(password);
      } catch (error) {
        console.error("Fehler beim Hashen des Passworts:", error);
      }
    } else {
      if (!isEmailValid) {
        Alert.alert("Ungültige E-Mail-Adresse");
      } else {
        Alert.alert("Ungültiges Passwort");
      }
    }
  };

  const handleRegister = async (hash) => {
    try {
      const response = await fetch("http://10.0.2.2:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: hash,
        }),
      });
      handleResponse(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  const handleResponse = (response) => {
    if (response.status === 201) {
      navigation.navigate("Login");
      setEmail("");
      setPassword("");
    } else if (response.status === 409) {
      alert("Benutzer existiert bereits. Bitte wählen Sie eine andere E-Mail.");
    } else {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
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
        onPress={validateAndHashAndRegister}
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
