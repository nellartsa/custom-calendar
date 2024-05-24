# Project Description

This project showcases a custom calendar picker built from scratch using Vite and ReactJS. It harnesses the power of Zeller's Congruence Algorithm (Gregorian calendar formula) to deliver accurate date calculations.

#### Key Features:

- Custom Calendar Picker
- Zeller's Congruence Algorithm
- Vite and ReactJS
- HeroIcons Integration

As this static project doesn't rely on external APIs, it's perfectly suited for deployment on GitHub Pages.

## Deployment

1. Setting Up the base Property:

   - Edit your vite.config.js file and locate the build object.
     Within build, add a property named base and set its value to "/{repository-name}/". This establishes the base URL for your deployed website, ensuring proper routing when hosted on GitHub Pages.

2. Creating the GitHub Actions Workflow File:

   - Navigate to your project's root directory and create a new directory named .github/workflows.

   - Inside this directory, create a file named deploy.yml. This file will define the automated deployment workflow on GitHub Pages.

3. Configuring the Deployment Workflow:

   - Open the deploy.yml file and paste the following content.

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install dependencies
        uses: bahmutov/npm-install@v1

      - name: Build project
        run: npm run build

      - name: Upload production-ready build files
        uses: actions/upload-artifact@v3
        with:
          name: production-files
          path: ./dist

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: production-files
          path: ./dist

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Granting Workflow Permissions (Optional, but recommended for security):

   - In your GitHub repository settings, navigate to the "Actions" tab.
   - Under "Workflow permissions," select "Read and write permissions."
     Save your changes. This step ensures your workflow has the necessary permissions to manage the gh-pages branch.

5. Push Your Code:

   - Push your code changes to your GitHub repository, including the vite.config.js modifications and the deploy.yml file.

6. Deployment and Verification:

   - GitHub Actions will automatically trigger the deployment workflow, building your project and deploying it to GitHub Pages.

   - Once the workflow completes successfully, you'll find your deployed website at the following URL or under Deployments:

```
https://{your-github-username}.github.io/{repository-name}/
```
