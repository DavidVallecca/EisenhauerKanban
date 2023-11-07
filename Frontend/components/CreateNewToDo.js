import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

const CreateNewToDo = ({ addToDo }) => {
  const [selectedKanbanCategory, setSelectedKanbanCategory] = useState("ToDo");
  const [selectedEisenhauerCategory, setSelectedEisenhauerCategory] =
    useState("ToDo");
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [modalNewVisible, setModalNewVisible] = useState(false);

  const openAddModal = () => {
    setSelectedKanbanCategory("ToDo");
    setSelectedEisenhauerCategory("importantCurrent");
    setNewName("");
    setDescription("");
    setModalNewVisible(true);
  };

  const closeAddModal = () => {
    setModalNewVisible(false);
  };

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

  function addToDoHandler() {
    addToDo(
      newName,
      selectedKanbanCategory,
      selectedEisenhauerCategory,
      description,
      generateUUID()
    );
    closeAddModal();
  }

  return (
    <View>
      <View>
        <Button title="New ToDo" onPress={openAddModal} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalNewVisible}
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headlineText}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              autoCapitalize="none"
              onChangeText={(text) => setNewName(text)}
              value={newName}
            />
            <Text style={styles.headlineText}>Description:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              autoCapitalize="none"
              onChangeText={(text) => setDescription(text)}
            />
            {/*<Button title="Bild auswählen" onPress={uploadImage} />*/}
            <Text style={styles.headlineText}>Kanban:</Text>
            <RNPickerSelect
              style={styles.picker}
              onValueChange={(value) => setSelectedKanbanCategory(value)}
              items={[
                { label: "ToDo", value: "ToDo" },
                { label: "InProgress", value: "InProgress" },
                { label: "Done", value: "Done" },
              ]}
              value={selectedKanbanCategory}
            />
            <Text style={styles.headlineText}>Eisenhauer:</Text>
            <RNPickerSelect
              style={styles.picker}
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonAdd}
                title="Add ToDo"
                onPress={() => addToDoHandler()}
              >
                <Text style={styles.buttonAddText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={closeAddModal}
              >
                <Text style={styles.buttonCancelText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateNewToDo;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  picker: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      color: "black",
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      color: "black",
    },
  },
  headlineText: {
    fontSize: 18,
    fontFamily: "Helvetica Neue",
    paddingTop: 10,
    marginTop: 8,
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonAdd: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: "green",
    marginRight: 20,
  },
  buttonAddText: {
    fontSize: 40,
  },
  buttonCancel: {
    paddingHorizontal: 13,
    paddingVertical: 0,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: "red",
    marginLeft: 20,
  },
  buttonCancelText: {
    paddingTop: 10,
    fontSize: 28,
  },
});
