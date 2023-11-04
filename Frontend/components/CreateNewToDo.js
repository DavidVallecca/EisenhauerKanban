import React, { useState } from "react";
import { Text, View, Button, Modal, TextInput } from "react-native";
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
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              margin: 10,
              padding: 8,
            }}
            placeholder="Enter description"
            autoCapitalize="none"
            onChangeText={(text) => setDescription(text)}
          />
          {/*<Button title="Bild auswählen" onPress={uploadImage} />*/}
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
        <Button title="Add ToDo" onPress={() => addToDoHandler()} />
        <Button title="Cancel" onPress={closeAddModal} />
      </Modal>
    </View>
  );
};

export default CreateNewToDo;
