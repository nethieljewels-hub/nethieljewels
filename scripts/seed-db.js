/**
 * Nethiel Jewelry Storefront Database Seeder
 * 
 * This script seeds the Supabase database programmatically using the @supabase/supabase-js client
 * if service role or direct admin keys are available in the environment.
 * If not, it instructs the developer on how to run the migration SQL file in the Supabase Dashboard.
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load variables from environment or try to find .env.local
const envPath = path.join(__dirname, "..", ".env.local");
let envVars = {};
if (fs.existsSync(envPath)) {
  const fileContent = fs.readFileSync(envPath, "utf-8");
  fileContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      envVars[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS policies if available, fallback to anon key (might fail if not authenticated)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const sqlFilePath = path.join(__dirname, "..", "supabase", "migrations", "20260811_seed_jewelry.sql");

async function seed() {
  console.log("==================================================");
  console.log("💍 NETHIEL JEWELRY - DATABASE SEEDING UTILITY");
  console.log("==================================================");

  if (!fs.existsSync(sqlFilePath)) {
    console.error(`Error: Seed SQL file not found at ${sqlFilePath}`);
    process.exit(1);
  }

  console.log(`\nSeed SQL file found: ./supabase/migrations/20260811_seed_jewelry.sql`);

  if (!supabaseUrl || !supabaseKey) {
    printManualInstructions();
    return;
  }

  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log("Connecting to Supabase...");
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Since we cannot run raw multi-statement SQL via standard Postgrest REST clients easily,
  // we will parse the categories, settings, shipping charges, and products and seed them programmatically.
  try {
    console.log("\nClearing old records...");
    
    // Clear old products, categories, settings, shipping rates, banners
    const clearProducts = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const clearCategories = await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const clearBanners = await supabase.from("hero_banners").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const clearShipping = await supabase.from("shipping_charges").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const clearSettings = await supabase.from("settings").delete().neq("id", false);

    if (clearProducts.error || clearCategories.error || clearShipping.error || clearSettings.error) {
      console.log("Note: RLS policies might have blocked direct deletions without service role key.");
      printManualInstructions();
      return;
    }

    console.log("Database cleared successfully.");

    // 1. Seed settings
    console.log("\nSeeding store settings...");
    const { error: settingsErr } = await supabase.from("settings").insert({
      id: true,
      shop_name: "NETHIEL JEWELRY",
      logo: "/images/logo-nethiel.jpeg",
      email: "support@nethieljewelry.com",
      phone: "+919876543210",
      whatsapp: "+919876543210",
      instagram: "https://instagram.com/nethieljewelry",
      facebook: "https://facebook.com/nethieljewelry",
      address: "Nethiel Luxury Studio, Kochi, Kerala, 682020"
    });
    if (settingsErr) throw settingsErr;

    // 2. Seed categories
    console.log("Seeding categories...");
    const categories = [
      { id: 'c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', name: 'Rings', slug: 'rings', active: true },
      { id: 'd2d2d2d2-2d2d-2d2d-2d2d-2d2d2d2d2d2d', name: 'Necklaces', slug: 'necklaces', active: true },
      { id: 'e3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e', name: 'Earrings', slug: 'earrings', active: true },
      { id: 'b4b4b4b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b', name: 'Bracelets', slug: 'bracelets', active: true }
    ];
    const { error: catErr } = await supabase.from("categories").insert(categories);
    if (catErr) throw catErr;

    // 3. Seed shipping
    console.log("Seeding shipping charges...");
    const shipping = [
      { state_name: 'Kerala', shipping_charge: 60.00, is_active: true },
      { state_name: 'Karnataka', shipping_charge: 100.00, is_active: true },
      { state_name: 'Tamil Nadu', shipping_charge: 100.00, is_active: true },
      { state_name: 'Maharashtra', shipping_charge: 150.00, is_active: true },
      { state_name: 'Delhi', shipping_charge: 200.00, is_active: true },
      { state_name: 'Goa', shipping_charge: 150.00, is_active: true },
      { state_name: 'Telangana', shipping_charge: 120.00, is_active: true },
      { state_name: 'Gujarat', shipping_charge: 150.00, is_active: true },
      { state_name: 'West Bengal', shipping_charge: 180.00, is_active: true },
      { state_name: 'Rajasthan', shipping_charge: 180.00, is_active: true }
    ];
    const { error: shipErr } = await supabase.from("shipping_charges").insert(shipping);
    if (shipErr) throw shipErr;

    // 4. Seed products
    console.log("Seeding products...");
    const products = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'Aurelia Solitaire Ring',
        slug: 'aurelia-solitaire-ring',
        description: 'Crafted in solid 18K yellow gold, the Aurelia Solitaire features a hand-selected 1-carat round brilliant VVS1 clarity conflict-free diamond. Elegant prongs maximize light performance for unparalleled brilliance.',
        original_price: 45000.00,
        selling_price: 39999.00,
        is_out_of_stock: false,
        category_id: 'c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
        sizes: ['6', '7', '8', '9'],
        colors: ['18K Gold', 'Rose Gold', 'Platinum'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'],
        featured: true,
        active: true
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        title: 'Celeste Gold Necklace',
        slug: 'celeste-gold-necklace',
        description: 'An exquisite 18K solid gold chain adorned with a constellation of delicate bezel-set brilliant diamonds. Hand-assembled with a secure adjustable lock. Timeless and perfect for standalone elegance or layering.',
        original_price: 62000.00,
        selling_price: 54999.00,
        is_out_of_stock: false,
        category_id: 'd2d2d2d2-2d2d-2d2d-2d2d-2d2d2d2d2d2d',
        sizes: ['16 inch', '18 inch', '20 inch'],
        colors: ['18K Gold', 'Rose Gold'],
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'],
        featured: true,
        active: true
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        title: 'Elara Diamond Studs',
        slug: 'elara-diamond-studs',
        description: 'Classic 18K gold four-prong studs claw-setting a pair of matching VVS brilliant-cut diamonds. Minimalist design engineered for secure fit and daily wear. A foundational piece of everyday luxury.',
        original_price: 28000.00,
        selling_price: 24999.00,
        is_out_of_stock: false,
        category_id: 'e3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e',
        sizes: ['One Size'],
        colors: ['18K Gold', 'White Gold'],
        images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop'],
        featured: true,
        active: true
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        title: 'Seraphina Pearl Bracelet',
        slug: 'seraphina-pearl-bracelet',
        description: 'Hand-knotted with Grade AAA freshwater cultured baroque pearls, secured by a custom sterling silver toggle clasp. Exudes soft luster and vintage sophistication. Each pearl is unique in shape and shimmer.',
        original_price: 18000.00,
        selling_price: 14999.00,
        is_out_of_stock: false,
        category_id: 'b4b4b4b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b',
        sizes: ['7 inch', '8 inch'],
        colors: ['Sterling Silver', '18K Gold Vermeil'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'],
        featured: true,
        active: true
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        title: 'Eternal Love Band',
        slug: 'eternal-love-band',
        description: 'A classic pavé diamond eternity band set with brilliant round-cut conflict-free diamonds in a micro-prong setting. Features high polish, thin band silhouette, and continuous sparkle.',
        original_price: 35000.00,
        selling_price: 29999.00,
        is_out_of_stock: false,
        category_id: 'c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
        sizes: ['6', '7', '8', '9'],
        colors: ['18K Gold', 'White Gold', 'Platinum'],
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'],
        featured: false,
        active: true
      }
    ];
    const { error: prodErr } = await supabase.from("products").insert(products);
    if (prodErr) throw prodErr;

    console.log("\n==================================================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY WITH JEWELRY DATA!");
    console.log("==================================================");
  } catch (err) {
    console.error("\nDatabase seeding failed:", err.message || err);
    printManualInstructions();
  }
}

function printManualInstructions() {
  console.log("\n--------------------------------------------------");
  console.log("⚠️  MANUAL SEEDING INSTRUCTIONS REQUIRED");
  console.log("--------------------------------------------------");
  console.log("We do not have direct DB write permissions via API");
  console.log("or active service role keys in this environment.");
  console.log("\nTo seed the database with Nethiel Jewelry data:");
  console.log("1. Open your Supabase Project Dashboard.");
  console.log("2. Navigate to the 'SQL Editor' tab on the left sidebar.");
  console.log("3. Click 'New Query'.");
  console.log(`4. Open the SQL file located at:`);
  console.log(`   ${sqlFilePath}`);
  console.log("5. Copy all the contents and paste them into the SQL Editor query box.");
  console.log("6. Click the 'Run' button in the bottom right corner.");
  console.log("--------------------------------------------------\n");
}

seed();
