(function () {
  const storageKey = 'stackly-cart';
  const product = {
    id: '12-red-roses',
    name: '12 Red Roses',
    image: 'img/449134-JC-Arts-386.webp',
    description: 'A beautiful bouquet of 12 red roses.',
    price: 349
  };

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('stackly-cart-updated'));
  }

  function formatPrice(value) {
    return '$' + Number(value).toFixed(2);
  }

  const addButton = document.getElementById('add-to-cart');
  if (addButton) {
    addButton.addEventListener('click', function (event) {
      event.preventDefault();
      const quantityField = document.getElementById('product-quantity');
      const quantity = Math.max(1, parseInt(quantityField.value, 10) || 1);
      const cart = readCart();
      const existingItem = cart.find(function (item) { return item.id === product.id; });

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push(Object.assign({}, product, { quantity: quantity }));
      }

      writeCart(cart);
      window.location.href = 'cart.html';
    });
  }

  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return;

  function renderCart() {
    const cart = readCart();
    const subtotal = cart.reduce(function (sum, item) {
      return sum + Number(item.price || 0) * item.quantity;
    }, 0);
    const shipping = subtotal > 0 ? 6 : 0;
    const hasQuoteItems = cart.some(function (item) { return item.price == null; });

    cartItems.innerHTML = '<tr><td class="fw-bold">Product</td><td class="fw-bold">Quantity</td><td class="fw-bold">Price</td><td class="fw-bold">Total</td><td></td></tr>';

    if (cart.length === 0) {
      cartItems.insertAdjacentHTML('beforeend', '<tr><td colspan="5" class="text-center py-4">Your cart is empty. <a href="shop.html">Continue shopping</a>.</td></tr>');
    } else {
      cart.forEach(function (item) {
        const lineTotal = item.price * item.quantity;
        cartItems.insertAdjacentHTML('beforeend',
          '<tr data-product-id="' + item.id + '">' +
            '<td><img src="' + item.image + '" alt="' + item.name + '" class="float-start me-3"><h5 class="fs-4 mt-3">' + item.name + '</h5><p class="mb-0 font_14">' + item.description + '</p></td>' +
            '<td><input type="number" min="1" value="' + item.quantity + '" class="form-control rounded-0 cart-quantity" aria-label="Quantity for ' + item.name + '" style="width:80px;height:54px"></td>' +
            '<td><h6 class="mb-0 family_2 fw-normal">' + (item.price == null ? 'Price on request' : formatPrice(item.price)) + '</h6></td>' +
            '<td><h6 class="mb-0 fw-bold family_2">' + (item.price == null ? 'Quote' : formatPrice(lineTotal)) + '</h6></td>' +
            '<td><button type="button" class="btn_cross d-inline-block bg_light rounded-circle text-center border-0 cart-remove" aria-label="Remove ' + item.name + '"><i class="fa fa-remove"></i></button></td>' +
          '</tr>'
        );
      });
    }

    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('cart-shipping').textContent = formatPrice(shipping);
    document.getElementById('cart-total').textContent = hasQuoteItems ? 'Quote required' : formatPrice(subtotal + shipping);
  }

  cartItems.addEventListener('change', function (event) {
    if (!event.target.matches('.cart-quantity')) return;
    const row = event.target.closest('[data-product-id]');
    const cart = readCart();
    const item = cart.find(function (entry) { return entry.id === row.dataset.productId; });
    if (item) {
      item.quantity = Math.max(1, parseInt(event.target.value, 10) || 1);
      writeCart(cart);
      renderCart();
    }
  });

  cartItems.addEventListener('click', function (event) {
    const removeButton = event.target.closest('.cart-remove');
    if (!removeButton) return;
    const row = removeButton.closest('[data-product-id]');
    writeCart(readCart().filter(function (item) { return item.id !== row.dataset.productId; }));
    renderCart();
  });

  window.addEventListener('stackly-cart-updated', renderCart);
  renderCart();
}());
