const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function fixDb() {
    const db = await open({
        filename: path.join(__dirname, 'server', 'database.sqlite'),
        driver: sqlite3.Database
    });

    try {
        await db.run('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0');
        console.log('✅ Coluna is_admin adicionada com sucesso.');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('ℹ️ Coluna is_admin já existe.');
        } else {
            throw err;
        }
    }

    const email = 'matheus@email.com';
    await db.run('UPDATE users SET is_admin = 1 WHERE email = ?', [email]);
    console.log(`✅ Usuário ${email} agora é ADMINISTRADOR.`);
    
    await db.close();
}

fixDb().catch(console.error);
