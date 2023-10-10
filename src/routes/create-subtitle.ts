import { FastifyInstance } from "fastify";
import { createReadStream } from 'node:fs'
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function createSubtitleRoute(app: FastifyInstance) {
    app.post('/videos/:videoId/subtitle', async (request) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid()
        })

        const { videoId } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            prompt: z.string(),
        })

        const { prompt } = bodySchema.parse(request.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        })

        const videoPath = video.path
        const audioReadStream = createReadStream(videoPath)

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'srt',
            temperature: 0,
            prompt,
        })
        const transcription = String(response)

        // Retorna a legenda como transcription
        await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                transcription
            },
        })

        return { transcription }

        // Chamar a rota AI Complete, formatando o transcription para srt
        // Necessário remover os \n e etc

        // Transformar o retorno, num arquivo srt

        // Subir o arquivo no S3, para que o Front consiga baixar
        // Existe outra solução??
    })
}