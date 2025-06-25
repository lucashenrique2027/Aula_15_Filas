import createJob from '../../Core/QueueCore/createJob.js';

export default createJob({
  name: "DoTaskJob",
  handle: async (payload) => {
    // Simula a tarefa demorada esperando 10 segundos
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("Tarefa demorada executada com payload:", payload);
  }
});

/**
 * Para subir o worker que irá executar os jobs da fila "do-task-queue" com
 * até 3 jobs executando simultaneamente, use o comando no terminal:
 * 
 *   CONCURRENCY=3 node path/para/seu/worker.js
 * 
 * Onde:
 * - CONCURRENCY=3 é uma variável de ambiente que o worker deve ler para
 *   limitar o número de jobs paralelos (dependendo de como o worker foi implementado).
 * - Ajuste "path/para/seu/worker.js" para o caminho real do seu arquivo worker.
 *
 * Exemplo: 
 *   CONCURRENCY=3 node ./app/Workers/doTaskWorker.js
 * 
 * O worker deve estar preparado para ler essa variável de ambiente e controlar
 * a quantidade de tarefas simultâneas processadas da fila "do-task-queue".
 */
