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

  return card;
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
    const name = document.createElement("span");
    name.classList.add("cart-item-name");
    name.textContent = item.title;
    details.appendChild(name);

    const price = document.createElement("span");
    price.classList.add("cart-item-price");
    price.textContent = "$" + item.price.toFixed(2);
    details.appendChild(price);

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = 1;
    quantityInput.value = item.quantity;

    quantityInput.addEventListener("change", () => {
      updateCartItemQuantity(item.id, quantityInput.value);
    });

    details.appendChild(quantityInput);

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
