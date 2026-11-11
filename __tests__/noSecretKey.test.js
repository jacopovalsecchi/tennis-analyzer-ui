const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function filesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(full) : [full];
  });
}

test('frontend source does not contain a Supabase secret', () => {
  const files = [
    ...filesIn(path.join(root, 'src')),
    path.join(root, 'App.tsx'),
    path.join(root, 'index.js'),
    path.join(root, 'babel.config.js'),
    path.join(root, '.env.example'),
  ];
  const forbidden = /sb_secret_|service_role/;

  for (const file of files) {
    expect(fs.readFileSync(file, 'utf8')).not.toMatch(forbidden);
  }
});
