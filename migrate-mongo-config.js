require('dotenv-safe').config();

function getDatabaseName(uri) {
  try {
    const parsed = new URL(uri);
    const pathname = parsed.pathname.replace(/^\//, '');

    return pathname || 'orthographe_plus';
  } catch {
    return 'orthographe_plus';
  }
}

const mongoUri = process.env.MONGODB_URI;

module.exports = {
  mongodb: {
    url: mongoUri,
    databaseName: getDatabaseName(mongoUri),
  },
  migrationsDir: 'db/migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
};