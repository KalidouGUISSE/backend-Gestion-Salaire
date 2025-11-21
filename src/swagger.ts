import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Payroll Management API",
            version: "1.0.0",
            description: "API complète pour la gestion des salaires, paiements et tableaux de bord",
            contact: {
                name: "Support Technique",
                email: "support@yallabakhna.com"
            },
            license: {
                name: "ISC"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Serveur de développement",
            },
            {
                url: "https://backend-gestion-salaire.onrender.com",
                description: "Serveur de production Render",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Company: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "ID unique de l'entreprise"
                        },
                        name: {
                            type: "string",
                            description: "Nom de l'entreprise"
                        },
                        logo: {
                            type: "string",
                            description: "Chemin vers le logo"
                        },
                        address: {
                            type: "string",
                            description: "Adresse de l'entreprise"
                        },
                        currency: {
                            type: "string",
                            default: "XOF",
                            description: "Devise utilisée"
                        },
                        payPeriodType: {
                            type: "string",
                            enum: ["MONTHLY", "WEEKLY", "DAILY"],
                            default: "MONTHLY"
                        },
                        isActive: {
                            type: "boolean",
                            default: true
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        password: {
                            type: "string",
                            description: "Hash du mot de passe"
                        },
                        fullName: {
                            type: "string"
                        },
                        role: {
                            type: "string",
                            enum: ["SUPER_ADMIN", "ADMIN", "CASHIER", "EMPLOYEE"]
                        },
                        companyId: {
                            type: "integer",
                            nullable: true
                        },
                        isActive: {
                            type: "boolean",
                            default: true
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Employee: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        companyId: {
                            type: "integer"
                        },
                        firstName: {
                            type: "string"
                        },
                        lastName: {
                            type: "string"
                        },
                        fullName: {
                            type: "string"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        phone: {
                            type: "string"
                        },
                        position: {
                            type: "string"
                        },
                        contractType: {
                            type: "string",
                            enum: ["JOURNALIER", "FIXE", "HONORAIRE"]
                        },
                        salary: {
                            type: "number",
                            format: "decimal",
                            description: "Salaire mensuel ou taux journalier"
                        },
                        bankAccount: {
                            type: "string"
                        },
                        bankName: {
                            type: "string"
                        },
                        taxIdentifier: {
                            type: "string"
                        },
                        hireDate: {
                            type: "string",
                            format: "date-time"
                        },
                        endDate: {
                            type: "string",
                            format: "date-time"
                        },
                        isActive: {
                            type: "boolean",
                            default: true
                        },
                        photos: {
                            type: "string",
                            description: "Chemin vers la photo de profil"
                        },
                        attendanceCount: {
                            type: "integer",
                            default: 0
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                PayRun: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        companyId: {
                            type: "integer"
                        },
                        title: {
                            type: "string"
                        },
                        type: {
                            type: "string",
                            enum: ["MONTHLY", "WEEKLY", "DAILY"]
                        },
                        periodStart: {
                            type: "string",
                            format: "date-time"
                        },
                        periodEnd: {
                            type: "string",
                            format: "date-time"
                        },
                        status: {
                            type: "string",
                            enum: ["DRAFT", "APPROVED", "CLOSED"]
                        },
                        notes: {
                            type: "string"
                        },
                        createdById: {
                            type: "integer"
                        },
                        approvedById: {
                            type: "integer"
                        },
                        totalGross: {
                            type: "number",
                            format: "decimal"
                        },
                        totalDeductions: {
                            type: "number",
                            format: "decimal"
                        },
                        totalNet: {
                            type: "number",
                            format: "decimal"
                        },
                        totalPaid: {
                            type: "number",
                            format: "decimal"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Payslip: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        payRunId: {
                            type: "integer"
                        },
                        employeeId: {
                            type: "integer"
                        },
                        gross: {
                            type: "number",
                            format: "decimal"
                        },
                        deductions: {
                            type: "number",
                            format: "decimal"
                        },
                        netPayable: {
                            type: "number",
                            format: "decimal"
                        },
                        paidAmount: {
                            type: "number",
                            format: "decimal"
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "PARTIAL", "PAID", "LOCKED"]
                        },
                        locked: {
                            type: "boolean",
                            default: false
                        },
                        pdfPath: {
                            type: "string"
                        },
                        notes: {
                            type: "string"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Payment: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        companyId: {
                            type: "integer"
                        },
                        payslipId: {
                            type: "integer"
                        },
                        amount: {
                            type: "number",
                            format: "decimal"
                        },
                        method: {
                            type: "string",
                            enum: ["CASH", "BANK_TRANSFER", "ORANGE_MONEY", "WAVE", "OTHER"]
                        },
                        reference: {
                            type: "string"
                        },
                        receiptPath: {
                            type: "string"
                        },
                        paidById: {
                            type: "integer"
                        },
                        paidAt: {
                            type: "string",
                            format: "date-time"
                        },
                        notes: {
                            type: "string"
                        },
                        qrValidated: {
                            type: "boolean",
                            default: false
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Attendance: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        employeeId: {
                            type: "integer"
                        },
                        companyId: {
                            type: "integer"
                        },
                        timestamp: {
                            type: "string",
                            format: "date-time"
                        },
                        type: {
                            type: "string",
                            enum: ["ENTRY", "EXIT"]
                        },
                        deviceId: {
                            type: "string"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "admin@company.com"
                        },
                        password: {
                            type: "string",
                            minLength: 6,
                            example: "password123"
                        }
                    }
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        accessToken: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        },
                        user: {
                            $ref: "#/components/schemas/User"
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        error: {
                            type: "object",
                            properties: {
                                status: {
                                    type: "integer",
                                    example: 400
                                },
                                message: {
                                    type: "string",
                                    example: "Description de l'erreur"
                                }
                            }
                        }
                    }
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        message: {
                            type: "string",
                            example: "Opération réussie"
                        },
                        data: {
                            type: "object",
                            description: "Données de réponse"
                        }
                    }
                },
                PaginatedResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        data: {
                            type: "array",
                            items: {
                                type: "object"
                            }
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                page: {
                                    type: "integer",
                                    example: 1
                                },
                                limit: {
                                    type: "integer",
                                    example: 10
                                },
                                total: {
                                    type: "integer",
                                    example: 45
                                },
                                totalPages: {
                                    type: "integer",
                                    example: 5
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export default specs;