export const validUser = {
  firstName: "Juan",
  lastName: "Perez",
  email: "juan@test.com",
  password: "123456",
  role: "customer",
};

export const userWithoutEmail = {
  firstName: "Juan",
  lastName: "Perez",
  password: "123456",
  role: "customer",
};

export const userWithoutFirstName = {
  lastName: "Perez",
  email: "juan@test.com",
  password: "123456",
  role: "customer",
};

export const userWithAdminRole = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@test.com",
  password: "123456",
  role: "admin",
};

export const userWithInvalidRole = {
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  password: "123456",
  role: "hacker",
};

export const existingUserEmail = "existing@test.com";

export const mockUserFromDB = {
  _id: "507f1f77bcf86cd799439011",
  firstName: "Juan",
  lastName: "Perez",
  email: "juan@test.com",
  password: "hashedpassword",
  role: "customer",
  documents: [],
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockUpdatedUser = {
  ...mockUserFromDB,
  firstName: "Juan Actualizado",
};
