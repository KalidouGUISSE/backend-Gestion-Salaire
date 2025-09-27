import request from "supertest";
import express from "express";
import { jest, describe, it, expect, beforeAll } from "@jest/globals";

describe("Dashboard Routes", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
    });

    describe("GET /dashboard/kpis", () => {
        it("should return KPIs", async () => {
            const response = await request(app)
                .get("/dashboard/kpis")
                .set("Authorization", "Bearer token");

            expect(response.status).toBe(200);
        });
    });
});