import express from 'express';
import chalk from 'chalk';
import './bootstrap/app.js';
import routes from './routes/api.js';

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log(chalk.green('Servidor rodando em http://localhost:3000'));
});