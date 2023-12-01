import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import RenderItem from "../components/RenderItem.js";
import CreateNewToDo from "../components/CreateNewToDo.js";
import Footer from "../components/Footer.js";
import {
  fetchToDos,
  addToDo,
  deleteToDo,
  updateCategory,
} from "../components/ToDoFunctions.js";

const KanbanScreen = ({ navigation }) => {
  const [toDo, setToDo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchToDos(setToDo);
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

  const handleAddToDo = async (
    newName,
    selectedKanbanCategory,
    selectedEisenhauerCategory,
    description,
    image,
    uuid
  ) => {
    await addToDo(
      newName,
      selectedKanbanCategory,
      selectedEisenhauerCategory,
      description,
      image,
      uuid,
      toDo,
      setToDo
    );
  };

  const handleDeleteToDo = async (selectedToDo) => {
    await deleteToDo(selectedToDo, toDo, setToDo);
  };

  const handleUpdateCategory = async (
    selectedToDo,
    kanbanCategory,
    eisenhauerCategory
  ) => {
    await updateCategory(
      selectedToDo,
      kanbanCategory,
      eisenhauerCategory,
      toDo,
      setToDo
    );
  };

  const renderItem = ({ item }) => (
    <RenderItem
      item={item}
      onDelete={handleDeleteToDo}
      onCategoryUpdate={handleUpdateCategory}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <View>
          <CreateNewToDo addToDo={handleAddToDo} />
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
