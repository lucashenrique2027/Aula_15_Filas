import DoTaskJob from '../../Jobs/DoTaskJob.js';
import dispatch from '../../Core/QueueCore/dispatch.js';

export default async function DoTaskController(request, response) {
  const { name } = request.body;
  await dispatch(DoTaskJob, { name }, 'do-task-queue');
  return response.status(202).json({ message: `Tarefa recebida para: ${name}` });
}