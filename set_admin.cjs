const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function makeAdmin() {
    const db = await open({
        filename: path.join(__dirname, 'server', 'database.sqlite'),
        driver: sqlite3.Database
    });

    const email = 'matheus@email.com';
    await db.run('UPDATE users SET is_admin = 1 WHERE email = ?', [email]);
    console.log(`✅ Usuário ${email} agora é ADMINISTRADOR.`);
    await db.close();
}

makeAdmin().catch(console.error);
