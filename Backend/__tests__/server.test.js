const request = require("supertest");
const app = require("../Backend/server.js"); // Passe den Pfad entsprechend an

// Ein Mock für die hashPassword-Funktion
jest.mock("../helpers", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword123"), // Beispielwert für den gehashten Passwort
}));

describe("POST /api/register", () => {
  it("should register a new user", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app).post("/api/register").send(newUser);

    expect(response.status).toBe(201); // Status 201 für erfolgreich registriert

    // Hier könntest du weitere Assertions hinzufügen, um sicherzustellen, dass die Daten in der Datenbank gespeichert wurden
  });

  it("should return 409 if user already exists", async () => {
    const existingUser = {
      email: "existing@example.com",
      password: "existingPassword",
    };

    // Füge den existierenden Benutzer zuerst hinzu
    await request(app).post("/api/register").send(existingUser);

    // Versuche denselben Benutzer erneut hinzuzufügen
    const response = await request(app)
      .post("/api/register")
      .send(existingUser);

    expect(response.status).toBe(409); // Status 409 für bereits vorhandenen Benutzer
  });

  // Weitere Tests für Fehlerfälle oder Kantenfälle können hier hinzugefügt werden
});
