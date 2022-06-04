import mongoose from 'mongoose';

import app from './server';

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose
  .connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
