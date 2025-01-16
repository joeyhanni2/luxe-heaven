# LuxeHeaven

Welcome to LuxeHeaven, your premier platform for property listing, buying, and renting. This project aims to provide a seamless and efficient experience for users and administrators alike.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Database Migration](#database-migration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

LuxeHeaven is a comprehensive platform for property listings, allowing users to buy or rent properties with ease. It includes features for user authentication, property management, and an admin dashboard for managing the platform.

## Features

- **User Authentication**: Secure sign-in and sign-up using NextAuth.
- **Property Listings**: Browse, view, and filter properties for buying or renting.
- **User Dashboard**: Manage profile settings, view, edit, and delete properties.
- **Admin Dashboard**: Manage users, list featured properties, edit or delete properties, and view platform analytics.
- **Payment Integration**: Secure payment processing

## Installation

To get started with LuxeHeaven, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/victorpreston/luxeheaven.git
    cd luxeheaven
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the following variables:

    ```properties
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET="your-nextauth-secret"

    GITHUB_ID="your-github-id"
    GITHUB_SECRET="your-github-secret"

    DATABASE_URL="your-database-url"

    INTASEND_PUBLISHABLE_KEY="your-intasend-publishable-key"
    INTASEND_SECRET_KEY="your-intasend-secret-key"
    INTASEND_TEST_MODE=true

    PAYPAL_CLIENT_ID="your-paypal-client-id"
    PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
    PAYPAL_MODE="sandbox"

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
    CLOUDINARY_API_KEY="your-cloudinary-api-key"
    CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
    ```

## Usage

To run the development server:

```bash
  npm run dev
```
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
```


## Database Migration

To set up the database and run migrations:

1. **Generate Prisma Client:**

    ```bash
    npx prisma generate
    ```

2. **Deploy existing migrations:**

    ```bash
    npx prisma migrate deploy
    ```

3. **Create and apply a new migration (if needed):**

    ```bash
    npx prisma migrate dev --name init
    ```

4. **Push the schema to the database:**

    ```bash
    npx prisma db push
    ```

## Deployment

To deploy LuxeHeaven, follow these steps:

1. **Build the project:**

    ```bash
    npm run build
    ```

2. **Start the production server:**

    ```bash
    npm start
    ```

3. **Deploy to Vercel:**

    Ensure you have the `postinstall` script in your `package.json`

    ```json
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "postinstall": "prisma generate"
    }
    ```

    Commit and push your changes to your repository, then deploy to Vercel.

## Contributing

We welcome contributions to LuxeHeaven! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or inquiries, please contact us at support@luxeheaven.com.