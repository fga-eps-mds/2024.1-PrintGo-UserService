import Express from 'express';
import userRoutes from './routes/user.route';
import lotacaoRoutes from './routes/lotacao.route';
import cors from 'cors';
import PoliceUnitRoutes from './routes/policeunit.route';

const app = Express();
app.use(Express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

app.use('/user', userRoutes);
app.use('/lotacao', lotacaoRoutes);
app.use('/policeUnit', PoliceUnitRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});

export { server };

export default app;