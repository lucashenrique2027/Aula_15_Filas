import DoTaskJob from '../../../app/Jobs/DoTaskJob.js';

export default async function DoTaskController(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "O campo 'name' é obrigatório no corpo da requisição." });
  }

  try {
    // Envia o job para a fila 'do-task-queue' com payload contendo o name
    await DoTaskJob.dispatch({ name }, "do-task-queue");

    return res.status(200).json({ message: "Job enviado para a fila com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar job para a fila:", error);
    return res.status(500).json({ error: "Erro interno ao enviar job." });
  }
}
