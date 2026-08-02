export const validDelivery = {
  order: "507f1f77bcf86cd799439015",
  driver: "507f1f77bcf86cd799439014",
};

export const deliveryWithPriority = {
  order: "507f1f77bcf86cd799439015",
  driver: "507f1f77bcf86cd799439014",
  priority: "high",
};

export const deliveryWithoutOrder = {
  driver: "507f1f77bcf86cd799439014",
};

export const deliveryWithoutDriver = {
  order: "507f1f77bcf86cd799439015",
};

export const mockDriverUser = {
  _id: "507f1f77bcf86cd799439014",
  firstName: "Carlos",
  lastName: "Repartidor",
  email: "carlos@test.com",
  password: "hashedpassword",
  role: "driver",
  documents: [],
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockNonDriverUser = {
  _id: "507f1f77bcf86cd799439013",
  firstName: "María",
  lastName: "Gomez",
  email: "maria@test.com",
  password: "hashedpassword",
  role: "customer",
  documents: [],
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockOrderCreated = {
  _id: "507f1f77bcf86cd799439015",
  customer: "507f1f77bcf86cd799439013",
  items: [
    { name: "Camiseta Deportiva", quantity: 2, price: 1500 },
  ],
  deliveryAddress: "Av. Corrientes 1234, Buenos Aires",
  total: 3000,
  status: "created",
  priority: "normal",
  delivery: null,
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockOrderNotCreated = {
  ...mockOrderCreated,
  status: "in_transit",
};

export const mockDeliveryFromDB = {
  _id: "507f1f77bcf86cd799439016",
  order: "507f1f77bcf86cd799439015",
  driver: "507f1f77bcf86cd799439014",
  status: "assigned",
  priority: "normal",
  assignedAt: "2026-07-27T21:27:03.280Z",
  deliveredAt: null,
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockDeliveryDelivered = {
  ...mockDeliveryFromDB,
  status: "delivered",
  deliveredAt: "2026-07-28T10:00:00.000Z",
};

export const mockUpdatedDelivery = {
  ...mockDeliveryFromDB,
  status: "in_transit",
};
