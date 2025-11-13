const fs = require('fs');

try {
  const license = JSON.parse(fs.readFileSync('./license.json', 'utf8'));
  console.log(`✅ Licencia verificada: ${license.owner}`);
} catch (err) {
  console.log('❌ No se pudo verificar la licencia. Asegúrate de que license.json esté correcto.');
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const DIST_DIR = path.join(__dirname, 'dist');
const LICENSE_FILE = path.join(__dirname, 'licenses.json');

app.use(bodyParser.json());

let licenses = {};
if (fs.existsSync(LICENSE_FILE)) {
  try { licenses = JSON.parse(fs.readFileSync(LICENSE_FILE)); }
  catch(e){ licenses = {}; }
} else {
  fs.writeFileSync(LICENSE_FILE, JSON.stringify(licenses, null, 2));
}
function saveLicenses(){ fs.writeFileSync(LICENSE_FILE, JSON.stringify(licenses, null, 2)); }

function requireAdminKey(req, res, next){
  const adminKey = req.headers['x-admin-key'] || req.body.adminKey || req.query.adminKey;
  if (!adminKey || adminKey !== process.env.MS_ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized - admin key required' });
  }
  next();
}

app.post('/admin/generate-license', requireAdminKey, (req, res) => {
  const owner = req.body.owner || 'cliente';
  const key = crypto.randomBytes(10).toString('hex').toUpperCase();
  const entry = { key, owner, createdAt: new Date().toISOString(), revoked:false };
  licenses[key] = entry;
  saveLicenses();
  res.json({ ok:true, license: key, entry });
});

app.get('/admin/list-licenses', requireAdminKey, (req, res) => {
  res.json({ ok:true, licenses });
});

app.post('/admin/revoke-license', requireAdminKey, (req, res) => {
  const { key } = req.body;
  if (!key || !licenses[key]) return res.status(400).json({ ok:false, error:'License not found' });
  licenses[key].revoked = true;
  saveLicenses();
  res.json({ ok:true, license: licenses[key] });
});

app.post('/api/validate-license', (req, res) => {
  const { license } = req.body;
  if (!license) return res.status(400).json({ valid:false });
  const entry = licenses[license];
  if (!entry) return res.json({ valid:false });
  if (entry.revoked) return res.json({ valid:false, revoked:true });
  return res.json({ valid:true, entry });
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
} else {
  app.get('/', (req,res)=> res.send('Build not found. Ejecuta: npm run build y luego node server.js'));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Emy'Art Mockup Studio server listening on http://localhost:${PORT}`));
