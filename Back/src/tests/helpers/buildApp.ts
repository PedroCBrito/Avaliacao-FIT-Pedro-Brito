import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { bookRoutes } from '../../routes/bookRoutes';

/**
 * Builds a Fastify app configured identically to the production server
 * but without calling listen(), making it suitable for testing with app.inject().
 */
export async function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setSerializerCompiler(serializerCompiler);
  app.setValidatorCompiler(validatorCompiler);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation Error',
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(500).send({ message: 'Server Error' });
  });

  app.register(bookRoutes);

  await app.ready();
  return app;
}
