import Express from 'express';
const app = Express();
app.use(Express.json());
const PORT = process.env.PORT || 3000;
app.get('/', (request, response) => {
    return response.send('Hello world');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { server };

export default app;