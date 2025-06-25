import createJob from '../../Core/QueueCore/createJob.js';

export default createJob({
  name: 'DoTaskJob',
  handle: async (payload) => {
    const { name } = payload;
    console.log(`[JOB] Iniciando tarefa: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log(`[JOB] Finalizada tarefa: ${name}`);
  }
});
