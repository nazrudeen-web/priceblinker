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
  fetchedData,
  sku,
  setSku,
  isFetching,
  handleFetchProductData,
}) {
  // Local state for adding new specifications
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

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
          handleFetch={handleFetchProductData}
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