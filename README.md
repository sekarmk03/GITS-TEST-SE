## Technical Test Software Engineer Back End PT GITS Indonesia

### Deliverable Links
- [Postman Collection](https://speeding-crater-449499.postman.co/workspace/My-Workspace~55347127-aead-4a15-8c23-a18c147853b4/collection/15801526-9d88433d-3b32-4cea-82d1-a399ec321803?action=share&creator=15801526)
- [Public Documentation](https://documenter.getpostman.com/view/15801526/2s935rHhTY)

### Installation
```bash
npm install
```

Before running the app, you need to configure the environment variables in ```.env``` file. You can copy the ```.env.example``` file and rename it to ```.env```.


### Run the app
> **Note:** Make sure you have installed global dependencies: [nodemon](https://www.npmjs.com/package/nodemon), [sequelize-cli](https://www.npmjs.com/package/sequelize-cli).

```bash
npm install -g nodemon sequelize-cli
```

```bash
# Create Database
sequelize db:create

# Migrate Database
sequelize db:migrate

# Seeder *Optional
sequelize db:seed:all

# Run the app
npm run dev
```
