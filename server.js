import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// In-memory store for recent orders
const recentOrders = [];

// Order submission and backup logging endpoint
app.post('/api/submit-order', (req, res) => {
  const order = req.body;
  order.receivedAt = new Date().toISOString();
  recentOrders.unshift(order);
  if (recentOrders.length > 100) recentOrders.pop();

  console.log('====================================================');
  console.log('🚗 NEW CAR JUMP STARTER ORDER RECEIVED');
  console.log(`Order Ref: ${order.orderId || 'N/A'}`);
  console.log(`Customer: ${order.customer?.fullName || 'N/A'} | Phone: ${order.customer?.phone || 'N/A'} | WhatsApp: ${order.customer?.whatsapp || 'N/A'}${order.customer?.altPhone ? ` | Alt: ${order.customer.altPhone}` : ''}`);
  console.log(`Address: ${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.state || ''}`);
  console.log(`Product: ${order.product?.name || order.product?.variant || 'Standard'} (Qty: ${order.product?.quantity || 1})`);
  console.log(`Total: ₦${(order.total || 0).toLocaleString()}`);
  console.log('====================================================');

  res.json({ success: true, message: 'Order recorded successfully', orderId: order.orderId });
});

// View recent orders endpoint
app.get('/api/orders', (req, res) => {
  res.json({ count: recentOrders.length, orders: recentOrders });
});

// Public EmailJS config endpoint to pass environment variables safely to client
app.get('/api/emailjs-config', (req, res) => {
  res.json({
    serviceId: process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || 'service_gxhivxk',
    templateId: process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || 'template_239s5yz',
    publicKey: process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || '_h1UzYlyePtWt0IqM'
  });
});

// Explicit routes for GitHub Pages style routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/jump-starter', (req, res) => {
  res.sendFile(path.join(__dirname, 'jump-starter.html'));
});

app.get('/jump-starter.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'jump-starter.html'));
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Fallback to index.html for unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
