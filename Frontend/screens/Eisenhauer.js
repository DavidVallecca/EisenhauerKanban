import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import RenderItem from "../components/RenderItem.js";
import { useFocusEffect } from "@react-navigation/native";
import CreateNewToDo from "../components/CreateNewToDo.js";

/*
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ImageResizer from "react-native-image-resizer";
*/

const EisenhauerScreen = ({ navigation }) => {
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

  const addToDo = (
    newName,
    selectedKanbanCategory,
    selectedEisenhauerCategory,
    description,
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

  /*
  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    resize(result.assets[0].uri);
  };

  const resize = async (imageUri) => {
    if (!imageUri) return;

    console.log("Uri_ " + imageUri);
    try {
      let result = await ImageResizer.createResizedImage(
        imageUri,
        800,
        600,
        "JPEG",
        80,
        0,
        undefined,
        false
      );
      console.log(result.uri);
      
      const base64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: "base64",
      });
      console.log("base 64 encoded: " + base64); 
      
    } catch (error) {
      console.log("Unable to resize the photo: " + error);
    }
  };
  */

  return (
    <View style={styles.container}>
      <View>
        <Button title="Kanban" onPress={moveToKanban} />
      </View>
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
  );
};
export default EisenhauerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 100,
  },
  roundedBorderView: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: 350,
    height: 160,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: "#191d1f",
    borderRadius: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  pickerContainer: {
    borderColor: "#007bff",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    fontSize: 16,
    color: "#007bff",
  },
  defaultItem: {
    backgroundColor: "white",
  },
  greenItem: {
    backgroundColor: "#368a39",
  },
  orangeItem: {
    backgroundColor: "#e0b107",
  },
  greyItem: {
    backgroundColor: "#646366",
  },
  itemText: {
    fontSize: 20,
  },
  headlineText: {
    fontSize: 20,
    color: "#151f24",
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
