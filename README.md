# ODDY — Online Store (Logo Integrated)

This starter is an editable e-commerce **front-end demo** made from HTML, CSS, and JavaScript. It includes eight sample products, category filters, product search, a cart with quantity controls and browser storage, and a **demo-only order summary**.

**Important:** It does NOT accept real payments, send orders to a seller, track inventory, or store customer accounts. Do not describe it as a real checkout until you add an appropriate e-commerce service/backend, payment processing, and order management.

## Step 1 — Open it in VS Code
1. Unzip the folder and put `ODDY-online-store` somewhere convenient, like your Desktop.
2. Open Visual Studio Code. Click **File → Open Folder** and select `ODDY-online-store`.
3. You should see:

```
ODDY-online-store/
├── index.html      ← Text, page sections, and navigation
├── styles.css      ← Colors, typography, sizing, layouts
├── app.js          ← Sample products, search, cart, and order preview
└── assets/         ← Eight sample SVG illustrations plus your ODDY logo
```

4. To preview, right-click **index.html → Open with Live Server** if you have the Live Server extension. Otherwise, double-click index.html in File Explorer to open it in your browser.
5. Change something and press **Ctrl+S**. Refresh the browser if you aren't using Live Server.

## Step 2 — Change your store name
In `index.html`, use **Ctrl+H (Find and Replace)**:
- Your brand is already set to `ODDY.` in this included sample.
- Both navigation and footer use your actual uploaded ODDY logo.
- Edit `<title>...</title>` to set your browser tab title.

## Step 3 — Change colors
Open `styles.css`, then edit the values right at the top of the file:

```css
:root {
  --cream: #fbf9f4;
  --ink: #23372e;
  --green: #476c55;
  --peach: #ecad8d;
}
```

A hex color like `#23372e` is a color code. You can search the web for "hex color picker" to select your own.

## Step 4 — Add your real products
At the top of `app.js`, find the `PRODUCTS` array. Each line creates one product card. Example:

```js
{ id: 9, name: "My New Product", price: 599, category: "Home", image: "assets/my-product.jpg", color: "#e5ece5", badge: "NEW" },
```

- Keep each `id` unique.
- `price` is a number only — type `599`, not `₱599` or `"599"`.
- Put your JPG, PNG, SVG, or WEBP image in `assets/` and point `image` to it.
- For categories, use `Home`, `Lifestyle`, `Stationery`, or `Apparel`. If you want different categories, update the category buttons in `index.html` too.
- Save, then refresh.

## Step 5 — Try the features
1. Click **Add to cart** under a product.
2. Open **Cart** on the top right. Increase/decrease quantities or remove items.
3. Press **Review demo order** to see a summary (not a real purchase).
4. Press **Copy summary** to copy the order preview.
5. Try searching for `mug` and filtering to `Home`.
6. Resize your browser window to see the mobile layout.

## Step 6 — Publish a PREVIEW (not a working shop)
If you've used GitHub before, create a new public repository, upload these files while keeping the `assets` folder, then enable **GitHub Pages** in your repository's **Settings → Pages**. The site will be visible publicly as a **demo**. Do not claim payments or orders work.

## What comes next for a real store?
You will need a product/order database, secure checkout through an appropriate payment provider or e-commerce service, inventory/order fulfillment workflows, and legal/privacy information. For beginners, a hosted shop platform (e.g. Shopify or WooCommerce) may be easier than building custom payment and order processing. Never put secret API keys directly into `app.js`.

Tip: The prices are displayed in Philippine pesos (PHP). If you need a different currency, edit the `Intl.NumberFormat` line near the top of `app.js`.
