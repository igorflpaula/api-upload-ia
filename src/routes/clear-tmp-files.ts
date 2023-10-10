import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";

const tmpFolderPath = "tmp";

export async function clearTMPFiles(app: FastifyInstance) {
    app.post('/clear-tmp-files', async (req, reply) => {
        try {
            if (fs.existsSync(tmpFolderPath)) {
                // Liste todos os arquivos na pasta "tmp"
                const files = await fs.promises.readdir(tmpFolderPath);

                // Remova cada arquivo
                for (const file of files) {
                    const filePath = path.join(tmpFolderPath, file);
                    await fs.promises.unlink(filePath);
                }

                reply.code(200).send({ message: 'Pasta "tmp" limpa com sucesso' });
            } else {
                reply.code(404).send({ error: 'A pasta "tmp" não foi encontrada' });
            }
        } catch (error) {
            reply.code(500).send({ error: "Erro ao limpar a pasta 'tmp'" })
        }
    })
}