import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchToDos(setToDo) {
  try {
    const userToken = await AsyncStorage.getItem("userToken");

    if (userToken) {
      const response = await fetch("http://localhost:3001/api/getAllToDos", {
        headers: {
          Authorization: `${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setToDo(data);
      } else {
        console.error("Fehler beim Abrufen der Daten:", response.status);
      }
    } else {
      console.error("Kein Token gefunden.");
      // Handle wenn kein Token vorhanden ist, z.B. zurück zum Login-Bildschirm
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

export const addToDo = async (
  newName,
  selectedKanbanCategory,
  selectedEisenhauerCategory,
  description,
  image,
  date,
  uuid,
  toDo,
  setToDo
) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      const response = await fetch("http://localhost:3001/api/addNewToDo", {
        method: "POST",
        headers: {
          Authorization: `${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          categoryKanban: selectedKanbanCategory,
          categoryEisenhauer: selectedEisenhauerCategory,
          description: description,
          image: image,
          date: date,
          id: uuid,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setToDo([...toDo, data]);
      } else {
        throw new Error("Fehler beim Hinzufügen der Aufgabe");
      }
    } else {
      throw new Error("Kein Token gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Aufgabe:", error);
  }
};

export const deleteToDo = async (selectedToDo, toDo, setToDo) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (selectedToDo && userToken) {
      const response = await fetch(
        `http://localhost:3001/api/delete/${selectedToDo.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedToDo = toDo.filter(
          (todoItem) => todoItem.id !== selectedToDo.id
        );
        setToDo(updatedToDo);
      } else {
        throw new Error("Fehler beim Löschen des ToDos");
      }
    } else {
      throw new Error("Ungültiges ausgewähltes To-Do oder kein Token gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Löschen des ToDos:", error);
  }
};

export const updateCategory = async (
  selectedToDo,
  kanbanCategory,
  eisenhauerCategory,
  toDo,
  setToDo
) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (selectedToDo && userToken) {
      const response = await fetch(`http://localhost:3001/api/updateCategory`, {
        method: "PUT",
        headers: {
          Authorization: `${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryKanban: kanbanCategory,
          categoryEisenhauer: eisenhauerCategory,
          id: selectedToDo.id,
        }),
      });

      if (response.ok) {
        const updatedToDos = toDo.map((toDoItem) =>
          toDoItem.id === selectedToDo.id
            ? {
                ...toDoItem,
                categoryKanban: kanbanCategory,
                categoryEisenhauer: eisenhauerCategory,
              }
            : toDoItem
        );
        setToDo(updatedToDos);
      } else {
        throw new Error("Fehler beim Aktualisieren der Kategorie");
      }
    } else {
      throw new Error("Ungültiges ausgewähltes To-Do oder kein Token gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Kategorie:", error);
  }
};
