// routes.ts

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("track-one", "routes/track-one/index.tsx"),
  route("products", "routes/products/index.tsx"),
] satisfies RouteConfig;
