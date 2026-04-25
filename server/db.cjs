const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function initDb() {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0,
            avatar TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnrjtzDrjVYgQPK_L_C-nd6G_A1tg3S3lgP27cTBMRpsmLyNhJslUrnuN4xWP6_2sy6BlcgOdywekL0zzxglJLrJQNvcEgweS07RKtzG7DQjFaYl4esJtxfZhF0sTBXl-MrIj8OQ5yV4CF4qLgfoLY-Du6NwNnwD2UNdtcPUuDJXs8AJA2txpV8z0SRECgkGqKLy59nx_RFv-f3KTMjue5bt8buTXUSGryhQD-re4Qg4QoqaGr03_wA27Tpl0yxL9u5ZJleO11jlg'
        );

        CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS payment_methods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            card_holder TEXT NOT NULL,
            card_number TEXT NOT NULL,
            expiry TEXT NOT NULL,
            type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            flavor TEXT NOT NULL,
            tag TEXT NOT NULL,
            price TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            color TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total REAL NOT NULL,
            shipping REAL NOT NULL,
            address_id INTEGER,
            payment_id INTEGER,
            status TEXT DEFAULT 'Processando',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        );
    `);

    // Seed products
    const productsCount = await db.get('SELECT COUNT(*) as count FROM products');
    if (productsCount.count === 0) {
        const initialProducts = [
            { name: 'Neon Lime', flavor: 'Limão Intenso', tag: 'Vibe', price: '249,00', description: 'O sabor da festa. Complexo vitamínico B, 0% Cafeína. A explosão cítrica que corta o escuro.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnv7LSiOqC06vZO8Ov2xHpllpHn45K_BQY2o5fCN5VRKdQVK4xp7f-x_-TMKmOWYPMJ9WgEe4-71wlEdf53mlt-IglWlLBxuUpiKdFj7j2LAXaHEx8yY1VYM6VPzmp6KjesJuTO-a4AZWpwKG_KhCM8aM9_hxOi9sbWQJO1eugSf87HwQDlz3I0DtsVzj-2X1Pgy3POnW4y4wMcLSnvQoixaqPukuyYhAAuJtzn0-LvnATmwkJwdwRAX0JugPKZRA551hl5fXGzL8', color: 'secondary' },
            { name: 'Pink Void', flavor: 'Frutas Vermelhas', tag: 'Velvet', price: '289,00', description: 'Mais profundo que o desejo. Complexo vitamínico B, 0% Cafeína. O toque aveludado das sombras.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSpj077RJH7vqqMN9k7C3kWPHcrEUhNVmumnX7dXzAh5dVFx9ibnVkAyZMjrktssAlTmUJFfWiCywEEpQNQUoS6C94ZYjUQaP1K4lM2RyR8Ps40folvVcIh-9ZP4o-Nz2z21_5Tr1Nvnn5Qovf6eMT8HfWThDV6o7ZTkU0G14SmAr2t-UkBmJXH1zo3HRo7MgYW-BYQCtrTp7C03O6QFD3ZJ0qA9a4iLkU3i_L2oaoZ5DmEferdrt305wq75wx0DWAhCqhfZqDFNg', color: 'tertiary' },
            { name: 'Cyan Freeze', flavor: 'Ice Frost', tag: 'Glacier', price: '269,00', description: 'Zero Absoluto. Complexo vitamínico B, 0% Cafeína. O frio cortante da madrugada urbana.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCavO9T-6Foy4SWOP3gnwG1zIFjAFz1jUwTOk8i_HuHv25N9cxFkbJtUN9ZWtnFkZtff6L-_fSONDxhhzwtF9VHFup0uXr-nxR0V4IBSzfPBvrrQS9MVfZC4UYQMJlCKgmEUdFM0AGrKrUwsDXyiXiyN0OaQwbIddLIs6C7jGtqn6VE1oNFsmOagUK1Ky1Ooj-_81JCrsHpSlJ6LgXqsHG0BLNIRX-cCUrPWb16aS5KsPFUhPkN_id_5tzXv6MAcQlgZVgeL5_rIKg', color: 'secondary-fixed' },
            { name: 'Yellow Pulse', flavor: 'Tropical Sun', tag: 'Haze', price: '299,00', description: 'Energia Pura. Complexo vitamínico B, 0% Cafeína. O calor magnético que não deixa parar.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL-j842zeP4RZRoCh5-ExEiWtlT2BDW1QQOxvKpeSzCbovuntHARIr8y-ch04jcOkCR0ugNyAYxSeiZdPUW8F15poGvbcgiSPRhaYNBGCE9-iJ0JaKeTBITPOOekBXLZxBU-n-ToptIgPQHz2PjWTez_xxxP9yaBHfUHbLXs8tCRmDl2JSNeSkO1LQHDw1qk2DPbNYL9MPhh51vSoyKJ6R514j7nk1NLjhePO5qrrXhTd2qOGjqwekN_srlmPX7VBV_97LfugpgoI', color: 'primary-fixed' },
            { name: 'Purple Haze', flavor: 'Grape Fusion', tag: 'Aura', price: '319,00', description: 'Mente Elétrica. À base de Nootrópicos, 0% Álcool. A sintonia fina entre o corpo e a alma.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjtmiJr0Nihq-2sq2GxHcHXOGGiH_DvDqiNYG4m8do4Q62_c60OoJXyyucF8HqMHgUNx0Cbtwa8spHWfjGvnyYZd93eVzKbaP2TNGkzxZJcZ4vVl63TqBCya1TZYZGYMu0QqJ0JgkJWFtUvFFAP8dU2ibLUuEusR6ryRO-QAP-VELCfOArvZUE_dqjTdzDFGkLLIpFbZ9ZzQofJ8ZNXrSDstEPjAOQZNnMkvUSGTyU50tw4h6X215weOMqdbW3Xsv1zUCPajtTtpY', color: 'tertiary-fixed' },
            { name: 'Emerald Night', flavor: 'Matcha Cool', tag: 'Zenith', price: '349,00', description: 'Calma Focada. Enriquecido com L-Teanina. O silêncio absoluto no meio do festival.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnv7LSiOqC06vZO8Ov2xHpllpHn45K_BQY2o5fCN5VRKdQVK4xp7f-x_-TMKmOWYPMJ9WgEe4-71wlEdf53mlt-IglWlLBxuUpiKdFj7j2LAXaHEx8yY1VYM6VPzmp6KjesJuTO-a4AZWpwKG_KhCM8aM9_hxOi9sbWQJO1eugSf87HwQDlz3I0DtsVzj-2X1Pgy3POnW4y4wMcLSnvQoixaqPukuyYhAAuJtzn0-LvnATmwkJwdwRAX0JugPKZRA551hl5fXGzL8', color: 'secondary-container' }
        ];

        for (const p of initialProducts) {
            await db.run(
                'INSERT INTO products (name, flavor, tag, price, description, image, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.name, p.flavor, p.tag, p.price, p.description, p.image, p.color]
            );
        }
    }

    await db.run('UPDATE users SET is_admin = 1 WHERE email = ?', ['matheus@email.com']);
    
    const adminExists = await db.get('SELECT * FROM users WHERE email = ?', ['admin@email.com']);
    if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash('admin123', 10);
        await db.run('INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)', ['Admin', 'admin@email.com', hash, 1]);
    }

    return db;
}

module.exports = { initDb };
