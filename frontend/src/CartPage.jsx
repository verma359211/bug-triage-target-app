import { useEffect, useMemo, useState } from "react";

const EMPTY_TOTALS = {
  subtotalCents: 0,
  discountPercent: 0,
  discountCents: 0,
  taxCents: 0,
  shippingCents: 0,
  totalCents: 0,
};

function money(cents = 0) {
  return `$${(cents / 100).toFixed(2)}`;
}

function Icon({ name, size = 18 }) {
  const paths = {
    bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <><path d="M5 12h14"/><path d="M12 5v14"/></>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="m6 7 1 14h10l1-14M9 7V4h6v3"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

async function api(path, options) {
  let sessionId = localStorage.getItem("northstar-demo-session");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("northstar-demo-session", sessionId);
  }
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Demo-Session": sessionId,
      ...options?.headers,
    },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Something went wrong");
  return body;
}

function ProductCard({ product, onAdd, busy }) {
  return (
    <article className="product-card">
      <div className={`product-art ${product.accent}`}>
        <span>{product.name.split(" ").map((word) => word[0]).join("")}</span>
        <small>{product.category}</small>
      </div>
      <div className="product-info">
        <div className="product-title"><h3>{product.name}</h3><strong>{money(product.priceCents)}</strong></div>
        <p>{product.description}</p>
        <div className="product-footer">
          <span className={product.inStock ? "stock" : "stock sold-out"}>
            <i /> {product.inStock ? `${product.stock} available` : "Sold out"}
          </span>
          <button type="button" disabled={!product.inStock || busy} onClick={() => onAdd(product.id)}>
            {product.inStock ? "Add" : "Unavailable"}<Icon name="plus" size={15}/>
          </button>
        </div>
      </div>
    </article>
  );
}

