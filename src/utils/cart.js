import { toast } from "sonner";

// add product to cart
export function addToCart(product) {
  // 1. get current cart data from local storage
  const cartData = getCart();
  // 2. find out if the product already exists in the cart or not
  const selected = cartData.find((item) => item._id === product._id);
  if (selected) {
    // 3. if product already exists, just increase the quantity
    selected.quantity += 1; // plus one
  } else {
    // 4. if not exist, add the product to cart
    // long method
    // const selectedProduct = { ...product }
    // selectedProduct.quantity = 1;
    // cartData.push(selectedProduct);
    // short method
    cartData.push({
      ...product,
      quantity: 1,
    });
  }
  // 5. update the cart (in local storage) with the latest data
  updateCart(cartData);
  // 6. display the notification
  toast.success(`"${product.name}" has been added to cart`);
}

// get all the items in the cart
export function getCart() {
  const cartInLocalStorage = localStorage.getItem("cart");
  const cartData = cartInLocalStorage ? JSON.parse(cartInLocalStorage) : [];
  return cartData;
}

// update the cart to local storage
export function updateCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// delete item from the cart
export function deleteItemFromCart(id) {}
