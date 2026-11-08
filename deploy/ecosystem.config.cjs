/**
 * pm2 process file for the production server.
 *
 * The deploy workflow copies this file into each release. `current` is a
 * symlink to the active release, so starting from it always runs the newest
 * one. Secrets (ADMIN_PASSWORD, TOKEN_SECRET, SMTP_*) live in
 * /var/www/bondbyte/shared/.env, which the deploy writes from GitHub secrets.
 */
// pm2 loads this file as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

const ENV_FILE = "/var/www/bondbyte/shared/.env";

/**
 * Reads KEY=value lines (values optionally in single or double quotes).
 * Done here rather than with `node --env-file`, so any Node version works.
 */
function readEnvFile(file) {
  const values = {};
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return values;
  }
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match || line.trimStart().startsWith("#")) continue;
    let value = match[2];
    if (/^'.*'$/.test(value) || /^".*"$/.test(value)) value = value.slice(1, -1);
    values[match[1]] = value;
  }
  return values;
}

module.exports = {
  apps: [
    {
      name: "bondbyte",
      cwd: "/var/www/bondbyte/current",
      script: "server.js",
      env: {
        ...readEnvFile(ENV_FILE),
        NODE_ENV: "production",
        // 3000 is taken by another app on this server; nginx proxies to this port.
        PORT: "4310",
        // Only nginx talks to the Node server.
        HOSTNAME: "127.0.0.1",
        // Content, inquiries, uploads and history: outside the releases, kept across deploys.
        DATA_DIR: "/var/www/bondbyte/data",
      },
      max_memory_restart: "500M",
      kill_timeout: 5000,
    },
  ],
};
