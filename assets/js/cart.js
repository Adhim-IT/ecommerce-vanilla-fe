import { apiCall } from './api.js';

let stripe, elements, cardElement, currentClientSecret;
let currentCart = { items: [], total: 0 };

async function getCart() {
    return apiCall('/cart');
}

async function addToCart(product_id, quantity) {
    return apiCall('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id, quantity })
    });
}

async function removeFromCart(product_id) {
    return apiCall(`/cart/${product_id}`, { method: 'DELETE' });
}

async function clearCart() {
    return apiCall('/cart', { method: 'DELETE' });
}

async function initStripe() {
    stripe = Stripe('pk_test_51P5KfTRxV7gERovnlVAINLRnNOyQ3aqvW3Ewv02fYHeNHdweUJONLt0LMUi28IJdx6ymyYwqDLKTde1NISZcCpdo00sAUVz9iF');
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');

    cardElement.on('change', (event) => {
        document.getElementById('card-errors').textContent = event.error ? event.error.message : '';
    });
}

async function displayCart() {
    try {
        const cart = await getCart();
        const items = cart.cartitems || [];

        if (items.length === 0) {
            document.getElementById('cart-items').innerHTML = '<p>Keranjang kosong</p>';
            return;
        }

        let total = 0;
        document.getElementById('cart-items').innerHTML = items.map(item => {
            const subtotal = item.product.price * item.quantity;
            total += subtotal;
            return `
                <div class="bg-white p-4 mb-2 rounded">
                    <p class="font-bold">${item.product.name}</p>
                    <p>$ ${item.product.price} x ${item.quantity} = $ ${subtotal.toLocaleString('en-US')}</p>
                    <button onclick="handleRemoveFromCart(${item.product.id}); location.reload();" class="text-red-600 text-sm">Hapus</button>
                </div>
            `;
        }).join('');

        currentCart = { items, total };

        document.getElementById('cart-summary').innerHTML = `
            <div class="bg-white p-4 rounded">
                <p class="font-bold mb-2">Total: $ ${total.toLocaleString('en-US')}</p>
                <button onclick="handleCheckout()" class="bg-blue-600 text-white px-4 py-2 rounded block text-center mb-2 w-full">Checkout</button>
                <a href="index.html" class="bg-gray-400 text-white px-4 py-2 rounded block text-center">Belanja Lagi</a>
            </div>
        `;
    } catch (error) {
        document.getElementById('cart-items').innerHTML = '<p>Error loading cart</p>';
    }
}

window.handleAddToCart = async (product_id) => {
    const quantity = parseInt(document.getElementById(`quantity-${product_id}`)?.value) || 1;
    try {
        await addToCart(product_id, quantity);
        alert('Product added to cart!');
    } catch (error) {
        alert(`Failed to add product to cart: ${error.message}`);
    }
}

window.handleRemoveFromCart = async (product_id) => {
    try {
        await removeFromCart(product_id);
    } catch (error) {
        alert(`Failed to remove product from cart: ${error.message}`);
    }
}

window.handleClearCart = async () => {
    try {
        await clearCart();
        alert('Cart cleared!');
    } catch (error) {
        alert(`Failed to clear cart: ${error.message}`);
    }
}

window.handleCheckout = async () => {
    try {
        const orderRes = await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify({
                items: currentCart.items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                total: currentCart.total
            })
        });

        const paymentRes = await apiCall('/stripe/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ order_id: orderRes.id, amount: orderRes.total_amount })
        });
        currentClientSecret = paymentRes.clientSecret;

        if (!cardElement) await initStripe();
        document.getElementById('checkout-modal').classList.remove('hidden');
    } catch (error) {
        alert(`Checkout error: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCart();

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