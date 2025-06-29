import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CodeCoffee API Documentation')
  .setDescription('API documentation for the CodeCoffee platform\'s authentication module')
  .setVersion('1.0')
  .addTag('auth', 'Authentication endpoints')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth', // This is the key to be used in @ApiBearerAuth() decorator
  )
  .build();
