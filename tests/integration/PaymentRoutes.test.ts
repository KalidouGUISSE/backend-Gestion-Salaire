import request from "supertest";
import express from "express";
import { jest, describe, it, expect, beforeAll } from "@jest/globals";

describe("Payment Routes", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
    });

    describe("GET /payments", () => {
        it("should return payments list", async () => {
            const response = await request(app)
                .get("/payments")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });

    describe("POST /payments", () => {
        it("should create a payment", async () => {
            const response = await request(app)
                .post("/payments")
                .set("Authorization", "Bearer token")
                .send({
                    payslipId: 1,
                    amount: 100,
                    method: "CASH"
                });

            expect(response.status).toBe(201);
        });
    });

    describe("POST /payments/generate-receipt", () => {
        it("should generate receipt", async () => {
            const response = await request(app)
                .post("/payments/generate-receipt")
                .set("Authorization", "Bearer token")
                .send({
                    paymentIds: [1, 2]
                });

            expect(response.status).toBe(200);
        });
    });

    describe("GET /payments/export-payrun/:payRunId", () => {
        it("should export payrun receipts", async () => {
            const response = await request(app)
                .get("/payments/export-payrun/1")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });
});