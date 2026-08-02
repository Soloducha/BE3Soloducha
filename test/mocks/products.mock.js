export const validProduct = {
  name: "Camiseta Deportiva",
  description: "Camiseta de algodón",
  price: 1500,
  stock: 10,
  category: "Ropa",
};

export const productWithoutName = {
  description: "Producto sin nombre",
  price: 100,
  stock: 5,
  category: "General",
};

export const productWithoutPrice = {
  name: "Producto sin precio",
  description: "Producto sin precio",
  stock: 5,
  category: "General",
};

export const productWithoutStock = {
  name: "Producto sin stock",
  description: "Producto sin stock",
  price: 100,
  category: "General",
};

export const productWithNegativePrice = {
  name: "Producto precio negativo",
  description: "Producto precio negativo",
  price: -100,
  stock: 5,
  category: "General",
};

export const productWithNegativeStock = {
  name: "Producto stock negativo",
  description: "Producto stock negativo",
  price: 100,
  stock: -5,
  category: "General",
};

export const productWithZeroStock = {
  name: "Producto agotado",
  description: "Producto sin unidades",
  price: 100,
  stock: 0,
  category: "General",
};

export const mockProductFromDB = {
  _id: "507f1f77bcf86cd799439012",
  name: "Camiseta Deportiva",
  description: "Camiseta de algodón",
  price: 1500,
  stock: 10,
  category: "Ropa",
  status: "available",
  createdAt: "2026-07-27T21:27:03.280Z",
  updatedAt: "2026-07-27T21:27:03.280Z",
};

export const mockUpdatedProduct = {
  ...mockProductFromDB,
  price: 1800,
};
