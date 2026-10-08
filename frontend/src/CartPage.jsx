import { useEffect, useState } from "react";

const products = {
  mug: { name: "Coffee Mug", priceCents: 1999 },
  notebook: { name: "Notebook", priceCents: 1250 },
  sticker: { name: "Sticker", priceCents: 101 },
  pin: { name: "Enamel Pin", priceCents: 101 },
};

function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function cartTotal(items) {
  return items.reduce(
    (total, item) => total + products[item.productId].priceCents * item.quantity,
    0,
  );
}

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [totalCents, setTotalCents] = useState(0);

  useEffect(() => {
    fetch("/cart")
      .then((response) => response.json())
      .then((body) => {
        setItems(body.items);
        setTotalCents(cartTotal(body.items));
      });
  }, []);

  async function remove(productId) {
    const response = await fetch(`/cart/items/${productId}`, { method: "DELETE" });
    const body = await response.json();
    setItems(body.items);
  }

  return (
    <main>
      <h1>Your cart</h1>
      {items.length === 0 ? <p>Your cart is empty.</p> : null}
      {items.map((item) => (
        <article key={item.productId}>
          <span>
            {products[item.productId].name} × {item.quantity}
          </span>
          <button type="button" onClick={() => remove(item.productId)}>
            Remove
          </button>
        </article>
      ))}
      <strong>Total: {money(totalCents)}</strong>
    </main>
  );
}
