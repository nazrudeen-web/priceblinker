// / components/product/BasicInfoTab.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Import sub-components
import ApiUrlSection from "./BasicInfoTab/ApiUrlSection";
import ProductSlugSection from "./BasicInfoTab/ProductSlugSection";
import LocalizationSection from "./BasicInfoTab/LocalizationSection";
import ProductDetailsSection from "./BasicInfoTab/ProductDetailsSection";
import DescriptionsSection from "./BasicInfoTab/DescriptionsSection";
import SpecificationsSection from "./BasicInfoTab/SpecificationsSection";

export default function BasicInfoTab({
  productData,
  setProductData,
  localizationData,
  setLocalizationData,
  specifications,
  setSpecifications,
  handleNameChange,
  setFetchedData,
  fetchedData,
}) {
  // Local state for adding new specifications
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [sku, setSku] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // Function to add a new specification
  const handleAddSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setSpecifications((prev) => [
        ...prev,
        { key: newSpec.key, value: newSpec.value },
      ]);
      setNewSpec({ key: "", value: "" });
    }
  };

  // Function to remove a specification by index
  const handleRemoveSpecification = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Words/phrases to remove from values
  // Patterns to remove globally
  const removePatterns = [
    /\(unlocked\)/gi, // remove "(Unlocked)"
    /\bunlocked\b/gi, // remove "Unlocked"
    /\bunited states\b/gi, // remove "United States"
  ];

  // Function to clean strings recursively in any object/array
  const cleanData = (obj) => {
    if (typeof obj === "string") {
      let cleaned = obj;
      removePatterns.forEach((pattern) => {
        cleaned = cleaned.replace(pattern, "").trim();
      });
      return cleaned.replace(/\s{2,}/g, " "); // remove extra spaces
    } else if (Array.isArray(obj)) {
      return obj.map((item) => cleanData(item));
    } else if (obj && typeof obj === "object") {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = cleanData(obj[key]);
      }
      return newObj;
    }
    return obj;
  };
  const excludeKeywords = [
    "model number",
    "carrier",
    "carrier compatibility",
    "unlocked",
  ];
  const handleFetch = async () => {
    if (!sku) {
      alert("Please enter SKU");
      return;
    }

    console.log("Fetching SKU:", sku);
    setIsFetching(true);
    setFetchedData(null); // reset previous data

    try {
      const apiKey = process.env.NEXT_PUBLIC_BESTBUY_KEY;
      const res = await fetch(
        `https://api.bestbuy.com/v1/products/${sku}.json?apiKey=${apiKey}&format=json&show=sku,name,manufacturer,modelNumber,shortDescription,longDescription,color,details.name,details.value,features.feature,includedItemList.includedItem,images,url`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      let data = await res.json();

      console.log("Data fetched:", data);

      data = cleanData(data);
      setFetchedData(data);

      const featuresText =
        data.features
          ?.map((item) => item.feature)
          .filter(Boolean)
          .join(". ") || "";

      const longDescriptionRaw = [data.longDescription, featuresText]
        .filter(Boolean)
        .join(". ")
        .trim();

      const shortDescFallback =
        longDescriptionRaw.split(". ").slice(0, 3).join(". ") + ".";

      setLocalizationData((prev) => ({
        ...prev,
        // name: data.name || "",
        brand: data.manufacturer || "",
        long_description: longDescriptionRaw,
      }));
      handleNameChange(
        data.name || "",
        data.shortDescription || shortDescFallback
      );
      // Fill specs from details
      if (data.details) {
        const detailsMapped = data.details
          .filter((item) => {
            const nameLower = (item.name || "").toLowerCase();

            // Check excludeKeywords in lowercase
            if (
              excludeKeywords.some((keyword) => nameLower.includes(keyword))
            ) {
              return false;
            }

            // Skip if key is empty or value is empty
            if (!item.name || item.name.trim() === "") return false;
            if (!item.value || item.value.trim() === "") return false;

            return true;
          })
          .map((item) => {
            let cleanValue = item.value || "";
            removePatterns.forEach((pattern) => {
              cleanValue = cleanValue.replace(pattern, "").trim();
            });
            return {
              key: item.name || "",
              value: cleanValue.replace(/\s{2,}/g, " "),
            };
          });

        setSpecifications(detailsMapped);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product: " + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const availableCountries = [{ code: "PH", name: "Philippines" }];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Product Information</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the basic details about the product and its localization.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* API URL Section */}
        <ApiUrlSection
          sku={sku}
          setSku={setSku}
          isFetching={isFetching}
          setIsFetching={setIsFetching}
          setFetchedData={setFetchedData}
          setLocalizationData={setLocalizationData}
          setSpecifications={setSpecifications}
          handleNameChange={handleNameChange}
          handleFetch={handleFetch}
        />

        <Separator className="bg-gray-800" />

        {/* Product Slug Section */}
        <ProductSlugSection
          productData={productData}
          setProductData={setProductData}
        />

        <Separator className="bg-gray-800" />

        {/* Country and Language Selection */}
        <LocalizationSection
          localizationData={localizationData}
          setLocalizationData={setLocalizationData}
          availableCountries={availableCountries}
        />

        {/* Product Name, Brand, and Category */}
        <ProductDetailsSection
          localizationData={localizationData}
          setLocalizationData={setLocalizationData}
          handleNameChange={handleNameChange}
        />

        {/* Descriptions */}
        <DescriptionsSection
          localizationData={localizationData}
          setLocalizationData={setLocalizationData}
        />

        <Separator className="bg-gray-800" />

        {/* Specifications Section */}
        <SpecificationsSection
          specifications={specifications}
          setSpecifications={setSpecifications}
          newSpec={newSpec}
          setNewSpec={setNewSpec}
          handleAddSpecification={handleAddSpecification}
          handleRemoveSpecification={handleRemoveSpecification}
        />
      </CardContent>
    </Card>
  );
}