const express = require("express");
const { default: mongoose } = require('mongoose');
const { AllRoutes } = require("./router/router");
const createError = require('http-errors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { COOKIE_PARSER_SECRET_KEY } = require("./utils/constants");

module.exports = class Application {
    #app = express();
    #DB_URI
    #PORT
    constructor(PORT, DB_URI){
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.initClientSession();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }
    configApplication (){
        this.#app.use(cors());
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended: true}));
        this.#app.use(morgan('dev'));
        this.#app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc({
            swaggerDefinition:{
                openapi: '3.0.0',
                info: {
                    title: 'Social Media Try!',
                    version: '1.0.0',
                    description: 'Let me give it a try to write a social media🖤✨'
                },
                server: [
                    {
                        url: `http://localhost:${this.#PORT}`
                    }
                ],
                components: {
                    securitySchemes: {
                        BearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                        }
                    }
                },
                security: [{ BearerAuth: [] }]
            },
            apis:['./app/router/**/*.js']
        }),
        {explorer: true}
        ))
    }
    initClientSession(){
        this.#app.use(cookieParser(COOKIE_PARSER_SECRET_KEY));
        this.#app.use(session({
            secret: COOKIE_PARSER_SECRET_KEY,
            resave: true,
            saveUninitialized: false,
            initClientSession: true,
            cookie: {
                secure: true
            }
        }))
    }
    createServer(){
        const http = require("http");
        const server = http.createServer(this.#app)
        server.listen(this.#PORT, () => {
            console.log(`Server is running on http://localhost:${this.#PORT}`);
        })
    }
    connectToMongoDB(){
        mongoose.connect(this.#DB_URI);
        mongoose.connection.on('connected', () => {
            console.log('Connected to mongoDB successfully✔️');
        });
        mongoose.connection.on('error', (err) =>{
            console.log('Failed to connect to MongoDB:', err);
        });
        mongoose.connection.on('disconnected', (error) =>{
            console.log('Connection to MongoDB lost:', error);
        });
        process.on('SIGINT', async () => {
            console.log('Disconnected❗');
            await mongoose.connection.close();
            process.exit(0);
        });
    }
    createRoutes(){
        this.#app.use(AllRoutes)
    }
    errorHandling(){
        this.#app.use((req, res, next) => {
            next(createError.NotFound())
        });
        this.#app.use((error, req, res, next)=> {
            const serverError = createError.InternalServerError();
            const statusCode = error.statusCode || serverError.status;
            const message = error.message || serverError.message;
            return res.status(statusCode).json({
                errors: {
                    statusCode,
                    message
                }
            })
        })
    }
}