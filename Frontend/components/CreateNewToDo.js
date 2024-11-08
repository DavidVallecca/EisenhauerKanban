import React, { useState, useId, ScrollView } from "react";
import {
  Text,
  View,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
  Platform,
} from "react-native";
import uuid from "react-native-uuid";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const CreateNewToDo = ({ addToDo }) => {
  const [selectedKanbanCategory, setSelectedKanbanCategory] = useState("ToDo");
  const [selectedEisenhauerCategory, setSelectedEisenhauerCategory] =
    useState("ToDo");
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setIamge] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [modalNewVisible, setModalNewVisible] = useState(false);

  const openAddModal = () => {
    setSelectedKanbanCategory("ToDo");
    setSelectedEisenhauerCategory("importantCurrent");
    setNewName("");
    setDescription("");
    setIamge("");
    setModalNewVisible(true);
  };

  const closeAddModal = () => {
    setModalNewVisible(false);
  };

  function addToDoHandler() {
    addToDo(
      newName,
      selectedKanbanCategory,
      selectedEisenhauerCategory,
      description,
      image,
      date,
      uuid.v4()
    );
    closeAddModal();
  }

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.05,
    });
    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: "base64",
    });

    if (base64.length <= 1048487) {
      setIamge(base64);
    } else {
      Alert.alert("Image is too large");
    }
  };

  return (
    <View>
      <View>
        <TouchableOpacity style={styles.buttonNewToDo} onPress={openAddModal}>
          <Text style={styles.buttonNewToDoText}>New ToDo</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalNewVisible}
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.imageInputContainer}>
              {image === "" ? (
                <Text></Text>
              ) : (
                <Text style={styles.imageGreenHook}></Text>
              )}
              <TouchableOpacity
                style={styles.buttonAddImage}
                onPress={uploadImage}
              >
                <Text style={styles.buttonAddImageText}>Add Image</Text>
              </TouchableOpacity>
              {image === "" ? (
                <Text></Text>
              ) : (
                <Image
                  style={styles.imageGreenHook}
                  resizeMode="contain"
                  source={require("../assets/greenHook.jpeg")}
                />
              )}
            </View>
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
            <Text style={styles.headlineText}>Kanban:</Text>
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
            <Text style={styles.headlineText}>Eisenhauer:</Text>
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
    height: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imageInputContainer: {
    flexDirection: "row",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 30,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    width: 200,
    height: 200,
    marginTop: -80,
    marginBottom: -35,
    ...Platform.select({
      ios: {
        marginTop: -60,
        marginBottom: -25,
      },
      android: {
        marginTop: -70,
        marginBottom: -60,
      },
    }),
  },
  headlineText: {
    fontSize: 20,
    fontWeight: "condensedBold",
    paddingTop: 5,
    marginTop: 8,
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  buttonNewToDo: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#d5dbd6",
  },
  buttonNewToDoText: {
    fontSize: 15,
  },
  buttonAddImage: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#d5dbd6",
  },
  buttonAddImageText: {
    fontSize: 17,
  },
  imageGreenHook: {
    width: 40,
    height: 28,
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
