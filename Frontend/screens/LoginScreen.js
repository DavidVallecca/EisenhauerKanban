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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ipAdress } from "@env";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateAndLogin = async () => {
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
        //await handleLogin(hash);
        await handleLogin(password);
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

  const handleLogin = async (hash) => {
    try {
      const url = `http://${ipAdress}:3001/api/users/login`;
      const response = await fetch(url, {
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

  const handleResponse = async (response) => {
    if (response.status === 200) {
      const data = await response.json();
      const token = data.token;
      await storeToken(token);
      navigation.navigate("Eisenhauer");
      setEmail("");
      setPassword("");
    } else if (response.status === 401) {
      alert("Falsches Passwort");
    } else if (response.status === 400) {
      alert("Der Benutzer wurde nicht gefunden.");
    } else {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.asdf");
    }
  };

  // Beispiel zum Speichern des Tokens in AsyncStorage
  async function storeToken(token) {
    try {
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      console.error(error);
    }
  }

  const handleRegister = () => {
    navigation.navigate("Register");
    setEmail("");
    setPassword("");
  };

  handleButtonPress = () => {
    console.log("Button wurde gedrückt");
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
      <TouchableOpacity style={styles.loginButton} onPress={validateAndLogin}>
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
