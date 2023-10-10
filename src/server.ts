import { fastify } from "fastify";
import { fastifyCors } from '@fastify/cors';
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";
import { clearTMPFiles } from "./routes/clear-tmp-files";
import { createSubtitleRoute } from "./routes/create-subtitle";

const app = fastify();

// CONFIGURA O ACESSO A APLICAÇÃO
// * PERMITE ACESSO DE QUALQUER LUGAR
app.register(fastifyCors, {
    origin: '*',
})

app.get('/', async () => {
    return 'Hello there! 👋'
  })

// TO DO - Colocar as rotas em PT
app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)
app.register(clearTMPFiles)
app.register(createSubtitleRoute)

app.listen({
    port: 3333,
}).then(() => {
    console.log('Servidor HTTP rodando..')
})