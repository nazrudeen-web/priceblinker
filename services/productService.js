
import { supabase } from "@/lib/supabase";

export class ProductService {
  // Data cleaning utilities
  static removePatterns = [
    /\(unlocked\)/gi,
    /\bunlocked\b/gi,
    /\bunited states\b/gi,
  ];

  static excludeKeywords = [
    "model number",
    "carrier",
    "carrier compatibility",
    "unlocked",
  ];

  static cleanData(obj) {
    if (typeof obj === "string") {
      let cleaned = obj;
      this.removePatterns.forEach((pattern) => {
        cleaned = cleaned.replace(pattern, "").trim();
      });
      return cleaned.replace(/\s{2,}/g, " ");
    } else if (Array.isArray(obj)) {
      return obj.map((item) => this.cleanData(item));
    } else if (obj && typeof obj === "object") {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = this.cleanData(obj[key]);
      }
      return newObj;
    }
    return obj;
  }

  // Fetch product data from Best Buy API
  static async fetchBestBuyProduct(sku) {
    const apiKey = process.env.NEXT_PUBLIC_BESTBUY_KEY;
    const response = await fetch(
      `https://api.bestbuy.com/v1/products/${sku}.json?apiKey=${apiKey}&format=json&show=sku,name,manufacturer,modelNumber,shortDescription,longDescription,color,details.name,details.value,features.feature,includedItemList.includedItem,images,url`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return this.cleanData(data);
  }

  // Process fetched data into app format
  static processFetchedData(data) {
    const featuresText =
      data.features?.map((item) => item.feature).filter(Boolean).join(". ") ||
      "";

    const longDescriptionRaw = [data.longDescription, featuresText]
      .filter(Boolean)
      .join(". ")
      .trim();

    const shortDescFallback =
      longDescriptionRaw.split(". ").slice(0, 3).join(". ") + ".";

    // Process specifications
    const specifications = data.details
      ? data.details
          .filter((item) => {
            const nameLower = (item.name || "").toLowerCase();
            if (
              this.excludeKeywords.some((keyword) =>
                nameLower.includes(keyword)
              )
            ) {
              return false;
            }
            if (!item.name || item.name.trim() === "") return false;
            if (!item.value || item.value.trim() === "") return false;
            return true;
          })
          .map((item) => {
            let cleanValue = item.value || "";
            this.removePatterns.forEach((pattern) => {
              cleanValue = cleanValue.replace(pattern, "").trim();
            });
            return {
              key: item.name || "",
              value: cleanValue.replace(/\s{2,}/g, " "),
            };
          })
      : [];

    // Process images
    const images = data.images
      ? data.images.map((img, i) => ({
          image_url: img.href,
          is_main: i === 0,
        }))
      : [];

    return {
      name: data.name || "",
      brand: data.manufacturer || "",
      shortDescription: data.shortDescription || shortDescFallback,
      longDescription: longDescriptionRaw,
      specifications,
      images,
    };
  }

  // Save product to Supabase
  static async saveProduct({
    productData,
    localizationData,
    specifications,
    images,
    availability,
  }) {
    // Insert main product
    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert({
        slug: productData.slug,
        status: productData.status,
        category: localizationData.category,
      })
      .select("id")
      .single();

    if (productError) throw productError;

    const product_id = newProduct.id;

    // Insert localization
    const localizationToInsert = {
      product_id,
      country: localizationData.country,
      language: localizationData.language,
      name: localizationData.name,
      brand: localizationData.brand,
      short_description: localizationData.short_description,
      long_description: localizationData.long_description,
      meta_title: localizationData.meta_title,
      meta_description: localizationData.meta_description,
      canonical_url: localizationData.canonical_url,
    };

    const { error: localizationError } = await supabase
      .from("product_localizations")
      .insert(localizationToInsert);

    if (localizationError) throw localizationError;

    // Prepare related data
    const specificationsToInsert = specifications.map((spec) => ({
      product_id,
      ...spec,
    }));
    const imagesToInsert = images.map((img) => ({ product_id, ...img }));
    const availabilityToInsert = availability.map((av) => ({
      product_id,
      ...av,
    }));

    // Insert all related data
    const [
      { error: specError },
      { error: imageError },
      { error: availabilityError },
    ] = await Promise.all([
      supabase.from("product_specifications").insert(specificationsToInsert),
      supabase.from("product_images").insert(imagesToInsert),
      supabase.from("product_availability").insert(availabilityToInsert),
    ]);

    if (specError || imageError || availabilityError) {
      throw new Error("Failed to insert related product data.");
    }

    return { product_id };
  }
}
