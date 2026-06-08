import { apiCall } from "./api.js";


async function getProducts(query) {
    const params = query ? `?query=${encodeURIComponent(query)}` : '';
    return apiCall(`/products${params}`);
}


async function getProduct(id) {
    return apiCall(`/products/${id}`);
}


function renderProductCard(product) {
    const card = document.createElement('div');

    card.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
                <p class="text-gray-700 mt-2">$ ${Number(product.price).toLocaleString('en-US')}</p>
                <p class="text-gray-500 mt-1">Stok: ${product.quantity}</p>
                <input type="number" id="quantity-${product.id}" value="1" min="1" max="${product.quantity}" class="mt-2 w-full border border-gray-300 rounded px-3 py-1 text-sm"/>
                <button onclick="handleAddToCart(${product.id})" class="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">Tambah ke Keranjang</button>
            </div>
        </div>
    `;

    return card;
}

function renderProducts(products) {
    const container = document.getElementById('product-grid');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        container.appendChild(renderProductCard(product));
    });
}
function renderError(msg) {
    const container = document.getElementById('product-grid');
    if (container) {
        container.innerHTML = `<p class="text-red-500 col-span-full">${msg}</p>`;
    }
    if (product.length === 0) {
        container.innerHTML = `<p class="text-gray-400 col-span-full">Tidak ada produk ditemukan.</p>`;
    }
}
export const handleGetProducts = async (query = null) => {
    const response = await getProducts(query);
    const container = document.getElementById('product-grid');
    if (container) container.innerHTML = `<p class="text-gray-400 col-span-full">Memuat produk...</p>`;

    try {
        const response = await getProducts(query);
        renderProducts(response.data);
    } catch (error) {
        renderError(`Gagal memuat produk: ${error.message}`);
    }
}

export const handleGetProduct = async (id) => {
    try {
        const product = await getProduct(id);
        console.log(product);
        alert(`${product.name}\nHarga: $ ${Number(product.price).toLocaleString('en-US')}\nStok: ${product.quantity}\n\n${product.description ?? ''}`);
    } catch (error) {
        renderError(`Gagal memuat produk: ${error.message}`);
    }
}

let searchTimeout = null;
export const handleSearch = (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        handleGetProducts(query);
    }, 400);
};

window.handleGetProduct = handleGetProduct;
window.handleGetProducts = handleGetProducts;


document.addEventListener('DOMContentLoaded', () => {
    handleGetProducts();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});

