import { createApiBackendApp } from "./app";

const app = createApiBackendApp();
const API_BACKEND_PORT = 3001;

app.listen(API_BACKEND_PORT, () => {
  console.log(`API Backend running on port ${API_BACKEND_PORT}`);
});
