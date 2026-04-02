import Text "mo:core/Text";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Preserved from previous version to avoid stable variable discard errors
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Category = {
    #hairClips;
    #scrunches;
    #earrings;
    #hairBands;
    #hairAccessories;
    #jewelry;
    #apparel;
  };

  module Category {
    public func compare(cat1 : Category, cat2 : Category) : Order.Order {
      switch (cat1, cat2) {
        case (#hairClips, #hairClips) { #equal };
        case (#hairClips, _) { #less };
        case (_, #hairClips) { #greater };
        case (#scrunches, #scrunches) { #equal };
        case (#scrunches, _) { #less };
        case (_, #scrunches) { #greater };
        case (#earrings, #earrings) { #equal };
        case (#earrings, _) { #less };
        case (_, #earrings) { #greater };
        case (#hairBands, #hairBands) { #equal };
        case (#hairBands, _) { #less };
        case (_, #hairBands) { #greater };
        case (#hairAccessories, #hairAccessories) { #equal };
        case (#hairAccessories, _) { #less };
        case (_, #hairAccessories) { #greater };
        case (#jewelry, #jewelry) { #equal };
        case (#jewelry, _) { #less };
        case (_, #jewelry) { #greater };
        case (#apparel, #apparel) { #equal };
      };
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Category;
    image : Text;
    rating : Float;
    reviewCount : Nat;
    isNew : Bool;
    isBestSeller : Bool;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Category;
    image : Text;
    isNew : Bool;
    isBestSeller : Bool;
  };

  public type SeoSettings = {
    pageName : Text;
    metaTitle : Text;
    metaDescription : Text;
    keywords : Text;
    ogTitle : Text;
    ogDescription : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  let seoSettings = Map.empty<Text, SeoSettings>();
  // Preserved from previous version
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId : Nat = 21;

  // Admin password (default: clipify2024)
  var adminPassword : Text = "clipify2024";

  let seedData : [(Nat, Product)] = [
    (1, { id = 1; name = "Daisy Hair Clip"; description = "Cute daisy-shaped hair clip"; priceCents = 299; category = #hairClips; image = "https://picsum.photos/200?1"; rating = 4.7; reviewCount = 80; isNew = true; isBestSeller = true }),
    (2, { id = 2; name = "Velvet Scrunchie"; description = "Soft velvet material"; priceCents = 199; category = #scrunches; image = "https://picsum.photos/200?2"; rating = 4.8; reviewCount = 120; isNew = false; isBestSeller = true }),
    (3, { id = 3; name = "Heart Earrings"; description = "Gold-plated heart earrings"; priceCents = 799; category = #earrings; image = "https://picsum.photos/200?3"; rating = 4.6; reviewCount = 95; isNew = false; isBestSeller = false }),
    (4, { id = 4; name = "Bow Hair Band"; description = "Classic bow design"; priceCents = 399; category = #hairBands; image = "https://picsum.photos/200?4"; rating = 4.9; reviewCount = 150; isNew = true; isBestSeller = true }),
    (5, { id = 5; name = "Pearl Hair Pins"; description = "Set of pearl hair pins"; priceCents = 499; category = #hairAccessories; image = "https://picsum.photos/200?5"; rating = 4.5; reviewCount = 70; isNew = false; isBestSeller = false }),
    (6, { id = 6; name = "Butterfly Necklace"; description = "Delicate butterfly design"; priceCents = 1299; category = #jewelry; image = "https://picsum.photos/200?6"; rating = 4.7; reviewCount = 110; isNew = true; isBestSeller = false }),
    (7, { id = 7; name = "Plaid Skirt"; description = "Stylish plaid skirt"; priceCents = 1999; category = #apparel; image = "https://picsum.photos/200?7"; rating = 4.8; reviewCount = 100; isNew = true; isBestSeller = true }),
    (8, { id = 8; name = "Star Hair Clips"; description = "Set of star-shaped clips"; priceCents = 349; category = #hairClips; image = "https://picsum.photos/200?8"; rating = 4.6; reviewCount = 85; isNew = false; isBestSeller = false }),
    (9, { id = 9; name = "Satin Scrunchies"; description = "Smooth satin material"; priceCents = 249; category = #scrunches; image = "https://picsum.photos/200?9"; rating = 4.9; reviewCount = 120; isNew = true; isBestSeller = true }),
    (10, { id = 10; name = "Hoop Earrings"; description = "Classic hoop design"; priceCents = 899; category = #earrings; image = "https://picsum.photos/200?10"; rating = 4.7; reviewCount = 105; isNew = false; isBestSeller = true }),
    (11, { id = 11; name = "Fabric Hair Band"; description = "Comfortable fabric band"; priceCents = 359; category = #hairBands; image = "https://picsum.photos/200?11"; rating = 4.8; reviewCount = 95; isNew = false; isBestSeller = false }),
    (12, { id = 12; name = "Rhinestone Hair Pins"; description = "Sparkling rhinestone pins"; priceCents = 599; category = #hairAccessories; image = "https://picsum.photos/200?12"; rating = 4.6; reviewCount = 80; isNew = false; isBestSeller = true }),
    (13, { id = 13; name = "Rose Gold Bracelet"; description = "Elegant rose gold design"; priceCents = 1499; category = #jewelry; image = "https://picsum.photos/200?13"; rating = 4.7; reviewCount = 100; isNew = true; isBestSeller = false }),
    (14, { id = 14; name = "Floral Dress"; description = "Beautiful floral pattern"; priceCents = 2499; category = #apparel; image = "https://picsum.photos/200?14"; rating = 4.8; reviewCount = 125; isNew = true; isBestSeller = true }),
    (15, { id = 15; name = "Bunny Hair Clips"; description = "Adorable bunny design"; priceCents = 399; category = #hairClips; image = "https://picsum.photos/200?15"; rating = 4.5; reviewCount = 75; isNew = false; isBestSeller = false }),
    (16, { id = 16; name = "Luxury Scrunchies"; description = "High-end luxury material"; priceCents = 299; category = #scrunches; image = "https://picsum.photos/200?16"; rating = 4.9; reviewCount = 110; isNew = true; isBestSeller = true }),
    (17, { id = 17; name = "Diamond Earrings"; description = "Stunning diamond design"; priceCents = 999; category = #earrings; image = "https://picsum.photos/200?17"; rating = 4.7; reviewCount = 95; isNew = false; isBestSeller = true }),
    (18, { id = 18; name = "Satin Hair Band"; description = "Smooth satin band"; priceCents = 389; category = #hairBands; image = "https://picsum.photos/200?18"; rating = 4.6; reviewCount = 80; isNew = false; isBestSeller = false }),
    (19, { id = 19; name = "Gemstone Hair Pins"; description = "Colorful gemstone pins"; priceCents = 649; category = #hairAccessories; image = "https://picsum.photos/200?19"; rating = 4.8; reviewCount = 110; isNew = true; isBestSeller = true }),
    (20, { id = 20; name = "Choker Necklace"; description = "Trendy choker design"; priceCents = 1099; category = #jewelry; image = "https://picsum.photos/200?20"; rating = 4.7; reviewCount = 100; isNew = false; isBestSeller = false }),
  ];

  let defaultSeoSettings : [(Text, SeoSettings)] = [
    ("home", { pageName = "home"; metaTitle = "Clipify Kovai - Korean Girls' Accessories"; metaDescription = "Shop the latest hair clips, scrunchies, earrings and more at Clipify Kovai."; keywords = "hair clips, scrunchies, earrings, jewelry, Korean accessories, Kovai"; ogTitle = "Clipify Kovai - Korean Girls' Accessories"; ogDescription = "Discover unique and affordable Korean-inspired accessories for every style." }),
    ("shop", { pageName = "shop"; metaTitle = "Shop All Products - Clipify Kovai"; metaDescription = "Browse our full selection of trendy Korean accessories and apparel."; keywords = "accessories, shop, Korean fashion, jewelry, hair bands, Kovai"; ogTitle = "Shop Clipify Kovai"; ogDescription = "Find the perfect accessories to complete your look." }),
    ("categories", { pageName = "categories"; metaTitle = "Shop by Category - Clipify Kovai"; metaDescription = "Explore our accessories by category - hair clips, jewelry, apparel and more."; keywords = "categories, accessories, hair clips, jewelry, apparel, Kovai"; ogTitle = "Categories | Clipify Kovai"; ogDescription = "Shop our curated Korean collections for every style." }),
  ];

  func seedProducts() {
    if (products.isEmpty()) {
      for ((id, product) in seedData.values()) {
        products.add(id, product);
      };
    };
  };

  func seedSeoSettings() {
    if (seoSettings.isEmpty()) {
      for ((pageName, settings) in defaultSeoSettings.values()) {
        seoSettings.add(pageName, settings);
      };
    };
  };

  seedProducts();
  seedSeoSettings();

  // Admin Password Auth
  public shared func checkAdminPassword(password : Text) : async Bool {
    password == adminPassword;
  };

  public shared func setAdminPassword(currentPassword : Text, newPassword : Text) : async Bool {
    if (currentPassword != adminPassword) { return false };
    if (newPassword.size() < 6) { return false };
    adminPassword := newPassword;
    true;
  };

  // Product Catalog (public)
  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
  };

  // Admin Product Management
  public shared func addProduct(input : ProductInput) : async Product {
    let id = nextProductId;
    nextProductId += 1;
    let product : Product = {
      id;
      name = input.name;
      description = input.description;
      priceCents = input.priceCents;
      category = input.category;
      image = input.image;
      rating = 0.0;
      reviewCount = 0;
      isNew = input.isNew;
      isBestSeller = input.isBestSeller;
    };
    products.add(id, product);
    product;
  };

  public shared func updateProduct(id : Nat, input : ProductInput) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        let updated : Product = {
          id;
          name = input.name;
          description = input.description;
          priceCents = input.priceCents;
          category = input.category;
          image = input.image;
          rating = existing.rating;
          reviewCount = existing.reviewCount;
          isNew = input.isNew;
          isBestSeller = input.isBestSeller;
        };
        products.add(id, updated);
        updated;
      };
    };
  };

  public shared func deleteProduct(id : Nat) : async () {
    ignore products.remove(id);
  };

  // SEO Settings
  public query func getSeoSettings(pageName : Text) : async ?SeoSettings {
    seoSettings.get(pageName);
  };

  public query func getAllSeoSettings() : async [SeoSettings] {
    seoSettings.values().toArray();
  };

  public shared func updateSeoSettings(settings : SeoSettings) : async () {
    seoSettings.add(settings.pageName, settings);
  };
};
