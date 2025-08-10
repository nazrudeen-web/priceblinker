
import { useState } from "react";
import { ProductService } from "@/services/productService";

export function useProductForm() {
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
  const [sku, setSku] = useState("");

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name, short_description) => {
    setLocalizationData((prev) => {
      const newMetaTitle =
        prev.meta_title || `${name} - Best Prices in Philippines`;
      const newMetaDescription =
        prev.meta_description ||
        `${short_description || ""} - Best Prices in Philippines`;

      return {
        ...prev,
        name,
        short_description,
        meta_title: newMetaTitle,
        meta_description: newMetaDescription,
      };
    });

    if (!productData.slug) {
      setProductData((prev) => ({ ...prev, slug: generateSlug(name) }));
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

      setLocalizationData((prev) => ({
        ...prev,
        brand: processed.brand,
        long_description: processed.longDescription,
      }));

      handleNameChange(processed.name, processed.shortDescription);
      setSpecifications(processed.specifications);
      setImages((prev) => [...prev, ...processed.images]);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product: " + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async (status) => {
    try {
      const result = await ProductService.saveProduct({
        productData: { ...productData, status },
        localizationData,
        specifications,
        images,
        availability,
      });

      console.log("Product saved successfully!", result);
    } catch (error) {
      console.error("Error saving product:", error.message);
      alert("Error saving product: " + error.message);
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
    sku,
    setSku,
    
    // Handlers
    handleNameChange,
    handleCountryToggle,
    handleFetchProductData,
    handleSave,
  };
}
