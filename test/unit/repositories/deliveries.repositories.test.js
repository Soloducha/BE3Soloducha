import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/models/delivery.model.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { default: Delivery } = await import(
  "../../../src/models/delivery.model.js"
);
const { default: deliveriesRepositorie } = await import(
  "../../../src/repositories/deliveries.repositories.js"
);
const { DELIVERY_STATUS } = await import(
  "../../../src/constants/index.js"
);

describe("Deliveries Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createDelivery", () => {
    it("debería crear una entrega con la firma posicional", async () => {
      Delivery.create.mockResolvedValue({ _id: "delivery-id" });

      const result = await deliveriesRepositorie.createDelivery(
        "order-id",
        "driver-id",
        "normal",
        DELIVERY_STATUS.ASSIGNED,
        new Date(),
      );

      expect(Delivery.create).toHaveBeenCalledWith({
        order: "order-id",
        driver: "driver-id",
        priority: "normal",
        status: DELIVERY_STATUS.ASSIGNED,
        assignedAt: expect.any(Date),
      });
      expect(result).toEqual({ _id: "delivery-id" });
    });
  });

  describe("updateDeliveryStatus", () => {
    it("debería pasar el update como objeto con solo status", async () => {
      Delivery.findByIdAndUpdate.mockResolvedValue({ _id: "delivery-id" });

      await deliveriesRepositorie.updateDeliveryStatus(
        "delivery-id",
        DELIVERY_STATUS.INTRANSIT,
        null,
      );

      expect(Delivery.findByIdAndUpdate).toHaveBeenCalledWith(
        "delivery-id",
        { status: DELIVERY_STATUS.INTRANSIT },
        { new: true, runValidators: true },
      );
    });

    it("debería persistir status y deliveredAt en el mismo update cuando la entrega se completa", async () => {
      const deliveredAt = new Date("2026-07-28T10:00:00.000Z");
      Delivery.findByIdAndUpdate.mockResolvedValue({
        _id: "delivery-id",
        status: DELIVERY_STATUS.DELIVERED,
        deliveredAt,
      });

      const result = await deliveriesRepositorie.updateDeliveryStatus(
        "delivery-id",
        DELIVERY_STATUS.DELIVERED,
        deliveredAt,
      );

      expect(Delivery.findByIdAndUpdate).toHaveBeenCalledWith(
        "delivery-id",
        { status: DELIVERY_STATUS.DELIVERED, deliveredAt },
        { new: true, runValidators: true },
      );
      expect(result.deliveredAt).toBe(deliveredAt);
    });
  });
});
