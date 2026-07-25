import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tüm analiz istemci tarafında çalıştığı için uygulama pür statik dışa
  // aktarılır: `npm run build` sonrası `out/` klasörü IIS, Nginx, Apache veya
  // herhangi bir statik dosya sunucusuyla Node.js gerekmeden yayınlanabilir.
  output: "export",
};

export default nextConfig;
