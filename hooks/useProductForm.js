
import { useState } from "react";
import { ProductService } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";

export function useProductForm() {
  const { toast } = useToast();
  const [productData, setProductData] = useState({ slug: "", status: "draft" });
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
    category: "smartphones",
  });
  const [specifications, setSpecifications] = useState([]);
  const [images, setImages] = useState([]);
  const [availability, setAvailability] = useState([{ country: "PH" }]);
  const [fetchedData, setFetchedData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sku, setSku] = useState("");

  const generateSlug = (name) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    
    // Add timestamp suffix to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

  const handleNameChange = (name, short_description) => {
    const newSlug = generateSlug(name);
    
    setLocalizationData((prev) => {
      const newMetaTitle =
        prev.meta_title || `${name} - Best Prices in Philippines`;
      const newMetaDescription =
        prev.meta_description ||
        `${short_description || ""} - Best Prices in Philippines`;
      const newCanonicalUrl = 
        prev.canonical_url || `https://priceblinker.com/products/${newSlug}`;

      return {
        ...prev,
        name,
        short_description,
        meta_title: newMetaTitle,
        meta_description: newMetaDescription,
        canonical_url: newCanonicalUrl,
      };
    });

    if (!productData.slug) {
      setProductData((prev) => ({ ...prev, slug: newSlug }));
    }
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
      alert("Please enter SKU");
      return;
    }

    setIsFetching(true);
    setFetchedData(null);

    try {
      const data = await ProductService.fetchBestBuyProduct(sku);
      setFetchedData(data);

      const processed = ProductService.processFetchedData(data);
      const generatedSlug = generateSlug(processed.name);

      // Update all data at once to ensure consistency
      setLocalizationData((prev) => {
        const newMetaTitle = `${processed.name} - Best Prices in Philippines`;
        const newMetaDescription = `${processed.shortDescription || ""} - Best Prices in Philippines`;
        const newCanonicalUrl = `https://priceblinker.com/products/${generatedSlug}`;

        return {
          ...prev,
          name: processed.name,
          short_description: processed.shortDescription,
          brand: processed.brand,
          long_description: processed.longDescription,
          meta_title: newMetaTitle,
          meta_description: newMetaDescription,
          canonical_url: newCanonicalUrl,
        };
      });

      setProductData((prev) => ({ ...prev, slug: generatedSlug }));
      setSpecifications(processed.specifications);
      setImages((prev) => [...prev, ...processed.images]);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product: " + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const resetForm = () => {
    setProductData({ slug: "", status: "draft" });
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
      category: "smartphones",
    });
    setSpecifications([]);
    setImages([]);
    setAvailability([{ country: "PH" }]);
    setFetchedData(null);
    setSku("");
  };

  const handleSave = async (status) => {
    if (!localizationData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await ProductService.saveProduct({
        productData: { ...productData, status },
        localizationData,
        specifications,
        images,
        availability,
      });

      toast({
        title: "Success!",
        description: `Product ${status === "published" ? "published" : "saved as draft"} successfully`,
      });

      // Reset form after successful save
      resetForm();
      
      console.log("Product saved successfully!", result);
    } catch (error) {
      console.error("Error saving product:", error.message);
      toast({
        title: "Error",
        description: "Failed to save product: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    productData,
    setProductData,
    localizationData,
    setLocalizationData,
    specifications,
    setSpecifications,
    images,
    setImages,
    availability,
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
