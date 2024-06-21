import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const RenderItem = ({ item, onDelete, onCategoryUpdate }) => {
  const translation = useRef(new Animated.Value(200)).current;

  const [modalMoreVisible, setModalMoreVisible] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedKanbanCategory, setSelectedKanbanCategory] = useState(
    item.categoryKanban
  );
  const [selectedEisenhauerCategory, setSelectedEisenhauerCategory] = useState(
    item.eisenhauerCategory
  );

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();
  }, []);

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
    <Animated.View
      style={[
        styles.itemContainer,
        item.categoryKanban === "ToDo"
          ? styles.greyItem
          : item.categoryKanban === "InProgress"
          ? styles.orangeItem
          : item.categoryKanban === "Done"
          ? styles.greenItem
          : styles.defaultItem,
        { transform: [{ translateX: translation }] },
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
            <TouchableOpacity style={styles.buttonTop} onPress={deleteToDo}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonTop} onPress={closeMoreModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 20,
            height: "65%",
          }}
        >
          {item.image === "" ? (
            <View></View>
          ) : (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${item.image}`,
              }}
              style={styles.image}
            />
          )}
          <Text style={styles.headlineText}>Description:</Text>
          <Text style={styles.descriptionText}>{selectedDescription}</Text>
          <Text style={styles.headlineText}>Category:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
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
              style={styles.picker}
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
          <TouchableOpacity style={styles.button} onPress={updateCategory}>
            <Text style={styles.buttonText}>Update Category</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Button title="Weiteres" onPress={() => openMoreModal(item)} />
    </Animated.View>
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
  descriptionText: {
    fontSize: 18,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  picker: {
    height: 100,
    width: 200,
    ...Platform.select({
      ios: {
        marginTop: -55,
        marginBottom: 40,
      },
      android: {
        marginTop: -25,
        marginBottom: -60,
      },
    }),
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
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  buttonTop: {
    marginHorizontal: 5,
    padding: 5,
    marginTop: 7,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    marginBottom: 20,
    ...Platform.select({
      ios: {
        height: 120,
        width: 160,
      },
      android: {
        height: 180,
        width: 240,
      },
    }),
  },
});
