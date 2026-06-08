import { apiCall } from '../api.js';

let allProducts = [];
let editingId = null;

async function loadProducts() {
    try {
        const res = await apiCall('/admin/products');
        allProducts = res.data || [];
        renderTable();
    } catch (e) {
        alert('Error loading products: ' + e.message);
    }
}

function renderTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    if (!allProducts.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No products</td></tr>';
        return;
    }

    tbody.innerHTML = allProducts.map((p, i) => `
        <tr class="border-b dark:border-gray-700">
            <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${p.name}</th>
            <td class="px-4 py-3 max-w-[12rem] truncate">${p.description || '-'}</td>
            <td class="px-4 py-3">$${Number(p.price).toLocaleString()}</td>
            <td class="px-4 py-3">${p.quantity}</td>
            <td class="px-4 py-3 flex items-center justify-end relative">
                <button data-dropdown-id="${p.id}" class="dropdown-toggle inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
                <div class="dropdown-menu hidden absolute right-0 top-full z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" data-dropdown-id="${p.id}">
                    <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <button type="button" onclick="window.openEditModal(${p.id}); window.closeAllDropdowns();" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                                Edit
                            </button>
                        </li>
                        <li>
                            <button type="button" onclick="window.openDeleteModal(${p.id}); window.closeAllDropdowns();" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400">
                                <svg class="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                </svg>
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-dropdown-id');
            const dropdown = document.querySelector(`.dropdown-menu[data-dropdown-id="${id}"]`);

            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu.getAttribute('data-dropdown-id') !== id) {
                    menu.classList.add('hidden');
                }
            });

            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    });
}

window.toggleDropdown = (id) => {
    const dropdown = document.querySelector(`.dropdown-menu[data-dropdown-id="${id}"]`);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

window.openCreateModal = () => {
    editingId = null;
    document.getElementById('createForm').reset();
    document.getElementById('createProductModal').classList.remove('hidden');
};

window.closeCreateModal = () => {
    document.getElementById('createProductModal').classList.add('hidden');
};

window.openEditModal = (id) => {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    editingId = id;
    const form = document.getElementById('updateForm');
    form.querySelector('[name="product_name"]').value = product.name;
    form.querySelector('[name="product_price"]').value = product.price;
    form.querySelector('[name="product_description"]').value = product.description || '';
    form.querySelector('[name="product_quantity"]').value = product.quantity;
    document.getElementById('updateProductModal').classList.remove('hidden');
};

window.closeUpdateModal = () => {
    document.getElementById('updateProductModal').classList.add('hidden');
};

window.openDeleteModal = (id) => {
    editingId = id;
    document.getElementById('deleteModal').classList.remove('hidden');
};

window.closeDeleteModal = () => {
    document.getElementById('deleteModal').classList.add('hidden');
};

window.confirmDelete = async () => {
    if (!editingId) return;

    try {
        await apiCall(`/admin/products/${editingId}`, { method: 'DELETE' });
        alert('Product deleted!');
        window.closeDeleteModal();
        loadProducts();
    } catch (e) {
        alert('Error: ' + e.message);
    }
};

window.handleSaveProduct = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector('[name="product_name"]').value;
    const price = form.querySelector('[name="product_price"]').value;
    const description = form.querySelector('[name="product_description"]').value;
    const quantity = form.querySelector('[name="product_quantity"]').value;

    const data = { name, price: parseFloat(price), description, quantity: parseInt(quantity) };

    try {
        if (editingId) {
            await apiCall(`/admin/products/${editingId}`, { method: 'PUT', body: JSON.stringify(data) });
            alert('Product updated!');
            window.closeUpdateModal();
        } else {
            await apiCall('/admin/products', { method: 'POST', body: JSON.stringify(data) });
            alert('Product added!');
            window.closeCreateModal();
        }
        editingId = null;
        loadProducts();
    } catch (e) {
        alert('Error: ' + e.message);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
