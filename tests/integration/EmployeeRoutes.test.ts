import request from "supertest";
import express from "express";
import { jest, describe, it, expect, beforeAll } from "@jest/globals";
// Import the app or create a test app

describe("Employee Routes", () => {
    let app: express.Application;

    beforeAll(() => {
        // Setup test app
        app = express();
        // Add routes - assuming routes are mounted at /employees
    });

    describe("GET /employees", () => {
        it("should return employees list", async () => {
            const response = await request(app)
                .get("/employees")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });

    describe("POST /employees", () => {
        it("should create an employee", async () => {
            const response = await request(app)
                .post("/employees")
                .set("Authorization", "Bearer token")
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    contractType: "FIXE",
                    salary: 50000
                });

            expect(response.status).toBe(201);
        });
    });

    describe("GET /employees/:id", () => {
        it("should return employee by id", async () => {
            const response = await request(app)
                .get("/employees/1")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });

    describe("PUT /employees/:id", () => {
        it("should update an employee", async () => {
            const response = await request(app)
                .put("/employees/1")
                .set("Authorization", "Bearer token")
                .send({
                    firstName: "Jane"
                });

            expect(response.status).toBe(200);
        });
    });

    describe("DELETE /employees/:id", () => {
        it("should delete an employee", async () => {
            const response = await request(app)
                .delete("/employees/1")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(204);
        });
    });

    describe("PATCH /employees/:id/activate", () => {
        it("should activate an employee", async () => {
            const response = await request(app)
                .patch("/employees/1/activate")
                .set("Authorization", "Bearer token")
                .send({
                    isActive: true
                });

            expect(response.status).toBe(200);
        });
    });
});