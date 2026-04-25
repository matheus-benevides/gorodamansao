const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDb } = require('./db.cjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'mansao-secret-key-2024';

// Middlewares
app.use(cors());
app.use(express.json());

let db;

// -- MIDDLEWARE DE AUTENTICAÇÃO --
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acesso negado' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

// -- DEFINIÇÃO DAS ROTAS --

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!db) return res.status(503).json({ error: 'Banco de dados não disponível' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: 'E-mail já cadastrado ou dados inválidos' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!db) return res.status(503).json({ error: 'Banco de dados não disponível' });

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { name: user.name, email: user.email } });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.get('/api/products', async (req, res) => {
    if (!db) return res.status(503).json({ error: 'Banco de dados não disponível' });
    try {
        const products = await db.all('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// -- PROFILE ROUTES --

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, name, email, avatar FROM users WHERE id = ?', [req.user.id]);
        const addresses = await db.all('SELECT * FROM addresses WHERE user_id = ?', [req.user.id]);
        const payments = await db.all('SELECT * FROM payment_methods WHERE user_id = ?', [req.user.id]);
        res.json({ ...user, addresses, payments });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar perfil' });
    }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
    const { name, email, avatar, password } = req.body;
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.run('UPDATE users SET name = ?, email = ?, avatar = ?, password = ? WHERE id = ?', [name, email, avatar, hashedPassword, req.user.id]);
        } else {
            await db.run('UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?', [name, email, avatar, req.user.id]);
        }
        res.json({ message: 'Perfil atualizado' });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao atualizar perfil' });
    }
});

app.post('/api/profile/addresses', authenticateToken, async (req, res) => {
    const { street, city, state, zip } = req.body;
    try {
        await db.run('INSERT INTO addresses (user_id, street, city, state, zip) VALUES (?, ?, ?, ?, ?)', [req.user.id, street, city, state, zip]);
        res.status(201).json({ message: 'Endereço adicionado' });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao adicionar endereço' });
    }
});

app.post('/api/profile/payments', authenticateToken, async (req, res) => {
    const { card_holder, card_number, expiry, type } = req.body;
    try {
        await db.run('INSERT INTO payment_methods (user_id, card_holder, card_number, expiry, type) VALUES (?, ?, ?, ?, ?)', [req.user.id, card_holder, card_number, expiry, type]);
        res.status(201).json({ message: 'Método de pagamento adicionado' });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao adicionar método de pagamento' });
    }
});

// -- ORDERS ROUTES --

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        for (let order of orders) {
            order.items = await db.all('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar pedidos' });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    const { total, shipping, address_id, payment_id, items } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO orders (user_id, total, shipping, address_id, payment_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, total, shipping, address_id, payment_id]
        );
        const orderId = result.lastID;

        for (let item of items) {
            await db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, parseFloat(item.price.replace(',', '.'))]
            );
        }

        res.status(201).json({ message: 'Pedido criado', orderId });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao criar pedido' });
    }
});

// -- INICIALIZAÇÃO --

async function startServer() {
    try {
        db = await initDb();
        app.listen(PORT, () => {
            console.log(`🚀 MANSÃO BACKEND RODANDO EM http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('ERRO FATAL:', err);
        process.exit(1);
    }
}

startServer();
