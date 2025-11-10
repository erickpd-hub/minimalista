/**
 * TechStore - Shopify Theme
 * JavaScript principal
 */

// Función para agregar al carrito via AJAX
function addToCart(variantId, quantity = 1) {
  const data = {
    items: [{
      id: variantId,
      quantity: quantity
    }]
  };

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // Actualizar contador del carrito
    updateCartCount();
    
    // Mostrar notificación
    showNotification('Producto agregado al carrito', 'success');
  })
  .catch((error) => {
    console.error('Error:', error);
    showNotification('Error al agregar el producto', 'error');
  });
}

// Actualizar contador del carrito
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartIcon = document.querySelector('#cart-icon span');
      if (cartIcon) {
        cartIcon.textContent = cart.item_count;
        if (cart.item_count > 0) {
          cartIcon.style.display = 'flex';
        } else {
          cartIcon.style.display = 'none';
        }
      }
    });
}

// Mostrar notificación
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg fade-in ${
    type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Toggle menú móvil
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Smooth scroll para links internos
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Actualizar contador del carrito al cargar
  updateCartCount();

  // Cerrar menú móvil al hacer clic fuera
  document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = e.target.closest('button');
    
    if (mobileMenu && !mobileMenu.classList.contains('hidden') && !menuButton) {
      if (!mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
});

// Manejo del formulario de producto
if (document.getElementById('product-form')) {
  document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const variantId = formData.get('id');
    const quantity = parseInt(formData.get('quantity') || 1);
    
    addToCart(variantId, quantity);
  });
}

// Lazy loading de imágenes
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Animación de entrada para elementos
if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    fadeObserver.observe(el);
  });
}

// Prevenir zoom en inputs en iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1';
  }
}

// Exportar funciones globales
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.showNotification = showNotification;
window.toggleMobileMenu = toggleMobileMenu;
