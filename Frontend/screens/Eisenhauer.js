import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RenderItem from "../components/RenderItem.js";
import CreateNewToDo from "../components/CreateNewToDo.js";
import Footer from "../components/Footer.js";

const EisenhauerScreen = ({ navigation }) => {
  const [toDo, setToDo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchToDos() {
        try {
          // Abrufen des Tokens aus dem AsyncStorage
          const userToken = await AsyncStorage.getItem("userToken");

          if (userToken) {
            const response = await fetch(
              "http://localhost:3001/api/getAllToDos",
              {
                headers: {
                  Authorization: `${userToken}`, // Verwenden des Tokens im Authorization-Header
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              setToDo(data);
            } else {
              console.error("Fehler beim Abrufen der Daten:", response.status);
            }
          } else {
            console.error("Kein Token gefunden.");
            // Handle wenn kein Token vorhanden ist, z.B. zurück zum Login-Bildschirm
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Daten:", error);
        }
      }

      fetchToDos();
    }, [])
  );

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

  const dataImportantCurrent = toDo.filter(
    (item) => item.categoryEisenhauer === "importantCurrent"
  );

  const dataImportantNotCurrent = toDo.filter(
    (item) => item.categoryEisenhauer === "importantNotCurrent"
  );

  const dataNotImportantCurrent = toDo.filter(
    (item) => item.categoryEisenhauer === "notImportantCurrent"
  );

  const dataNotImportantNotCurrent = toDo.filter(
    (item) => item.categoryEisenhauer === "notImportantNotCurrent"
  );

  const addToDo = async (
    newName,
    selectedKanbanCategory,
    selectedEisenhauerCategory,
    description,
    image,
    uuid
  ) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        const response = await fetch("http://localhost:3001/api/addNewToDo", {
          method: "POST",
          headers: {
            Authorization: `${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            categoryKanban: selectedKanbanCategory,
            categoryEisenhauer: selectedEisenhauerCategory,
            description: description,
            image: image,
            id: uuid,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setToDo([...toDo, data]);
        } else {
          throw new Error("Fehler beim Hinzufügen der Aufgabe");
        }
      } else {
        throw new Error("Kein Token gefunden");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Aufgabe:", error);
    }
  };

  const deleteToDo = async (selectedToDo) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (selectedToDo && userToken) {
        const response = await fetch(
          `http://localhost:3001/api/delete/${selectedToDo.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const updatedPeople = toDo.filter(
            (person) => person.id !== selectedToDo.id
          );
          setToDo(updatedPeople);
        } else {
          throw new Error("Fehler beim Löschen des ToDos");
        }
      } else {
        throw new Error(
          "Ungültiges ausgewähltes To-Do oder kein Token gefunden"
        );
      }
    } catch (error) {
      console.error("Fehler beim Löschen des ToDos:", error);
    }
  };

  const updateCategory = async (
    selectedToDo,
    kanbanCategory,
    eisenhauerCategory
  ) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (selectedToDo && userToken) {
        const response = await fetch(
          `http://localhost:3001/api/updateCategory`,
          {
            method: "PUT",
            headers: {
              Authorization: `${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryKanban: kanbanCategory,
              categoryEisenhauer: eisenhauerCategory,
              id: selectedToDo.id,
            }),
          }
        );

        if (response.ok) {
          const updatedToDos = toDo.map((toDoItem) =>
            toDoItem.id === selectedToDo.id
              ? {
                  ...toDoItem,
                  categoryKanban: kanbanCategory,
                  categoryEisenhauer: eisenhauerCategory,
                }
              : toDoItem
          );
          setToDo(updatedToDos);
        } else {
          throw new Error("Fehler beim Aktualisieren der Kategorie");
        }
      } else {
        throw new Error(
          "Ungültiges ausgewähltes To-Do oder kein Token gefunden"
        );
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Kategorie:", error);
    }
  };

  const renderItem = ({ item }) => (
    <RenderItem
      item={item}
      onDelete={deleteToDo}
      onCategoryUpdate={updateCategory}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <View>
          <CreateNewToDo addToDo={addToDo} />
        </View>
        <Text style={styles.headlineText}>Important and Current</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataImportantCurrent}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Text style={styles.headlineText}>Important but not Current</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataImportantNotCurrent}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Text style={styles.headlineText}>Not Important but Current</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataNotImportantCurrent}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Text style={styles.headlineText}>Neither Important nor Current</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataNotImportantNotCurrent}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <View>
        <Footer
          pageProp={"Eisenhauer"}
          switchToKanban={moveToKanban}
          switchToEisenhauer={moveToEisenhauer}
          switchToLogin={moveToLogin}
          switchToAnalytics={moveToAnalytics}
        />
      </View>
    </View>
  );
};

export default EisenhauerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "22%",
  },
  containerContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  roundedBorderView: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: 350,
    height: 150,
  },
  headlineText: {
    fontSize: 20,
    color: "#151f24",
  },
});
