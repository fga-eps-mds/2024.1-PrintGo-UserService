import Express from 'express';
import userRoutes from './routes/user.route';
import unidadeRoutes from './routes/unidade.route';
import cors from 'cors';

const app = Express();
app.use(Express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

app.use('/user', userRoutes);
app.use('/unidade', unidadeRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});

export { server };

export default app;