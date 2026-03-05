import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, type ZodTypeProvider } from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { ZodError } from 'zod';

import { bookRoutes } from './routes/bookRoutes';

const server = fastify().withTypeProvider<ZodTypeProvider>();

export { server };

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);
server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});


server.register(bookRoutes);

server.listen({ port: 5000, host: '0.0.0.0' }).then(() => {
  console.log('Server running...');
});

server.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      errors: error.flatten().fieldErrors,
    });
  }

  // Erros de banco ou outros
  console.error(error);
  return reply.status(500).send({ message: 'Server Error' });
});