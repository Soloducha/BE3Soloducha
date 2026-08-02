import { jest } from "@jest/globals";

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
const { default: mocksService } =
  await import("../../../src/services/mocks.services.js");
const { ERROR_CODES } = await import("../../../src/constants/error.codes.js");

const INVALID = ERROR_CODES.INVALID_MOCK_AMOUNT;

describe("Mocks Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // generateMockUsers
  describe("generateMockUsers", () => {
    it("debería generar N usuarios válidos", () => {
      const users = mocksService.generateMockUsers(5);

      expect(users).toHaveLength(5);
      expect(users[0]).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          documents: expect.any(Array),
        }),
      );
    });

    it("debería generar 10 usuarios por default si count no se envía", () => {
      const users = mocksService.generateMockUsers(undefined);

      expect(users).toHaveLength(10);
    });

    it("debería aceptar un count numérico en string", () => {
      const users = mocksService.generateMockUsers("15");

      expect(users).toHaveLength(15);
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es 0", () => {
      expect(() => mocksService.generateMockUsers(0)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es negativo", () => {
      expect(() => mocksService.generateMockUsers(-5)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count supera 100", () => {
      expect(() => mocksService.generateMockUsers(101)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count no es numérico", () => {
      expect(() => mocksService.generateMockUsers("abc")).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count no es entero", () => {
      expect(() => mocksService.generateMockUsers(15.5)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });
  });

  // insertMockUsers
  describe("insertMockUsers", () => {
    it("debería insertar N usuarios y devolver los creados", async () => {
      usersRepositorie.createUser.mockResolvedValue({ _id: "mock-id" });

      const createdUsers = await mocksService.insertMockUsers(3);

      expect(createdUsers).toHaveLength(3);
      expect(usersRepositorie.createUser).toHaveBeenCalledTimes(3);
    });

    it("debería insertar 10 usuarios por default si count no se envía", async () => {
      usersRepositorie.createUser.mockResolvedValue({ _id: "mock-id" });

      const createdUsers = await mocksService.insertMockUsers(undefined);

      expect(createdUsers).toHaveLength(10);
      expect(usersRepositorie.createUser).toHaveBeenCalledTimes(10);
    });

    it("debería rechazar con INVALID_MOCK_AMOUNT si count es inválido", async () => {
      await expect(mocksService.insertMockUsers(0)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockUsers(-1)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockUsers(101)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockUsers("abc")).rejects.toMatchObject({
        code: INVALID,
      });
    });

    it("debería propagar errores del repositorio", async () => {
      usersRepositorie.createUser.mockRejectedValue(new Error("DB caido"));

      await expect(mocksService.insertMockUsers(2)).rejects.toThrow(
        "DB caido",
      );
    });
  });
});
