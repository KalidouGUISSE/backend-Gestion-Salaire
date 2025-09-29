import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import EmployeeRoute from "./routes/EmployeeRoute.js";
import CompanyRoute from "./routes/CompanyRoute.js";
import PayRunRoute from "./routes/PayRunRoute.js";
import PayslipRoute from "./routes/PayslipRoute.js";
import PaymentRoute from "./routes/PaymentRoute.js";
import DashboardRoute from "./routes/DashboardRoute.js";
dotenv.config();
const app = express();
// Autoriser ton frontend
app.use(cors({
    origin: 'http://localhost:5173', // <-- l'URL de ton frontend React
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // <-- autoriser toutes les méthodes que tu utilises
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middlewares
app.use(express.json()); // JSON parser
// Routes
app.use('/auth', AuthRoute);
app.use('/users', UserRoute);
app.use('/employees', EmployeeRoute);
app.use('/companies', CompanyRoute);
app.use('/payruns', PayRunRoute);
app.use('/payslips', PayslipRoute);
app.use('/payments', PaymentRoute);
app.use('/dashboard', DashboardRoute);
// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server démarré sur http://localhost:${port}/`);
});
//# sourceMappingURL=index.js.map