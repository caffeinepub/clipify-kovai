import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SeoSettings {
    metaDescription: string;
    pageName: string;
    keywords: string;
    metaTitle: string;
    ogTitle: string;
    ogDescription: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    category: Category;
    rating: number;
    image: string;
    isNew: boolean;
    reviewCount: bigint;
    isBestSeller: boolean;
    priceCents: bigint;
}
export interface ProductInput {
    name: string;
    description: string;
    category: Category;
    image: string;
    isNew: boolean;
    isBestSeller: boolean;
    priceCents: bigint;
}
export enum Category {
    hairBands = "hairBands",
    hairAccessories = "hairAccessories",
    apparel = "apparel",
    jewelry = "jewelry",
    scrunches = "scrunches",
    earrings = "earrings",
    hairClips = "hairClips"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllSeoSettings(): Promise<Array<SeoSettings>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getSeoSettings(pageName: string): Promise<SeoSettings | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSeoSettings(settings: SeoSettings): Promise<void>;
    addProduct(input: ProductInput): Promise<Product>;
    updateProduct(id: bigint, input: ProductInput): Promise<Product>;
    deleteProduct(id: bigint): Promise<void>;
}
