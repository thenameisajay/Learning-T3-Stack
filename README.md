# Learning T3 Stack

## Introduction to the T3 Stack

The T3 Stack represents a modern approach to web development, emphasizing simplicity, modularity, and type safety. It's an excellent toolkit for developers looking to build fast, reliable, and maintainable web applications. The stack is a creation of [Theo](https://twitter.com/t3dotgg) and primarily includes Next.js, TypeScript, and often Tailwind CSS for styling. For backend development, tRPC, Prisma, and NextAuth.js are recommended to enhance your application's functionality and security.

### Official Documentation Intro to T3 Stack

The T3 Stack focuses on providing a streamlined development experience without compromising on the power and flexibility needed to build complex applications. You can learn more about the T3 Stack and its components through the official documentation and resources provided by Theo.

## Project Overview: A Simple Blog Application

This project is a demonstration of the T3 Stack in action, implemented through a simple blog application. The application supports basic CRUD operations (Create, Read, Update, Delete) for blog posts and includes features for authentication and authorization. The primary goal of this project was to gain hands-on experience with the T3 Stack, especially since it's being utilized as the main technology stack at my current workplace.

## Key Features and Technologies

The blog application leverages several cutting-edge technologies and libraries, including:

- **[Next.js](https://nextjs.org)**: A React framework for building user interfaces.
- **[Clerk Auth](https://clerk.com)**: A service for managing user authentication and authorization.
- **[Prisma](https://prisma.io)**: An ORM for handling database operations in a type-safe manner.
- **[Tailwind CSS](https://tailwindcss.com)**: A utility-first CSS framework for designing custom UIs without leaving your HTML.
- **[tRPC](https://trpc.io)**: Enables end-to-end typesafe APIs, simplifying data fetching and mutations.
- **[Zod](https://zod.dev/)**: A TypeScript-first schema validation library.
- **[React Hook Form](https://react-hook-form.com/)**: A library for managing forms in React (not utilized in this project since I'm familiar with this library).
- **[Upstash](https://upstash.com/)**: A serverless database service that provides scalable and easy-to-use databases, perfect for serverless applications and microservices. It supports Redis and Kafka, offering low latency and high throughput , Used as a rate limiter [Link](https://github.com/upstash/ratelimit)

### Additional Notes

- The focus of this project was primarily on backend functionality, utilizing tRPC and Prisma. As a result, the UI, styled with Tailwind CSS, is kept basic.
- For those interested in learning more about the T3 Stack, I recommend watching this [T3 Stack Tutorial](https://www.youtube.com/watch?v=YkOSUVzOAA4).
- The source code for this project is available on GitHub: [Learn T3 Stack by Theo](https://github.com/t3dotgg/chirp).

## License

This project is open-sourced under the MIT License. For more details, see the [LICENSE.md](https://github.com/thenameisajay/Learning-T3-Stack/blob/main/LICENSE) file in the project repository.
