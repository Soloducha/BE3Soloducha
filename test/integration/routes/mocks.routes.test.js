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
const { mockUserFromDB } = await import("../../mocks/users.mock.js");

const INVALID_MOCK_AMOUNT = "INVALID_MOCK_AMOUNT";

describe("Mocks Routes - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/mocks/users
  describe("GET /api/mocks/users", () => {
    it("debería generar 15 usuarios con count=15", async () => {
      const res = await request(app).get("/api/mocks/users?count=15");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(15);
      expect(res.body.total).toBe(15);
    });

    it("debería generar 10 usuarios por default si no se envía count", async () => {
      const res = await request(app).get("/api/mocks/users");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(10);
      expect(res.body.total).toBe(10);
    });

    it("debería generar 100 usuarios con count=100", async () => {
      const res = await request(app).get("/api/mocks/users?count=100");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(100);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es negativo", async () => {
      const res = await request(app).get("/api/mocks/users?count=-5");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count es 0", async () => {
      const res = await request(app).get("/api/mocks/users?count=0");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count no es numérico", async () => {
      const res = await request(app).get("/api/mocks/users?count=abc");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count supera 100", async () => {
      const res = await request(app).get("/api/mocks/users?count=101");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });
  });

  // POST /api/mocks/users
  describe("POST /api/mocks/users", () => {
    it("debería insertar 5 usuarios con count=5", async () => {
      usersRepositorie.createUser.mockResolvedValue(mockUserFromDB);

      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: 5 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(5);
      expect(res.body.total).toBe(5);
      expect(usersRepositorie.createUser).toHaveBeenCalledTimes(5);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es negativo", async () => {
      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: -1 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 500 si falla la inserción en la base de datos", async () => {
      usersRepositorie.createUser.mockRejectedValue(new Error("DB caido"));

      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: 2 });

      expect(res.status).toBe(500);
      expect(res.body.status).toBe("error");
      expect(res.body.error).toBe("INTERNAL_SERVER_ERROR");
    });
  });
});
