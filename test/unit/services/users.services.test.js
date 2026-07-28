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
const { default: usersService } =
  await import("../../../src/services/users.services.js");
const { default: AppError } = await import("../../../src/utils/errors.js");
const {
  validUser,
  userWithoutEmail,
  userWithoutFirstName,
  userWithAdminRole,
  existingUserEmail,
  mockUserFromDB,
  mockUpdatedUser,
} = await import("../../mocks/users.mock.js");

describe("Users Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getAllUsers
  describe("getAllUsers", () => {
    it("debería devolver todos los usuarios", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);

      const result = await usersService.getAllUsers();

      expect(result).toEqual([mockUserFromDB]);
      expect(usersRepositorie.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  // getUserById
  describe("getUserById", () => {
    it("debería devolver un usuario por ID", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockUserFromDB);

      const result = await usersService.getUserById(mockUserFromDB._id);

      expect(result).toEqual(mockUserFromDB);
      expect(usersRepositorie.getUserById).toHaveBeenCalledWith(
        mockUserFromDB._id,
      );
    });

    it("debería lanzar error si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      await expect(
        usersService.getUserById("507f1f77bcf86cd799439011"),
      ).rejects.toThrow(AppError);
    });
  });

  // createUser
  describe("createUser", () => {
    it("debería crear un usuario válido", async () => {
      usersRepositorie.getUserByEmail.mockResolvedValue(null);
      usersRepositorie.createUser.mockResolvedValue(mockUserFromDB);

      const result = await usersService.createUser(validUser);

      expect(result).toEqual(mockUserFromDB);
      expect(usersRepositorie.createUser).toHaveBeenCalledWith(validUser);
    });

    it("debería lanzar error si falta firstName", async () => {
      await expect(
        usersService.createUser(userWithoutFirstName),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si falta email", async () => {
      await expect(usersService.createUser(userWithoutEmail)).rejects.toThrow(
        AppError,
      );
    });

    it("debería lanzar error si el rol es admin", async () => {
      await expect(usersService.createUser(userWithAdminRole)).rejects.toThrow(
        AppError,
      );
    });

    it("debería lanzar error si el email ya existe", async () => {
      usersRepositorie.getUserByEmail.mockResolvedValue(mockUserFromDB);

      await expect(
        usersService.createUser({ ...validUser, email: existingUserEmail }),
      ).rejects.toThrow(AppError);
    });
  });

  // updateUser
  describe("updateUser", () => {
    it("debería actualizar un usuario existente", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockUserFromDB);
      usersRepositorie.updateUser.mockResolvedValue(mockUpdatedUser);

      const result = await usersService.updateUser(mockUserFromDB._id, {
        firstName: "Juan Actualizado",
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(usersRepositorie.updateUser).toHaveBeenCalledWith(
        mockUserFromDB._id,
        { firstName: "Juan Actualizado" },
      );
    });

    it("debería lanzar error si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      await expect(
        usersService.updateUser("507f1f77bcf86cd799439011", {
          firstName: "Test",
        }),
      ).rejects.toThrow(AppError);
    });
  });

  //  deleteUser
  describe("deleteUser", () => {
    it("debería eliminar un usuario existente", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockUserFromDB);
      usersRepositorie.deleteUser.mockResolvedValue(mockUserFromDB);

      const result = await usersService.deleteUser(mockUserFromDB._id);

      expect(result).toEqual(mockUserFromDB);
      expect(usersRepositorie.deleteUser).toHaveBeenCalledWith(
        mockUserFromDB._id,
      );
    });

    it("debería lanzar error si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      await expect(
        usersService.deleteUser("507f1f77bcf86cd799439011"),
      ).rejects.toThrow(AppError);
    });
  });
});
