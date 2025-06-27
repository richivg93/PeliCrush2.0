import { users, recommendations, type User, type InsertUser, type Recommendation, type InsertRecommendation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecentRecommendations(limit?: number): Promise<Recommendation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recommendations: Map<number, Recommendation>;
  private currentUserId: number;
  private currentRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.recommendations = new Map();
    this.currentUserId = 1;
    this.currentRecommendationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: Recommendation = { 
      ...insertRecommendation, 
      id,
      createdAt: new Date()
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async getRecentRecommendations(limit: number = 10): Promise<Recommendation[]> {
    const recs = Array.from(this.recommendations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return recs;
  }
}

export const storage = new MemStorage();
