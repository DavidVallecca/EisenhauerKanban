import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import RenderItem from "../components/RenderItem.js";
import CreateNewToDo from "../components/CreateNewToDo.js";
import Footer from "../components/Footer.js";

const KanbanScreen = ({ navigation }) => {
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

  const dataToDo = toDo.filter((item) => item.categoryKanban === "ToDo");
  const dataInProgress = toDo.filter(
    (item) => item.categoryKanban === "InProgress"
  );
  const dataDone = toDo.filter((item) => item.categoryKanban === "Done");

  const addToDo = (
    newName,
    selectedKanbanCategory,
    selectedEisenhauerCategory,
    description,
    image,
    uuid
  ) => {
    fetch("http://localhost:3001/api/addNewToDo", {
      method: "POST",
      headers: {
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
    })
      .then((response) => response.json())
      .then((data) => setToDo([...toDo, data]))
      .catch((error) => {
        console.error("Fehler beim Hinzufügen der Person:", error);
      });
  };

  const deleteToDo = (selectedToDo) => {
    if (selectedToDo) {
      fetch(`http://localhost:3001/api/delete/${selectedToDo.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          const updatedPeople = toDo.filter(
            (person) => person.id !== selectedToDo.id
          );
          setToDo(updatedPeople);
        })
        .catch((error) => {
          console.error("Fehler beim Löschen des ToDos:", error);
        });
    }
  };

  const updateCategory = (selectedToDo, kanbanCategory, eisenhauerCategory) => {
    if (selectedToDo) {
      fetch(`http://localhost:3001/api/updateCategory`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryKanban: kanbanCategory,
          categoryEisenhauer: eisenhauerCategory,
          id: selectedToDo.id,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          const updatedToDos = toDo.map((toDo) =>
            toDo.id === selectedToDo.id
              ? {
                  ...toDo,
                  categoryKanban: kanbanCategory,
                  categoryEisenhauer: eisenhauerCategory,
                }
              : toDo
          );
          setToDo(updatedToDos);
        })
        .catch((error) => {
          console.error("Fehler beim Aktualisieren der Kategorie:", error);
        });
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
        <Text style={styles.headlineText}>ToDo</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataToDo}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Text style={styles.headlineText}>In Progress</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataInProgress}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Text style={styles.headlineText}>Done</Text>
        <View style={styles.roundedBorderView}>
          <FlatList
            data={dataDone}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <View>
        <Footer
          pageProp={"Kanban"}
          switchToKanban={moveToKanban}
          switchToEisenhauer={moveToEisenhauer}
          switchToLogin={moveToLogin}
          switchToAnalytics={moveToAnalytics}
        />
      </View>
    </View>
  );
};
export default KanbanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
