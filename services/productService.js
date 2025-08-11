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

    if (!apiKey) {
      throw new Error("Missing NEXT_PUBLIC_BESTBUY_KEY environment variable");
    }

    const response = await fetch(
      `https://api.bestbuy.com/v1/products/${sku}.json?apiKey=${apiKey}&format=json&show=sku,name,manufacturer,modelNumber,shortDescription,longDescription,color,details.name,details.value,features.feature,includedItemList.includedItem,images,url`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return this.cleanData(data);
  }

  // Extract variant info (color, storage, RAM) from product data
  static extractVariantInfo(data) {
    const color = data.color || "";

    // Extract storage from details or specifications
    let storage = "";
    let ram = "";

    if (data.details) {
      // Look for storage-related details
      const storageDetail = data.details.find(d => 
        d.name && (
          d.name.toLowerCase().includes('storage') || 
          d.name.toLowerCase().includes('internal storage') ||
          d.name.toLowerCase().includes('built-in storage') ||
          d.name.toLowerCase().includes('capacity')
        )
      );

      // Look for RAM-related details  
      const ramDetail = data.details.find(d => 
        d.name && (
          d.name.toLowerCase().includes('ram') || 
          d.name.toLowerCase().includes('system memory') ||
          d.name.toLowerCase().includes('memory')
        )
      );

      // Look for battery details that might be incorrectly mapped
      const batteryDetail = data.details.find(d => 
        d.name && (
          d.name.toLowerCase().includes('battery') ||
          d.name.toLowerCase().includes('milliampere')
        )
      );

      if (storageDetail && !storageDetail.value.toLowerCase().includes('milliampere') && 
          !storageDetail.value.toLowerCase().includes('fps')) {
        storage = storageDetail.value || "";
      }

      if (ramDetail && !ramDetail.value.toLowerCase().includes('milliampere') && 
          !ramDetail.value.toLowerCase().includes('fps')) {
        ram = ramDetail.value || "";
      }

      // If storage is still empty, try to find it from name patterns
      if (!storage) {
        const possibleStorage = data.details.find(d => 
          d.value && (d.value.includes('GB') || d.value.includes('TB')) &&
          !d.value.toLowerCase().includes('milliampere') &&
          !d.value.toLowerCase().includes('fps') &&
          !d.value.toLowerCase().includes('battery')
        );
        if (possibleStorage) storage = possibleStorage.value;
      }
    }

    return { color, storage, ram };
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

    // Extract variant information
    const variantInfo = this.extractVariantInfo(data);

    // Process specifications (for both product and variant levels)
    const allSpecs = data.details || [];
    const productSpecs = [];
    const variantSpecs = [];

    allSpecs.forEach(item => {
      if (!item.name || !item.value) return;

      const nameLower = item.name.toLowerCase();
      const valueLower = item.value.toLowerCase();

      // Skip excluded keywords
      if (this.excludeKeywords.some(keyword => nameLower.includes(keyword))) {
        return;
      }

      // Variant-specific specs (color, storage, RAM, etc.)
      if (nameLower.includes('color') || 
          (nameLower.includes('storage') && !valueLower.includes('milliampere') && !valueLower.includes('fps')) || 
          (nameLower.includes('memory') && !valueLower.includes('milliampere') && !valueLower.includes('fps')) ||
          (nameLower.includes('capacity') && !valueLower.includes('milliampere')) ||
          nameLower.includes('ram')) {
        variantSpecs.push({
          key: item.name,
          value: item.value
        });
      } else {
        // Product-level specs (everything else including battery, camera, etc.)
        productSpecs.push({
          key: item.name,
          value: item.value
        });
      }
    });

    // Process images - limit to first 5 only
    const images = data.images
      ? data.images.slice(0, 5).map((img, i) => ({
          image_url: img.href,
          is_main: i === 0,
        }))
      : [];

    return {
      // Product level data
      name: data.name || "",
      brand: data.manufacturer || "",
      shortDescription: data.shortDescription || shortDescFallback,
      longDescription: longDescriptionRaw,
      sku: data.sku,
      productSpecs,

      // Variant level data
      variantInfo,
      variantSpecs,
      images,
    };
  }

  // Save product with variant to Supabase
  static async saveProductWithVariant({
    productData,
    variantData,
    localizationData,
    productSpecs,
    variantSpecs,
    images,
    availability,
  }) {
    // Check if product already exists by category and base name
    let product_id;
    const baseProductName = localizationData.name.split(' - ')[0]; // Remove variant specific parts

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("category", productData.category)
      .eq("slug", productData.slug)
      .single();

    if (existingProduct) {
      product_id = existingProduct.id;
    } else {
      // Insert main product
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          slug: productData.slug,
          status: productData.status,
          category: productData.category,
        })
        .select("id")
        .single();

      if (productError) throw productError;
      product_id = newProduct.id;

      // Insert product-level specifications
      if (productSpecs.length > 0) {
        const productSpecsToInsert = productSpecs.map((spec) => ({
          product_id,
          ...spec,
        }));

        const { error: productSpecError } = await supabase
          .from("product_specifications")
          .insert(productSpecsToInsert);

        if (productSpecError) throw productSpecError;
      }

      // Insert product availability
      const availabilityToInsert = availability.map((av) => ({
        product_id,
        ...av,
      }));

      const { error: availabilityError } = await supabase
        .from("product_availability")
        .insert(availabilityToInsert);

      if (availabilityError) throw availabilityError;
    }

    // Insert product variant
    const { data: newVariant, error: variantError } = await supabase
      .from("product_variants")
      .insert({
        product_id,
        storage: variantData.storage,
        ram: variantData.ram,
        color: variantData.color,
        sku: variantData.sku,
        slug: variantData.slug,
        status: variantData.status,
      })
      .select("id")
      .single();

    if (variantError) throw variantError;
    const variant_id = newVariant.id;

    // Insert variant localization
    const variantLocalizationToInsert = {
      product_variant_id: variant_id,
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
      .from("product_variant_localizations")
      .insert(variantLocalizationToInsert);

    if (localizationError) throw localizationError;

    // Insert variant specifications
    if (variantSpecs.length > 0) {
      const variantSpecsToInsert = variantSpecs.map((spec) => ({
        product_variant_id: variant_id,
        ...spec,
      }));

      const { error: variantSpecError } = await supabase
        .from("product_variant_specifications")
        .insert(variantSpecsToInsert);

      if (variantSpecError) throw variantSpecError;
    }

    // Insert variant images
    const imagesToInsert = images.map((img) => ({ 
      product_variant_id: variant_id, 
      ...img 
    }));

    const { error: imageError } = await supabase
      .from("product_variant_images")
      .insert(imagesToInsert);

    if (imageError) throw imageError;

    

    return { product_id, variant_id };
  }

  // Get all products with their variants for listing
  static async getAllProductsWithVariants() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        status,
        category,
        created_at,
        product_variants (
          id,
          sku,
          slug,
          color,
          storage,
          ram,
          status,
          created_at,
          product_variant_localizations (
            name,
            brand,
            short_description,
            country,
            language
          ),
          product_variant_images (
            image_url,
            is_main
          ),
          product_prices (
            price,
            currency,
            store_name,
            country
          )
        ),
        product_availability (
          country
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Delete product variant and clean up if no more variants exist
  static async deleteProductVariant(variantId) {
    // First get the product_id for this variant
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('product_id')
      .eq('id', variantId)
      .single();

    if (variantError) throw variantError;

    const productId = variant.product_id;

    // Delete all variant-related data
    const deletePromises = [
      supabase.from('product_variant_localizations').delete().eq('product_variant_id', variantId),
      supabase.from('product_variant_images').delete().eq('product_variant_id', variantId),
      supabase.from('product_variant_specifications').delete().eq('product_variant_id', variantId),
      supabase.from('product_prices').delete().eq('product_variant_id', variantId)
    ];

    const deleteResults = await Promise.all(deletePromises);
    const hasError = deleteResults.some(result => result.error);
    if (hasError) {
      const errors = deleteResults.filter(result => result.error).map(result => result.error.message);
      throw new Error(`Failed to delete variant data: ${errors.join(', ')}`);
    }

    // Delete the variant
    const { error: deleteVariantError } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId);

    if (deleteVariantError) throw deleteVariantError;

    // Check if this was the last variant for this product
    const { data: remainingVariants, error: checkError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId);

    if (checkError) throw checkError;

    // If no more variants, delete the product and its related data
    if (remainingVariants.length === 0) {
      const productDeletePromises = [
        supabase.from('product_specifications').delete().eq('product_id', productId),
        supabase.from('product_availability').delete().eq('product_id', productId)
      ];

      const productDeleteResults = await Promise.all(productDeletePromises);
      const hasProductError = productDeleteResults.some(result => result.error);
      if (hasProductError) {
        const errors = productDeleteResults.filter(result => result.error).map(result => result.error.message);
        throw new Error(`Failed to delete product data: ${errors.join(', ')}`);
      }

      // Delete the product
      const { error: deleteProductError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteProductError) throw deleteProductError;
    }

    return { productId, deletedProduct: remainingVariants.length === 0 };
  }

  static async addPrice(priceData) {
    try {
      const { error } = await supabase
        .from("product_prices")
        .insert({
          product_variant_id: priceData.product_variant_id,
          store_name: priceData.store_name,
          country: priceData.country,
          price: priceData.price,
          currency: priceData.currency,
          affiliate_link: priceData.affiliate_link,
        });

      if (error) throw error;

      return { message: "Price added successfully!" };
    } catch (error) {
      console.error("Error adding price:", error);
      throw new Error(`Failed to add price: ${error.message}`);
    }
  }
}