export const validOrder = {
  customer: "507f1f77bcf86cd799439013",
  items: [
    { name: "Camiseta Deportiva", quantity: 2, price: 1500 },
    { name: "Pantalón Deportivo", quantity: 1, price: 2000 },
  ],
  deliveryAddress: "Av. Corrientes 1234, Buenos Aires",
};

export const orderWithoutCustomer = {
  items: [{ name: "Camiseta Deportiva", quantity: 1, price: 1500 }],
  deliveryAddress: "Av. Corrientes 1234, Buenos Aires",
};

export const orderWithoutItems = {
  customer: "507f1f77bcf86cd799439013",
  deliveryAddress: "Av. Corrientes 1234, Buenos Aires",
};

export const orderWithEmptyItems = {
  customer: "507f1f77bcf86cd799439013",
  items: [],
  deliveryAddress: "Av. Corrientes 1234, Buenos Aires",
};

export const orderWithoutDeliveryAddress = {
  customer: "507f1f77bcf86cd799439013",
  items: [{ name: "Camiseta Deportiva", quantity: 1, price: 1500 }],
};

export const mockCustomerUser = {
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

export const mockOrderFromDB = {
  _id: "507f1f77bcf86cd799439015",
  customer: "507f1f77bcf86cd799439013",
  items: [
    { name: "Camiseta Deportiva", quantity: 2, price: 1500 },
    { name: "Pantalón Deportivo", quantity: 1, price: 2000 },
  ],
  deliveryAddress: "Av. Corrientes 1234, Buenos Aires",
  total: 5000,
  status: "created",
  priority: "normal",
  delivery: null,
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockUpdatedOrder = {
  ...mockOrderFromDB,
  status: "in_transit",
};
