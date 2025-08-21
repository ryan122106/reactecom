function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();

  const existing = cart.find((item) => item._id === product._id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
}

export function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function updateCart(productId, updatedProduct) {
  let cart = getCart();
  cart = cart.map((item) =>
    item._id === productId ? { ...item, ...updatedProduct } : item
  );
  saveCart(cart);
  return cart;
}

export function deleteItemFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item._id !== productId);
  saveCart(cart);
  return cart;
}