function CartItem({ item, onQuantity, onRemove, busy }) {
  return (
    <div className="cart-item">
      <div className="cart-item-copy"><strong>{item.name}</strong><span>{money(item.priceCents)} each</span></div>
      <div className="quantity-control">
        <button type="button" aria-label={`Decrease ${item.name}`} disabled={busy} onClick={() => onQuantity(item.productId, item.quantity - 1)}><Icon name="minus" size={13}/></button>
        <span>{item.quantity}</span>
        <button type="button" aria-label={`Increase ${item.name}`} disabled={busy} onClick={() => onQuantity(item.productId, item.quantity + 1)}><Icon name="plus" size={13}/></button>
      </div>
      <strong className="line-total">{money(item.lineTotalCents)}</strong>
      <button className="remove-button" type="button" aria-label={`Remove ${item.name}`} disabled={busy} onClick={() => onRemove(item.productId)}><Icon name="trash" size={15}/></button>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return <div className={accent ? "summary-row accent" : "summary-row"}><span>{label}</span><strong>{value}</strong></div>;
}

function OrderHistory({ orders, products }) {
  if (!orders.length) return null;
  return (
    <section className="orders-section" id="orders">
      <div className="section-heading"><div><span>Order history</span><h2>Previously confirmed.</h2></div><p>Orders are isolated to this browser and expire after two hours.</p></div>
      <div className="orders-grid">
        {[...orders].reverse().map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-icon"><Icon name="package" size={20}/></div>
            <div><span>Order #{order.id}</span><strong>{order.items.map((item) => products.find((product) => product.id === item.productId)?.name).join(", ")}</strong><small>{order.status} · {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></div>
            <strong>{money(order.totalCents)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CartPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], totals: EMPTY_TOTALS });
  const [orders, setOrders] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const itemCount = useMemo(
    () => cart.items.reduce((total, item) => total + item.quantity, 0),
    [cart.items],
  );

  useEffect(() => {
    Promise.all([api("/products"), api("/cart"), api("/orders")])
      .then(([catalog, currentCart, orderHistory]) => {
        setProducts(catalog.products);
        setCart(currentCart);
        setOrders(orderHistory.orders);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  function clearMessages() {
    setError("");
    setNotice("");
  }

  async function addItem(productId) {
    clearMessages();
    setBusy(true);
    try {
      const body = await api("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setCart(body);
      setNotice("Added to your cart.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateQuantity(productId, quantity) {
    clearMessages();
    setBusy(true);
    try {
      const body = await api(`/cart/items/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setCart(body);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(productId) {
    clearMessages();
    setBusy(true);
    try {
      const body = await api(`/cart/items/${productId}`, { method: "DELETE" });
      setCart((current) => ({ ...current, items: body.items }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function previewCoupons(event) {
    event.preventDefault();
    clearMessages();
    const coupons = couponInput
      .split(",")
      .map((coupon) => coupon.trim().toUpperCase())
      .filter(Boolean);
    setBusy(true);
    try {
      const body = await api("/checkout/preview", {
        method: "POST",
        body: JSON.stringify({ coupons }),
      });
      setAppliedCoupons(coupons);
      setCart(body);
      setNotice(coupons.length ? `${coupons.join(" + ")} applied.` : "Coupons cleared.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function checkout() {
    clearMessages();
    setBusy(true);
    try {
      const order = await api("/checkout", {
        method: "POST",
        body: JSON.stringify({ coupons: appliedCoupons }),
      });
      const [emptyCart, catalog] = await Promise.all([api("/cart"), api("/products")]);
      setCart(emptyCart);
      setProducts(catalog.products);
      setOrders((current) => [...current, order]);
      setCouponInput("");
      setAppliedCoupons([]);
      setNotice(`Order #${order.id} confirmed for ${money(order.totalCents)}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top"><span className="brand-mark">N</span><span>Northstar Supply</span></a>
        <nav><a href="#shop">Shop</a><a href="#orders">Orders</a><span>Free shipping over $50</span></nav>
        <a className="cart-link" href="#cart"><Icon name="bag" size={18}/> Cart <span>{itemCount}</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div><span className="eyebrow">Small tools for focused work</span><h1>Objects for the<br/>daily build.</h1><p>A tiny collection of useful desk goods, designed for demos, debugging, and the occasional good idea.</p><a href="#shop">Browse the collection <Icon name="arrow" size={17}/></a></div>
        </section>

        <div className="promo-bar"><span>Demo offer</span><strong>Try SAVE30 + VIP30 together</strong><span>Free shipping from $50</span></div>

        <section className="shop-layout" id="shop">
          <div className="catalog">
            <div className="section-heading"><div><span>The collection</span><h2>Simple things, well made.</h2></div><p>{products.length} products · live inventory</p></div>
            <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={addItem} busy={busy}/>)}</div>
          </div>

          <aside className="cart-panel" id="cart">
            <div className="cart-heading"><div><span>Your cart</span><h2>{itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Ready when you are"}</h2></div><Icon name="bag" size={21}/></div>
            {cart.items.length === 0 ? <div className="empty-cart"><span><Icon name="bag" size={22}/></span><strong>Your cart is empty</strong><p>Add something from the collection to begin.</p></div> : <div className="cart-items">{cart.items.map((item) => <CartItem key={item.productId} item={item} onQuantity={updateQuantity} onRemove={removeItem} busy={busy}/>)}</div>}

            <form className="coupon-form" onSubmit={previewCoupons}><label htmlFor="coupons">Coupon codes</label><div><input id="coupons" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="SAVE10 or SAVE30, VIP30" disabled={busy}/><button type="submit" disabled={busy || !cart.items.length}>Apply</button></div></form>

            {error && <div className="message error"><button type="button" onClick={() => setError("")} aria-label="Dismiss error"><Icon name="close" size={13}/></button>{error}</div>}
            {notice && <div className="message success"><Icon name="check" size={14}/>{notice}</div>}

            <div className="summary">
              <SummaryRow label="Subtotal" value={money(cart.totals.subtotalCents)}/>
              {cart.totals.discountCents > 0 && <SummaryRow label={`Discount (${cart.totals.discountPercent}%)`} value={`−${money(cart.totals.discountCents)}`} accent/>}
              <SummaryRow label="Estimated tax" value={money(cart.totals.taxCents)}/>
              <SummaryRow label="Shipping" value={cart.totals.shippingCents === 0 ? "Free" : money(cart.totals.shippingCents)}/>
              <div className="total-row"><span>Total</span><strong>{money(cart.totals.totalCents)}</strong></div>
            </div>
            <button className="checkout-button" type="button" disabled={busy || !cart.items.length} onClick={checkout}>{busy ? "Working…" : "Complete checkout"}<Icon name="arrow" size={17}/></button>
            <p className="sandbox-note">Demo checkout · no payment is collected</p>
          </aside>
        </section>

        <OrderHistory orders={orders} products={products}/>
      </main>

      <footer><a className="brand" href="#top"><span className="brand-mark">N</span><span>Northstar Supply</span></a><p>A deliberately small shop for testing an AI bug-triage agent.</p><span>In-memory demo · Node + React</span></footer>
    </>
  );
}
