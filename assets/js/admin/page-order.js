import { apiCall } from '../api.js';

let allOrders = [];

async function loadOrders() {
    try {
        const response = await apiCall('/admin/orders');
        allOrders = response.data;
        renderOrders(allOrders);
    } catch (error) {
        console.error('Gagal memuat pesanan:', error);
        renderError();
    }
}

function getStatusBadge(status) {
    const styles = {
        completed: 'bg-green-100 text-green-800',
        pending:   'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    const cls = styles[status] ?? 'bg-gray-100 text-gray-800';
    return `<span class="text-xs font-medium px-2.5 py-0.5 rounded ${cls}">${status}</span>`;
}

function renderOrders(orders) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    if (!orders.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">No orders found</td>
            </tr>`;
        return;
    }

    tbody.innerHTML = orders.map((order) => `
        <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            data-id="${order.id}">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">#${order.id}</td>
            <td class="px-4 py-3">${order.user.name}</td>
            <td class="px-4 py-3">${new Date(order.created_at).toLocaleDateString('id-ID')}</td>
            <td class="px-4 py-3">$${Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td class="px-4 py-3">${getStatusBadge(order.status)}</td>
        </tr>
    `).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.dataset.id;
            window.location.href = `order-detail.html?id=${id}`;
        });
    });
}

function renderError() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="px-6 py-4 text-center text-red-500">Gagal memuat data pesanan.</td>
        </tr>`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});