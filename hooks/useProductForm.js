
import { useState } from "react";
import { ProductService } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";

export function useProductForm() {
  const { toast } = useToast();
  
  // Product level data
  const [productData, setProductData] = useState({ 
    slug: "", 
    status: "active", 
    category: "smartphones" 
  });
  
  // Variant level data
  const [variantData, setVariantData] = useState({
    sku: "",
    slug: "",
    color: "",
    storage: "",
    ram: "",
    status: "active"
  });
  
  // Localization data (now for variants)
  const [localizationData, setLocalizationData] = useState({
    country: "PH",
    language: "en",
    name: "",
    brand: "",
    short_description: "",
    long_description: "",
    meta_title: "",
    meta_description: "",
    canonical_url: "",
  });
  
  // Specifications (separate for product and variant)
  const [productSpecs, setProductSpecs] = useState([]);
  const [variantSpecs, setVariantSpecs] = useState([]);
  const [images, setImages] = useState([]);
  const [availability, setAvailability] = useState([{ country: "PH" }]);
  const [prices, setPrices] = useState([]);
  
  // Form states
  const [fetchedData, setFetchedData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sku, setSku] = useState("");

  const generateSlug = (name, isVariant = false) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (!isVariant) {
      // For product slugs, keep them simpler
      return baseSlug;
    }
    
    // For variant slugs, add timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

  const handleNameChange = (name, short_description) => {
    // Generate both product and variant slugs
    const productSlug = generateSlug(name.split(' - ')[0]); // Base product name
    const variantSlug = generateSlug(name, true); // Full variant name
    
    setLocalizationData((prev) => {
      const newMetaTitle = prev.meta_title || `${name} - Best Prices in Philippines`;
      const newMetaDescription = prev.meta_description || `${short_description || ""} - Best Prices in Philippines`;
      const newCanonicalUrl = prev.canonical_url || `https://priceblinker.com/products/${variantSlug}`;

      return {
        ...prev,
        name,
        short_description,
        meta_title: newMetaTitle,
        meta_description: newMetaDescription,
        canonical_url: newCanonicalUrl,
      };
    });

    // Update both product and variant slugs
    setProductData((prev) => ({ ...prev, slug: productSlug }));
    setVariantData((prev) => ({ ...prev, slug: variantSlug }));
  };

  const handleCountryToggle = (countryCode) => {
    setAvailability((prev) => {
      const exists = prev.some((item) => item.country === countryCode);
      if (exists) {
        return prev.filter((item) => item.country !== countryCode);
      } else {
        return [...prev, { country: countryCode }];
      }
    });
  };

  const handleFetchProductData = async () => {
    if (!sku) {
      toast({
        title: "Error",
        description: "Please enter SKU",
        variant: "destructive",
      });
      return;
    }

    setIsFetching(true);
    setFetchedData(null);

    try {
      const data = await ProductService.fetchBestBuyProduct(sku);
      setFetchedData(data);

      const processed = ProductService.processFetchedData(data);
      
      // Create full product name including variant info
      const variantParts = [];
      if (processed.variantInfo.storage) variantParts.push(processed.variantInfo.storage);
      if (processed.variantInfo.color) variantParts.push(processed.variantInfo.color);
      
      const fullName = variantParts.length > 0 
        ? `${processed.name} - ${variantParts.join(' ')}`
        : processed.name;

      const productSlug = generateSlug(processed.name);
      const variantSlug = generateSlug(fullName, true);

      // Update all data at once
      setLocalizationData((prev) => ({
        ...prev,
        name: fullName,
        short_description: processed.shortDescription,
        brand: processed.brand,
        long_description: processed.longDescription,
        meta_title: `${fullName} - Best Prices in Philippines`,
        meta_description: `${processed.shortDescription} - Best Prices in Philippines`,
        canonical_url: `https://priceblinker.com/products/${variantSlug}`,
      }));

      setProductData((prev) => ({ 
        ...prev, 
        slug: productSlug 
      }));
      
      setVariantData((prev) => ({
        ...prev,
        sku: processed.sku,
        slug: variantSlug,
        color: processed.variantInfo.color,
        storage: processed.variantInfo.storage,
        ram: processed.variantInfo.ram,
      }));

      setProductSpecs(processed.productSpecs);
      setVariantSpecs(processed.variantSpecs);
      setImages(processed.images);

      toast({
        title: "Success",
        description: "Product data fetched successfully!",
      });

    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Error fetching product: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async (status) => {
    setIsSaving(true);
    
    try {
      // Validation
      if (!localizationData.name || !variantData.sku) {
        throw new Error("Product name and SKU are required");
      }

      const dataToSave = {
        productData: {
          ...productData,
          status,
        },
        variantData: {
          ...variantData,
          status,
        },
        localizationData,
        productSpecs,
        variantSpecs,
        images,
        availability,
        prices,
      };

      const result = await ProductService.saveProductWithVariant(dataToSave);
      
      toast({
        title: "Success",
        description: `Product variant ${status === "active" ? "published" : "saved as draft"} successfully!`,
      });

      // Reset form after successful save
      resetForm();
      
      console.log("Product variant saved successfully!", result);
    } catch (error) {
      console.error("Error saving product variant:", error.message);
      toast({
        title: "Error",
        description: "Failed to save product variant: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setProductData({ slug: "", status: "active", category: "smartphones" });
    setVariantData({
      sku: "",
      slug: "",
      color: "",
      storage: "",
      ram: "",
      status: "active"
    });
    setLocalizationData({
      country: "PH",
      language: "en",
      name: "",
      brand: "",
      short_description: "",
      long_description: "",
      meta_title: "",
      meta_description: "",
      canonical_url: "",
    });
    setProductSpecs([]);
    setVariantSpecs([]);
    setImages([]);
    setAvailability([{ country: "PH" }]);
    setPrices([]);
    setFetchedData(null);
    setSku("");
  };

  return {
    // State
    productData,
    setProductData,
    variantData,
    setVariantData,
    localizationData,
    setLocalizationData,
    productSpecs,
    setProductSpecs,
    variantSpecs,
    setVariantSpecs,
    images,
    setImages,
    availability,
    prices,
    setPrices,
    fetchedData,
    isFetching,
    isSaving,
    sku,
    setSku,
    
    // Handlers
    handleNameChange,
    handleCountryToggle,
    handleFetchProductData,
    handleSave,
    resetForm,
  };
}
