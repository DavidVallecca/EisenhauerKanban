import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

const KanbanScreen = ({ navigation }) => {
  const [toDo, setToDo] = useState([]);
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [selectedKanbanCategory, setSelectedKanbanCategory] = useState("ToDo");
  const [selectedEisenhauerCategory, setSelectedEisenhauerCategory] =
    useState("ToDo");
  const [modalMoreVisible, setModalMoreVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [modalNewVisible, setModalNewVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/getAllToDos")
      .then((response) => response.json())
      .then((data) => setToDo(data))
      .catch((error) => {
        console.error("Fehler beim Abrufen der Daten:", error);
      });
  }, []);

  const moveToEisenhauer = () => {
    navigation.navigate("Eisenhauer");
  };

  const dataToDo = toDo.filter((item) => item.categoryKanban === "ToDo");
  const dataInProgress = toDo.filter(
    (item) => item.categoryKanban === "InProgress"
  );
  const dataDone = toDo.filter((item) => item.categoryKanban === "Done");

  function generateUUID() {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  const addToDo = () => {
    fetch("http://localhost:3001/api/addNewToDo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        categoryKanban: selectedKanbanCategory,
        categoryEisenhauer: selectedEisenhauerCategory,
        id: generateUUID(),
      }),
    })
      .then((response) => response.json())
      .then((data) => setToDo([...toDo, data]))
      .catch((error) => {
        console.error("Fehler beim Hinzufügen der Person:", error);
      });
    closeAddModal();
    setNewName("");
  };

  const deleteToDo = () => {
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
          closeMoreModal();
        })
        .catch((error) => {
          console.error("Fehler beim Löschen der Person:", error);
        });
    }
  };

  const updateCategory = () => {
    if (selectedToDo) {
      const id = selectedToDo.id;
      fetch(`http://localhost:3001/api/updateCategory`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryKanban: selectedKanbanCategory,
          categoryEisenhauer: selectedEisenhauerCategory,
          id: selectedToDo.id,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          const updatedPeople = toDo.map((person) =>
            person.id === selectedToDo.id
              ? {
                  ...person,
                  categoryKanban: selectedKanbanCategory,
                  categoryEisenhauer: selectedEisenhauerCategory,
                }
              : person
          );
          setToDo(updatedPeople);
          closeMoreModal();
        })
        .catch((error) => {
          console.error("Fehler beim Aktualisieren der Kategorie:", error);
        });
    }
  };

  const openMoreModal = (ToDo) => {
    setSelectedToDo(ToDo);
    setSelectedKanbanCategory(ToDo.categoryKanban);
    setSelectedEisenhauerCategory(ToDo.categoryEisenhauer);
    setModalMoreVisible(true);
  };

  const closeMoreModal = () => {
    setSelectedToDo(null);
    setSelectedKanbanCategory("ToDo");
    setModalMoreVisible(false);
  };

  const openAddModal = () => {
    setSelectedKanbanCategory("ToDo");
    setSelectedEisenhauerCategory("importantCurrent");
    setModalNewVisible(true);
  };

  const closeAddModal = () => {
    setModalNewVisible(false);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        item.categoryKanban === "ToDo"
          ? styles.greyItem
          : item.categoryKanban === "InProgress"
          ? styles.orangeItem
          : item.categoryKanban === "Done"
          ? styles.greenItem
          : styles.defaultItem,
      ]}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalMoreVisible}
        onRequestClose={closeMoreModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={styles.modalContainer}>
            <Text>
              Are you sure you want to delete{" "}
              {selectedToDo ? selectedToDo.name : ""}?
            </Text>
            <Button title="Delete" onPress={deleteToDo} />
            <Button title="Cancel" onPress={closeMoreModal} />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <Text>Category:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedKanbanCategory(value)}
              items={[
                { label: "ToDo", value: "ToDo" },
                { label: "InProgress", value: "InProgress" },
                { label: "Done", value: "Done" },
              ]}
              value={selectedKanbanCategory}
              style={styles.picker}
            />
          </View>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedEisenhauerCategory(value)}
              items={[
                { label: "Important and Current", value: "importantCurrent" },
                {
                  label: "Important but not Current",
                  value: "importantNotCurrent",
                },
                {
                  label: "Current but not Important",
                  value: "notImportantCurrent",
                },
                {
                  label: "Neither important nor current",
                  value: "notImportantNotCurrent",
                },
              ]}
              value={selectedEisenhauerCategory}
              style={styles.picker}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#007bff" }]}
            onPress={updateCategory}
          >
            <Text style={styles.buttonText}>Update Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#dc3545" }]}
            onPress={closeMoreModal}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Button title="Weiteres" onPress={() => openMoreModal(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <Button title="Eisenhauer" onPress={moveToEisenhauer} />
        <Button title="New ToDo" onPress={openAddModal} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalNewVisible}
        onRequestClose={closeAddModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              margin: 10,
              padding: 8,
            }}
            placeholder="Enter name"
            autoCapitalize="none"
            onChangeText={(text) => setNewName(text)}
            value={newName}
          />
          <Text>Kanban:</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedKanbanCategory(value)}
            items={[
              { label: "ToDo", value: "ToDo" },
              { label: "InProgress", value: "InProgress" },
              { label: "Done", value: "Done" },
            ]}
            value={selectedKanbanCategory}
          />
          <Text>Eisenhauer:</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedEisenhauerCategory(value)}
            items={[
              { label: "Important and Current", value: "importantCurrent" },
              {
                label: "Important but not Current",
                value: "importantNotCurrent",
              },
              {
                label: "Current but not Important",
                value: "notImportantCurrent",
              },
              {
                label: "Neither important nor current",
                value: "notImportantNotCurrent",
              },
            ]}
            value={selectedEisenhauerCategory}
          />
        </View>
        <Button title="Add ToDo" onPress={addToDo} />
        <Button title="Cancel" onPress={closeAddModal} />
      </Modal>
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
  );
};
export default KanbanScreen;

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
