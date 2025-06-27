import { users, recommendations, type User, type InsertUser, type Recommendation, type InsertRecommendation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecentRecommendations(limit?: number): Promise<Recommendation[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const [recommendation] = await db
      .insert(recommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async getRecentRecommendations(limit: number = 10): Promise<Recommendation[]> {
    const recs = await db
      .select()
      .from(recommendations)
      .orderBy(recommendations.createdAt)
      .limit(limit);
    return recs;
  }
}

export const storage = new DatabaseStorage();
