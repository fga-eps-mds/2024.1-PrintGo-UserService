import Express from 'express';
import userRoutes from './routes/user.route';
import lotacaoRoutes from './routes/lotacao.route';

const app = Express();
app.use(Express.json());
const PORT = process.env.PORT || 3000;

app.use('/user', userRoutes);
app.use('/lotacao', lotacaoRoutes);


const server = app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});

export { server };

export default app;