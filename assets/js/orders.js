import { apiCall } from './api.js';
import { env } from './env.js';

let stripe, elements, cardElement, currentClientSecret, currentOrderId;

async function getOrders() {
    return apiCall('/orders');
}

async function initStripe() {
    stripe = Stripe(env.STRIPE_PUBLISHABLE_KEY);
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');

    cardElement.on('change', (event) => {
        const errorDiv = document.getElementById('card-errors');
        if (event.error) {
            errorDiv.textContent = event.error.message;
        } else {
            errorDiv.textContent = '';
        }
    });
}

async function displayOrders() {
    try {
        const ordersRes = await getOrders();
        const orders = ordersRes.data || ordersRes || [];

        if (orders.length === 0) {
            document.getElementById('orders-container').innerHTML = '<p class="text-gray-500">Belum ada pesanan</p>';
            return;
        }

        document.getElementById('orders-container').innerHTML = orders.map(order => {
            const items =order.order_items || [];
            const itemsHtml = items.map(item => {
                const subtotal = (item.price || 0) * (item.quantity || 0);
                return `
                <div class="text-sm text-gray-600 ml-4">
                    <p>${item.product?.name || 'Product'} x ${item.quantity || 1} = $ ${subtotal.toLocaleString('en-US')}</p>
                </div>
            `;
            }).join('');

            const total = order.total || order.total_amount || 0;
            const createdDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US') : 'N/A';
            return `
                <div class="bg-white p-4 mb-4 rounded border-l-4 border-blue-600">
                    <div class="flex justify-between mb-2">
                        <div>
                            <p class="font-bold">Order #${order.id}</p>
                            <p class="text-sm text-gray-500">${createdDate}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold">$ ${total.toLocaleString('en-US')}</p>
                            <span class="text-xs px-2 py-1 rounded ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }">
                                ${order.status === 'completed' ? 'Selesai' : order.status === 'pending' ? 'Menunggu' : order.status}
                            </span>
                        </div>
                    </div>
                    <div class="mb-2">${itemsHtml}</div>
                    ${order.status === 'pending' ? `<button onclick="handlePayOrder(${order.id}, ${total})" class="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-2">Bayar Sekarang</button>` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-container').innerHTML = `<p class="text-red-600">Error loading orders: ${error.message}</p>`;
    }
}

window.handlePayOrder = async (orderId, amount) => {
    try {
        const paymentRes = await apiCall('/stripe/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ order_id: orderId, amount })
        });
        currentOrderId = orderId;
        currentClientSecret = paymentRes.clientSecret;

        if (!cardElement) await initStripe();
        document.getElementById('checkout-modal').classList.remove('hidden');
    } catch (error) {
        alert(`Payment error: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayOrders();

    document.getElementById('pay-button')?.addEventListener('click', async (e) => {
        e.target.disabled = true;

        const { paymentIntent, error } = await stripe.confirmCardPayment(currentClientSecret, {
            payment_method: { card: cardElement, billing_details: { name: 'Customer' } }
        });

        if (error) {
            document.getElementById('card-errors').textContent = error.message;
            e.target.disabled = false;
        } else if (paymentIntent.status === 'succeeded') {
            alert('Payment successful!');
            document.getElementById('checkout-modal').classList.add('hidden');
            location.href = 'order-success.html';
           
        }
    });
});
