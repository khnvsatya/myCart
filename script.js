//fetch products from FakeStoreAPI

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((products) => {
    const fetchedProducts = products;

    console.log(fetchedProducts);
    renderProducts(fetchedProducts);
  });

function renderProducts(products) {
  const productList = document.getElementById("product-list");

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productList.appendChild(productCard);
  });
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = product.title;
  card.append(title);

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.title;
  card.appendChild(image);

  const price = document.createElement("span");
  price.textContent = "$" + product.price.toFixed(2);
  card.appendChild(price);

  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Add to Cart";
  addToCartButton.addEventListener("click", () => {
    addToCart(product);
  });
  card.appendChild(addToCartButton);

  const addToWishListButton = document.createElement("button");
  addToWishListButton.textContent = "Add to My WishList";
  addToWishListButton.classList.add("wish-list-button");
  addToWishListButton.addEventListener("click", () => {
    addToWishList(product);
  });
  card.append(addToWishListButton);

  return card;
}
function addToWishList(product) {
  const WishListItems = JSON.parse(localStorage.getItem("wishListItems")) || [];

  const existingItem = WishListItems.find((item) => item.id === product.id);

  if (existingItem) {
    alert(`${existingItem.title} already exists`);
  } else {
    WishListItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("wishListItems", JSON.stringify(WishListItems));

  updateWishList();
}

function updateWishList() {
  console.log("wishlist update");
  const WishListItems = JSON.parse(localStorage.getItem("wishListItems")) || [];

  const wishListItemsContainer = document.getElementById("wishlist-items");
  wishListItemsContainer.innerHTML = " ";

  let totalWishListItems = 0;

  WishListItems.forEach((item) => {
    const wishListItem = document.createElement("div");
    wishListItem.classList.add("wishlist-item");

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title;
    wishListItem.appendChild(image);

    const details = document.createElement("div");
    details.classList.add("details");
    const name = document.createElement("span");
    name.classList.add("wishlist-item-name");
    name.textContent = item.title;
    details.appendChild(name);

    const price = document.createElement("span");
    price.classList.add("wishlist-item-price");
    price.textContent = "$" + item.price.toFixed(2);
    details.appendChild(price);

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Add to Cart";
    addToCartButton.addEventListener("click", () => {
      addToCart(item);
      removeWishListItem(item.id);
    });
    details.appendChild(addToCartButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeWishListItem(item.id);
    });
    details.appendChild(removeButton);

    wishListItem.appendChild(details);

    wishListItemsContainer.appendChild(wishListItem);

    totalWishListItems += item.quantity;
    console.log(totalWishListItems);
  });
  const totalWishListItemElement = document.getElementById(
    "total-wishlist-items"
  );
  totalWishListItemElement.textContent = `(${totalWishListItems})`;
}

function removeWishListItem(itemId) {
  const WishListItems = JSON.parse(localStorage.getItem("wishListItems")) || [];

  const updatedWishListItems = WishListItems.filter(
    (item) => item.id !== itemId
  );

  localStorage.setItem("wishListItems", JSON.stringify(updatedWishListItems));

  updateWishList();
}

function addToCart(product) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const existingItem = cartItems.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  updateCart();
}

function updateCart() {
  console.log("updating..");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const cartItmesContainer = document.getElementById("cart-items");
  cartItmesContainer.innerHTML = "";

  let totalPrice = 0;
  let totalCartItems = 0;

  cartItems.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title;
    cartItem.appendChild(image);

    const details = document.createElement("div");
    details.classList.add("details");

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = 1;
    quantityInput.value = item.quantity;

    quantityInput.addEventListener("change", () => {
      updateCartItemQuantity(item.id, quantityInput.value);
    });

    details.appendChild(quantityInput);

    const name = document.createElement("span");
    name.classList.add("cart-item-name");
    name.textContent = item.title;
    details.appendChild(name);

    const price = document.createElement("span");
    price.classList.add("cart-item-price");
    price.textContent = "$" + item.price.toFixed(2);
    details.appendChild(price);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeCartItem(item.id);
    });
    details.appendChild(removeButton);

    cartItem.appendChild(details);

    cartItmesContainer.appendChild(cartItem);

    totalPrice += item.price * item.quantity;
    totalCartItems += item.quantity;
  });

  const totalPriceElement = document.getElementById("total-price");
  totalPriceElement.textContent = totalPrice.toFixed(2);

  const totalCartItemElement = document.getElementById("total-cart-items");
  totalCartItemElement.textContent = ` (${totalCartItems})`;
}

function removeCartItem(itemId) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const updatedCartItems = cartItems.filter((item) => item.id !== itemId);

  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  updateCart();
}

function updateCartItemQuantity(itemId, quantity) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const item = cartItems.find((item) => item.id === itemId);

  if (item) {
    item.quantity = parseInt(quantity);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  updateCart();
}

updateCart();
updateWishList();
