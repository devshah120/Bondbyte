/**
 * pm2 process file for the production server.
 *
 * The deploy workflow copies this file into each release. `current` is a
 * symlink to the active release, so `pm2 startOrReload` always starts the
 * newest one. Secrets (ADMIN_PASSWORD, TOKEN_SECRET, SMTP_*) live in
 * /var/www/bondbyte/shared/.env, which never leaves the server.
 */
module.exports = {
  apps: [
    {
      name: "bondbyte",
      cwd: "/var/www/bondbyte/current",
      script: "server.js",
      node_args: "--env-file=/var/www/bondbyte/shared/.env",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
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
