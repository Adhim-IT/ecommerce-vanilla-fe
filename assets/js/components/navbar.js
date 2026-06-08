export class AppNavbar extends HTMLElement {
  connectedCallback() {
    const isAdmin = window.location.pathname.includes('/admin/');

    const navLinks = isAdmin
      ? `
        <a href="product.html" class="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 transition">Products</a>
        <a href="user.html" class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Users</a>
        <a href="order.html" class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Orders</a>
      `
      : `
        <a href="index.html" class="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 transition">Home</a>
        <a href="product-detail.html" class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Products</a>
        <a href="orders.html" class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Orders</a>
      `;

    const mobileNavLinks = isAdmin
      ? `
        <a href="product.html" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 transition">Products</a>
        <a href="user.html" class="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Users</a>
        <a href="order.html" class="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Orders</a>
      `
      : `
        <a href="index.html" class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 transition">Home</a>
        <a href="product-detail.html" class="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Products</a>
        <a href="order.html" class="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Orders</a>
      `;

    this.innerHTML = `<nav class="relative bg-white shadow-sm border-b border-gray-200">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex items-center flex-1">
        <div class="flex shrink-0 items-center">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🛒</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Toko Adhim</span>
          </div>
        </div>
        <div class="hidden md:ml-8 md:flex">
          <div class="flex space-x-1">
            ${navLinks}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <a href="cart.html" class="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
          <span class="sr-only">Shopping cart</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </a>

        <div class="hidden sm:flex items-center relative">
          <button id="profile-btn" class="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 p-1 hover:bg-gray-100">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" class="w-8 h-8 rounded-full" />
          </button>

          <div id="profile-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden top-full">
            <a href="#" class="signout-btn block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">Sign out</a>
          </div>
        </div>

        <button type="button" id="mobile-menu-btn" class="md:hidden relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
          <span class="sr-only">Open main menu</span>
          <svg id="menu-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="w-6 h-6">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg id="menu-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="w-6 h-6 hidden">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div id="mobile-menu" class="md:hidden border-t border-gray-200 hidden">
    <div class="space-y-1 px-2 pt-2 pb-3">
      ${mobileNavLinks}
      <a href="#" class="signout-btn block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">Sign out</a>
    </div>
  </div>
</nav>`;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const profileBtn = this.querySelector('#profile-btn');
    const profileMenu = this.querySelector('#profile-menu');
    const mobileMenuBtn = this.querySelector('#mobile-menu-btn');
    const mobileMenu = this.querySelector('#mobile-menu');
    const menuOpen = this.querySelector('#menu-open');
    const menuClose = this.querySelector('#menu-close');

    profileBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu?.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      profileMenu?.classList.add('hidden');
    });

    mobileMenuBtn?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
      menuOpen?.classList.toggle('hidden');
      menuClose?.classList.toggle('hidden');
    });

    this.querySelectorAll('.signout-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.handleLogout?.();
      });
    });
  }
}

customElements.define('app-navbar', AppNavbar);