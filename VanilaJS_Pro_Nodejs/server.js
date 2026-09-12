const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

// THIS IS THE MAGIC LINE: It serves your HTML files directly from this folder
app.use(express.static(__dirname));

const FILE_PATH = path.join(__dirname, 'products.json');

async function getProducts() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    return []; 
  }
}

async function saveProducts(products) {
  await fs.writeFile(FILE_PATH, JSON.stringify(products, null, 2));
}

app.get('/api/products', async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const products = await getProducts();
  products.push(req.body);
  await saveProducts(products);
  res.json({ message: 'Saved successfully' });
});

app.put('/api/products/:id', async (req, res) => {
  let products = await getProducts();
  products = products.map(p => p.id == req.params.id ? req.body : p);
  await saveProducts(products);
  res.json({ message: 'Updated successfully' });
});

app.delete('/api/products/:id', async (req, res) => {
  let products = await getProducts();
  products = products.filter(p => p.id != req.params.id);
  await saveProducts(products);
  res.json({ message: 'Deleted successfully' });
});

app.listen(5001, () => {
  console.log(`✅ Server running. Open http://localhost:5001/admin.html in your browser.`);
});