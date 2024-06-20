import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList } from "react-native";

import RenderItem from "../components/RenderItem.js";
import CreateNewToDo from "../components/CreateNewToDo.js";
import Footer from "../components/Footer.js";
import {
  fetchToDos,
  addToDo,
  deleteToDo,
  updateCategory,
} from "../components/ToDoFunctions.js";

const EisenhauerScreen = ({ navigation }) => {
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

  const handleAddToDo = async (
    newName,
    selectedKanbanCategory,
    selectedEisenhauerCategory,
    description,
    image,
    date,
    uuid
  ) => {
    await addToDo(
      newName,
      selectedKanbanCategory,
      selectedEisenhauerCategory,
      description,
      image,
      date,
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
    paddingTop: "12%",
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
    height: 130,
  },
  headlineText: {
    fontSize: 20,
    color: "#151f24",
  },
});
