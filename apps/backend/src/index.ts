import { createPrimaryBackendApp } from "./app";

const PRIMARY_BACKEND_PORT = 3000;
export const app = createPrimaryBackendApp();

app.listen(PRIMARY_BACKEND_PORT, () => {
  console.log(`Server is running on port ${PRIMARY_BACKEND_PORT}`);
});
