import { jest } from "@jest/globals";
import request from "supertest";

// Simula el módulo del repositorio
jest.unstable_mockModule(
  "../../../src/repositories/users.repositories.js",
  () => ({
    default: {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    },
  }),
);

// Importo todo lo que dependa del módulo simulado
const { default: usersRepositorie } =
  await import("../../../src/repositories/users.repositories.js");
const { default: app } = await import("../../../src/app.js");
const { validUser, mockUserFromDB, mockUpdatedUser } =
  await import("../../mocks/users.mock.js");

describe("Users Routes - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/users
  describe("GET /api/users", () => {
    it("debería devolver todos los usuarios", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);

      const res = await request(app).get("/api/users");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(1);
      expect(res.body.payload[0].firstName).toBe("Juan");
    });
  });

  // GET /api/users/:uid
  describe("GET /api/users/:uid", () => {
    it("debería devolver un usuario por ID", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockUserFromDB);

      const res = await request(app).get(`/api/users/${mockUserFromDB._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.firstName).toBe("Juan");
      expect(res.body.payload.email).toBe("juan@test.com");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      const res = await request(app).get("/api/users/507f1f77bcf86cd799439011");

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  // POST /api/users
  describe("POST /api/users", () => {
    it("debería crear un usuario válido", async () => {
      usersRepositorie.getUserByEmail.mockResolvedValue(null);
      usersRepositorie.createUser.mockResolvedValue(mockUserFromDB);

      const res = await request(app).post("/api/users").send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.firstName).toBe("Juan");
    });

    it("debería devolver 400 si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ firstName: "Solo" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 403 si intenta crear un admin", async () => {
      const res = await request(app).post("/api/users").send({
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        password: "123456",
        role: "admin",
      });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("fail");
    });
  });

  // PUT /api/users/:uid
  describe("PUT /api/users/:uid", () => {
    it("debería actualizar un usuario existente", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockUserFromDB);
      usersRepositorie.updateUser.mockResolvedValue(mockUpdatedUser);

      const res = await request(app)
        .put(`/api/users/${mockUserFromDB._id}`)
        .send({ firstName: "Juan Actualizado" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.firstName).toBe("Juan Actualizado");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/users/507f1f77bcf86cd799439011")
        .send({ firstName: "Test" });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  // DELETE /api/users/:uid
  describe("DELETE /api/users/:uid", () => {
    it("debería eliminar un usuario existente", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockUserFromDB);
      usersRepositorie.deleteUser.mockResolvedValue(mockUserFromDB);

      const res = await request(app).delete(`/api/users/${mockUserFromDB._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.firstName).toBe("Juan");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      const res = await request(app).delete(
        "/api/users/507f1f77bcf86cd799439011",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });
});
