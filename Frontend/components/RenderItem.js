import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const RenderItem = ({ item, onDelete, onCategoryUpdate }) => {
  const [modalMoreVisible, setModalMoreVisible] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedKanbanCategory, setSelectedKanbanCategory] = useState(
    item.categoryKanban
  );
  const [selectedEisenhauerCategory, setSelectedEisenhauerCategory] = useState(
    item.eisenhauerCategory
  );

  const openMoreModal = (ToDo) => {
    setSelectedToDo(ToDo);
    setSelectedKanbanCategory(ToDo.categoryKanban);
    setSelectedEisenhauerCategory(ToDo.categoryEisenhauer);
    setSelectedDescription(ToDo.description);
    setModalMoreVisible(true);
  };

  const closeMoreModal = () => {
    setSelectedToDo(null);
    setSelectedKanbanCategory("ToDo");
    setModalMoreVisible(false);
  };

  const deleteToDo = () => {
    onDelete(selectedToDo);
    closeMoreModal();
  };

  const updateCategory = () => {
    onCategoryUpdate(
      selectedToDo,
      selectedKanbanCategory,
      selectedEisenhauerCategory
    );
    closeMoreModal();
  };

  return (
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
          <Image
            source={{
              uri: `data:image/jpeg;base64,${item.image}`,
            }}
            style={{ height: 200, width: 266 }}
          />
          <Text style={styles.headlineText}>Description:</Text>
          <Text>{selectedDescription}</Text>
          <Text style={styles.headlineText}>Category:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={{ width: 200, height: 100 }}
              selectedValue={selectedKanbanCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedKanbanCategory(itemValue)
              }
            >
              <Picker.Item label="ToDo" value="ToDo" />
              <Picker.Item label="InProgress" value="InProgress" />
              <Picker.Item label="Done" value="Done" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={{ width: 200, height: 100 }}
              selectedValue={selectedEisenhauerCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedEisenhauerCategory(itemValue)
              }
            >
              <Picker.Item
                label="Important and Current"
                value="importantCurrent"
              />
              <Picker.Item
                label="Important but not Current"
                value="importantNotCurrent"
              />
              <Picker.Item
                label="Current but not Important"
                value="notImportantCurrent"
              />
              <Picker.Item
                label="Neither important nor current"
                value="notImportantNotCurrent"
              />
            </Picker>
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
};

export default RenderItem;

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
