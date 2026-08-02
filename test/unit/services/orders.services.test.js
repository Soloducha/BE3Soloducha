import { jest } from "@jest/globals";

// Simula los módulos de los repositorios
jest.unstable_mockModule(
  "../../../src/repositories/orders.repositories.js",
  () => ({
    default: {
      getAllOrders: jest.fn(),
      getOrderById: jest.fn(),
      createOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
      deleteOrder: jest.fn(),
    },
  }),
);

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

// Importo todo lo que dependa de los módulos simulados
const { default: ordersRepositorie } =
  await import("../../../src/repositories/orders.repositories.js");
const { default: usersRepositorie } =
  await import("../../../src/repositories/users.repositories.js");
const { default: ordersService } =
  await import("../../../src/services/orders.services.js");
const { AppError } = await import("../../../src/utils/errors.js");
const { ORDER_STATUS } = await import("../../../src/constants/index.js");
const {
  validOrder,
  orderWithoutCustomer,
  orderWithoutItems,
  orderWithEmptyItems,
  orderWithoutDeliveryAddress,
  mockCustomerUser,
  mockDriverUser,
  mockOrderFromDB,
  mockUpdatedOrder,
} = await import("../../mocks/orders.mock.js");

describe("Orders Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getAllOrders
  describe("getAllOrders", () => {
    it("debería devolver todos los pedidos", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);

      const result = await ordersService.getAllOrders();

      expect(result).toEqual([mockOrderFromDB]);
      expect(ordersRepositorie.getAllOrders).toHaveBeenCalledTimes(1);
    });
  });

  // getOrderById
  describe("getOrderById", () => {
    it("debería devolver un pedido por ID", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);

      const result = await ordersService.getOrderById(mockOrderFromDB._id);

      expect(result).toEqual(mockOrderFromDB);
      expect(ordersRepositorie.getOrderById).toHaveBeenCalledWith(
        mockOrderFromDB._id,
      );
    });

    it("debería lanzar error si el pedido no existe", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(null);

      await expect(
        ordersService.getOrderById("507f1f77bcf86cd799439015"),
      ).rejects.toThrow(AppError);
    });
  });

  // createOrder
  describe("createOrder", () => {
    it("debería crear un pedido válido con el total calculado", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockCustomerUser);
      ordersRepositorie.createOrder.mockResolvedValue(mockOrderFromDB);

      const result = await ordersService.createOrder(validOrder);

      expect(usersRepositorie.getUserById).toHaveBeenCalledWith(
        validOrder.customer,
      );
      expect(ordersRepositorie.createOrder).toHaveBeenCalledWith({
        ...validOrder,
        total: 5000,
      });
      expect(result.order).toEqual(mockOrderFromDB);
      expect(result.shippingCost).toBe(30);
      expect(result.message).toBe("Pedido creado y email enviado");
    });

    it("debería lanzar error si falta el cliente", async () => {
      await expect(
        ordersService.createOrder(orderWithoutCustomer),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si faltan los items", async () => {
      await expect(
        ordersService.createOrder(orderWithoutItems),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si los items están vacíos", async () => {
      await expect(
        ordersService.createOrder(orderWithEmptyItems),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si falta la dirección", async () => {
      await expect(
        ordersService.createOrder(orderWithoutDeliveryAddress),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      await expect(
        ordersService.createOrder(validOrder),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el usuario es repartidor", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);

      await expect(
        ordersService.createOrder(validOrder),
      ).rejects.toThrow(AppError);
    });
  });

  // updateOrderStatus
  describe("updateOrderStatus", () => {
    it("debería actualizar el estado de un pedido existente", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);
      ordersRepositorie.updateOrderStatus.mockResolvedValue(mockUpdatedOrder);

      const result = await ordersService.updateOrderStatus(
        mockOrderFromDB._id,
        ORDER_STATUS.INTRANSIT,
      );

      expect(result).toEqual(mockUpdatedOrder);
      expect(ordersRepositorie.updateOrderStatus).toHaveBeenCalledWith(
        mockOrderFromDB._id,
        ORDER_STATUS.INTRANSIT,
      );
    });

    it("debería lanzar error si falta el estado", async () => {
      await expect(
        ordersService.updateOrderStatus(mockOrderFromDB._id, undefined),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el pedido no existe", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(null);

      await expect(
        ordersService.updateOrderStatus(mockOrderFromDB._id, ORDER_STATUS.INTRANSIT),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el pedido ya fue entregado", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue({
        ...mockOrderFromDB,
        status: ORDER_STATUS.DELIVERED,
      });

      await expect(
        ordersService.updateOrderStatus(mockOrderFromDB._id, ORDER_STATUS.INTRANSIT),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si se intenta reiniciar el pedido a CREATED", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);

      await expect(
        ordersService.updateOrderStatus(mockOrderFromDB._id, ORDER_STATUS.CREATED),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el repositorio devuelve null", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);
      ordersRepositorie.updateOrderStatus.mockResolvedValue(null);

      await expect(
        ordersService.updateOrderStatus(mockOrderFromDB._id, ORDER_STATUS.INTRANSIT),
      ).rejects.toThrow(AppError);
    });
  });

  // deleteOrder
  describe("deleteOrder", () => {
    it("debería eliminar un pedido existente", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);
      ordersRepositorie.deleteOrder.mockResolvedValue(mockOrderFromDB);

      const result = await ordersService.deleteOrder(mockOrderFromDB._id);

      expect(result).toEqual({ message: "Pedido eliminado correctamente" });
      expect(ordersRepositorie.deleteOrder).toHaveBeenCalledWith(
        mockOrderFromDB._id,
      );
    });

    it("debería lanzar error si el pedido no existe", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(null);

      await expect(
        ordersService.deleteOrder("507f1f77bcf86cd799439015"),
      ).rejects.toThrow(AppError);
    });
  });
});
