import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const placeOrder = async () => {
    if (!customerName || !address || cart.length === 0) {
      setOrderMessage('Please fill your details and add at least one product to the cart.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderPayload = {
      customerName,
      address,
      items: cart,
      total
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (response.ok) {
      setOrderMessage('Order placed successfully!');
      setCart([]);
      setCustomerName('');
      setAddress('');
    } else {
      setOrderMessage('Unable to place order.');
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Daraz Clone</h1>
        <p>Modern ecommerce storefront with cart and checkout</p>
      </header>

      <div style={styles.layout}>
        <section style={styles.productsSection}>
          <h2>Featured Products</h2>
          <div style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={styles.card}>
                <img src={product.image} alt={product.name} style={styles.image} />
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <div style={styles.priceRow}>
                  <strong>Rs. {product.price.toLocaleString()}</strong>
                  <span>Rs. {product.oldPrice.toLocaleString()}</span>
                </div>
                <button onClick={() => addToCart(product)} style={styles.button}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>

        <aside style={styles.sidebar}>
          <h2>Cart</h2>
          {cart.length === 0 ? <p>No items yet.</p> : cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <span>{item.name} x {item.qty}</span>
              <strong>Rs. {(item.price * item.qty).toLocaleString()}</strong>
            </div>
          ))}

          <h3>Checkout</h3>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" style={styles.input} />
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shipping address" style={styles.textarea} />
          <button onClick={placeOrder} style={styles.button}>Place Order</button>
          {orderMessage && <p style={styles.message}>{orderMessage}</p>}
        </aside>
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: 'Arial, sans-serif', padding: 24, background: '#f5f5f5', minHeight: '100vh' },
  header: { marginBottom: 20 },
  layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 },
  productsSection: { background: 'white', padding: 20, borderRadius: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  card: { border: '1px solid #eee', borderRadius: 10, padding: 12, background: '#fff' },
  image: { width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  button: { background: '#f85606', color: 'white', border: 0, padding: '10px 12px', borderRadius: 6, cursor: 'pointer', width: '100%' },
  sidebar: { background: 'white', padding: 20, borderRadius: 12, height: 'fit-content' },
  cartItem: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  input: { width: '100%', padding: 10, marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' },
  textarea: { width: '100%', minHeight: 80, padding: 10, marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' },
  message: { marginTop: 10, color: '#f85606' }
};

export default App;
