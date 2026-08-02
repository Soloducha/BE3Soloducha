import { jest } from "@jest/globals";

// Simula los módulos de los repositorios y del servicio de pedidos
jest.unstable_mockModule(
  "../../../src/repositories/deliveries.repositories.js",
  () => ({
    default: {
      getAllDeliveries: jest.fn(),
      getDeliveryById: jest.fn(),
      createDelivery: jest.fn(),
      updateDeliveryStatus: jest.fn(),
      deleteDelivery: jest.fn(),
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

jest.unstable_mockModule("../../../src/services/orders.services.js", () => ({
  default: {
    getAllOrders: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    deleteOrder: jest.fn(),
  },
}));

// Importo todo lo que dependa de los módulos simulados
const { default: deliveriesRepositorie } =
  await import("../../../src/repositories/deliveries.repositories.js");
const { default: usersRepositorie } =
  await import("../../../src/repositories/users.repositories.js");
const { default: ordersServices } =
  await import("../../../src/services/orders.services.js");
const { default: deliveriesService } =
  await import("../../../src/services/deliveries.services.js");
const { AppError } = await import("../../../src/utils/errors.js");
const { ORDER_STATUS, DELIVERY_STATUS, ORDER_PRIORITY } = await import(
  "../../../src/constants/index.js"
);
const {
  validDelivery,
  deliveryWithPriority,
  deliveryWithoutOrder,
  deliveryWithoutDriver,
  mockDriverUser,
  mockNonDriverUser,
  mockOrderCreated,
  mockOrderNotCreated,
  mockDeliveryFromDB,
  mockDeliveryDelivered,
  mockUpdatedDelivery,
} = await import("../../mocks/deliveries.mock.js");

describe("Deliveries Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getAllDeliveries
  describe("getAllDeliveries", () => {
    it("debería devolver todas las entregas", async () => {
      deliveriesRepositorie.getAllDeliveries.mockResolvedValue([
        mockDeliveryFromDB,
      ]);

      const result = await deliveriesService.getAllDeliveries();

      expect(result).toEqual([mockDeliveryFromDB]);
      expect(deliveriesRepositorie.getAllDeliveries).toHaveBeenCalledTimes(1);
    });
  });

  // getDeliveryById
  describe("getDeliveryById", () => {
    it("debería devolver una entrega por ID", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(mockDeliveryFromDB);

      const result = await deliveriesService.getDeliveryById(
        mockDeliveryFromDB._id,
      );

      expect(result).toEqual(mockDeliveryFromDB);
      expect(deliveriesRepositorie.getDeliveryById).toHaveBeenCalledWith(
        mockDeliveryFromDB._id,
      );
    });

    it("debería lanzar error si la entrega no existe", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(null);

      await expect(
        deliveriesService.getDeliveryById("507f1f77bcf86cd799439016"),
      ).rejects.toThrow(AppError);
    });
  });

  // createDelivery
  describe("createDelivery", () => {
    it("debería crear una entrega válida y actualizar el estado del pedido", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);
      deliveriesRepositorie.createDelivery.mockResolvedValue(mockDeliveryFromDB);

      const result = await deliveriesService.createDelivery(validDelivery);

      expect(ordersServices.getOrderById).toHaveBeenCalledWith(
        validDelivery.order,
      );
      expect(usersRepositorie.getUserById).toHaveBeenCalledWith(
        validDelivery.driver,
      );
      expect(deliveriesRepositorie.createDelivery).toHaveBeenCalledWith(
        expect.objectContaining({
          order: validDelivery.order,
          driver: validDelivery.driver,
          priority: ORDER_PRIORITY.NORMAL,
          status: DELIVERY_STATUS.ASSIGNED,
          assignedAt: expect.any(Date),
        }),
      );
      expect(ordersServices.updateOrderStatus).toHaveBeenCalledWith(
        validDelivery.order,
        ORDER_STATUS.ASSIGNED,
      );
      expect(result).toEqual(mockDeliveryFromDB);
    });

    it("debería crear una entrega con la prioridad recibida", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);
      deliveriesRepositorie.createDelivery.mockResolvedValue(mockDeliveryFromDB);

      await deliveriesService.createDelivery(deliveryWithPriority);

      expect(deliveriesRepositorie.createDelivery).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: deliveryWithPriority.priority,
        }),
      );
    });

    it("debería lanzar error si falta el pedido", async () => {
      await expect(
        deliveriesService.createDelivery(deliveryWithoutOrder),
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("debería lanzar error si falta el repartidor", async () => {
      await expect(
        deliveriesService.createDelivery(deliveryWithoutDriver),
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("debería lanzar error si el pedido no existe", async () => {
      ordersServices.getOrderById.mockResolvedValue(null);

      await expect(
        deliveriesService.createDelivery(validDelivery),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("debería lanzar error si el repartidor no existe", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(null);

      await expect(
        deliveriesService.createDelivery(validDelivery),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("debería lanzar error si el usuario no tiene rol de repartidor", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockNonDriverUser);

      await expect(
        deliveriesService.createDelivery(validDelivery),
      ).rejects.toMatchObject({
        statusCode: 400,
        details: "Tiene el rol: customer",
      });
    });

    it("debería lanzar error si el pedido ya fue asignado o procesado", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderNotCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);

      await expect(
        deliveriesService.createDelivery(validDelivery),
      ).rejects.toMatchObject({
        statusCode: 409,
        details: "Status actual: in_transit",
      });
    });
  });

  // updateDeliveryStatus
  describe("updateDeliveryStatus", () => {
    it("debería actualizar el estado de una entrega existente", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue({
        ...mockDeliveryFromDB,
      });
      deliveriesRepositorie.updateDeliveryStatus.mockResolvedValue(
        mockUpdatedDelivery,
      );

      const result = await deliveriesService.updateDeliveryStatus(
        mockDeliveryFromDB._id,
        DELIVERY_STATUS.INTRANSIT,
      );

      expect(result).toEqual(mockUpdatedDelivery);
      expect(deliveriesRepositorie.updateDeliveryStatus).toHaveBeenCalledWith(
        mockDeliveryFromDB._id,
        DELIVERY_STATUS.INTRANSIT,
      );
      expect(ordersServices.updateOrderStatus).not.toHaveBeenCalled();
    });

    it("debería lanzar error si la entrega no existe", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(null);

      await expect(
        deliveriesService.updateDeliveryStatus(
          "507f1f77bcf86cd799439016",
          DELIVERY_STATUS.INTRANSIT,
        ),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("debería lanzar error si la entrega ya fue completada", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(
        mockDeliveryDelivered,
      );

      await expect(
        deliveriesService.updateDeliveryStatus(
          mockDeliveryFromDB._id,
          DELIVERY_STATUS.INTRANSIT,
        ),
      ).rejects.toMatchObject({
        statusCode: 409,
        details: "Status Actual: delivered",
      });
    });

    it("debería marcar la entrega como entregada y actualizar el pedido", async () => {
      const delivery = { ...mockDeliveryFromDB };
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(delivery);
      deliveriesRepositorie.updateDeliveryStatus.mockResolvedValue({
        ...delivery,
        status: DELIVERY_STATUS.DELIVERED,
      });

      const result = await deliveriesService.updateDeliveryStatus(
        delivery._id,
        DELIVERY_STATUS.DELIVERED,
      );

      expect(delivery.deliveredAt).toBeInstanceOf(Date);
      expect(ordersServices.updateOrderStatus).toHaveBeenCalledWith(
        delivery.order,
        ORDER_STATUS.DELIVERED,
      );
      expect(deliveriesRepositorie.updateDeliveryStatus).toHaveBeenCalledWith(
        delivery._id,
        DELIVERY_STATUS.DELIVERED,
      );
      expect(result.status).toBe(DELIVERY_STATUS.DELIVERED);
    });
  });

  // deleteDelivery
  describe("deleteDelivery", () => {
    it("debería eliminar una entrega existente", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(mockDeliveryFromDB);
      deliveriesRepositorie.deleteDelivery.mockResolvedValue(mockDeliveryFromDB);

      const result = await deliveriesService.deleteDelivery(
        mockDeliveryFromDB._id,
      );

      expect(result).toEqual(mockDeliveryFromDB);
      expect(deliveriesRepositorie.deleteDelivery).toHaveBeenCalledWith(
        mockDeliveryFromDB._id,
      );
    });

    it("debería lanzar error si la entrega no existe", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(null);

      await expect(
        deliveriesService.deleteDelivery("507f1f77bcf86cd799439016"),
      ).rejects.toThrow(AppError);
    });
  });
});
