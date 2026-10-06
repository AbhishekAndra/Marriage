window.onscroll = function() {myFunction()};
var navbar_sticky = document.getElementById("navbar_sticky");
var sticky = navbar_sticky.offsetTop;
var navbar_height = document.querySelector('.navbar').offsetHeight;
function myFunction() {
  if (window.pageYOffset >= sticky + navbar_height) {
    navbar_sticky.classList.add("sticky")
	document.body.style.paddingTop = navbar_height + 'px';
  } else {
    navbar_sticky.classList.remove("sticky");
	document.body.style.paddingTop = '0'
  }
}


$(document).ready(function () { 
            $('.dropdown').hover(function () { 
                $(this).addClass('show'); 
                $(this).find('.dropdown-menu').addClass('show'); 
            }, function () { 
                $(this).removeClass('show'); 
                $(this).find('.dropdown-menu').removeClass('show'); 
            }); 
        });

(function () {
  var cartStorageKey = 'stackly-cart';

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function formatCartPrice(value) {
    return '$' + Number(value).toFixed(2);
  }

  function renderHeaderCarts() {
    var cart = readCart();
    var itemCount = cart.reduce(function (total, item) { return total + Number(item.quantity || 0); }, 0);
    var subtotal = cart.reduce(function (total, item) { return total + Number(item.price || 0) * Number(item.quantity || 0); }, 0);
    var hasQuoteItems = cart.some(function (item) { return item.price == null; });

    document.querySelectorAll('.drop_togn').forEach(function (toggle) {
      var badge = toggle.querySelector('.cart-count-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-count-badge';
        badge.setAttribute('aria-live', 'polite');
        toggle.appendChild(badge);
      }
      badge.textContent = itemCount;
      badge.hidden = itemCount === 0;
      toggle.setAttribute('aria-label', 'Shopping cart, ' + itemCount + (itemCount === 1 ? ' item' : ' items'));
    });

    document.querySelectorAll('.drop_cart').forEach(function (dropdown) {
      var rows = cart.map(function (item) {
        return '<div class="drop_1i1 row" data-header-cart-id="' + item.id + '">' +
          '<div class="col-6"><div class="drop_1i1l"><h6 class="fs-6"><a href="detail.html">' + item.name + '</a><br><span class="d-inline-block mt-1 font_15">' + item.quantity + 'x - ' + (item.price == null ? 'Quote' : formatCartPrice(item.price)) + '</span></h6></div></div>' +
          '<div class="col-4"><div class="drop_1i1r"><a href="detail.html"><img src="' + item.image + '" class="w-100" alt="' + item.name + '"></a></div></div>' +
          '<div class="col-2"><div class="drop_1i1l text-end"><button type="button" class="header-cart-remove" data-remove-cart-id="' + item.id + '" aria-label="Remove ' + item.name + '"><i class="fa fa-trash" aria-hidden="true"></i></button></div></div>' +
          '</div>';
      }).join('');

      dropdown.innerHTML = '<li><div class="drop_1i row"><div class="col-6"><div class="drop_1il"><h5 class="fs-6">' + itemCount + ' ' + (itemCount === 1 ? 'ITEM' : 'ITEMS') + '</h5></div></div><div class="col-6"><div class="drop_1il text-end"><h5 class="fs-6"><a href="cart.html">VIEW CART</a></h5></div></div></div>' +
        (rows || '<p class="text-center py-3 mb-0">Your cart is empty.</p>') +
        '<div class="drop_1i2 row"><div class="col-6"><div class="drop_1il"><h5 class="fs-6">TOTAL</h5></div></div><div class="col-6"><div class="drop_1il text-end"><h5 class="fs-5">' + (hasQuoteItems ? 'Quote required' : formatCartPrice(subtotal)) + '</h5></div></div></div>' +
        '<div class="drop_1i3 text-center row"><div class="col-12"><ul class="mb-0"><li class="d-inline-block mx-1"><a class="button_2 px-3 pt-2 pb-2 font_14" href="cart.html">View Cart</a></li><li class="d-inline-block mx-1"><a class="button_1 px-3 pt-2 pb-2 font_14" href="checkout.html">Checkout</a></li></ul></div></div></li>';
    });
  }

  document.addEventListener('click', function (event) {
    var addServiceButton = event.target.closest('.team_h1i a:has(.fa-plus)');
    if (addServiceButton) {
      event.preventDefault();
      var card = addServiceButton.closest('.team_h1i');
      var title = card.querySelector('.team_h1i2il h4');
      var category = card.querySelector('.team_h1i2il h6');
      var image = card.querySelector('.team_h1i1 img');
      if (!title) return;

      var serviceName = title.textContent.trim();
      var serviceId = 'service-' + serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      var cart = readCart();
      var existingService = cart.find(function (item) { return item.id === serviceId; });
      if (existingService) {
        existingService.quantity += 1;
      } else {
        cart.push({
          id: serviceId,
          name: serviceName,
          image: image ? image.getAttribute('src') : '',
          description: (category ? category.textContent.trim() : 'Wedding service') + ' — price on request',
          price: null,
          quantity: 1
        });
      }
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      renderHeaderCarts();
      window.dispatchEvent(new CustomEvent('stackly-cart-updated'));
      return;
    }

    var removeButton = event.target.closest('[data-remove-cart-id]');
    if (!removeButton) return;
    var itemId = removeButton.getAttribute('data-remove-cart-id');
    var cart = readCart().filter(function (item) { return item.id !== itemId; });
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    renderHeaderCarts();
    window.dispatchEvent(new CustomEvent('stackly-cart-updated'));
  });

  window.addEventListener('storage', renderHeaderCarts);
  window.addEventListener('stackly-cart-updated', renderHeaderCarts);
  renderHeaderCarts();
}());
