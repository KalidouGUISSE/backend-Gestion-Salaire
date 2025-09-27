import request from "supertest";
import express from "express";
import { jest, describe, it, expect, beforeAll } from "@jest/globals";

describe("PayRun Routes", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
    });

    describe("GET /payruns", () => {
        it("should return payruns list", async () => {
            const response = await request(app)
                .get("/payruns")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });

    describe("POST /payruns", () => {
        it("should create a payrun", async () => {
            const response = await request(app)
                .post("/payruns")
                .set("Authorization", "Bearer token")
                .send({
                    companyId: 1,
                    type: "MONTHLY",
                    periodStart: "2023-01-01T00:00:00.000Z",
                    periodEnd: "2023-01-31T23:59:59.000Z"
                });

            expect(response.status).toBe(201);
        });
    });

    describe("POST /payruns/:id/generate-payslips", () => {
        it("should generate payslips", async () => {
            const response = await request(app)
                .post("/payruns/1/generate-payslips")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });

    describe("PATCH /payruns/:id/approve", () => {
        it("should approve a payrun", async () => {
            const response = await request(app)
                .patch("/payruns/1/approve")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });
});