
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
import VariantDetailsSection from "./BasicInfoTab/VariantDetailsSection";
import DescriptionsSection from "./BasicInfoTab/DescriptionsSection";
import SpecificationsSection from "./BasicInfoTab/SpecificationsSection";
import PricingSection from "./BasicInfoTab/PricingSection";

export default function BasicInfoTab({
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
  prices,
  setPrices,
  handleNameChange,
  fetchedData,
  sku,
  setSku,
  isFetching,
  handleFetchProductData,
}) {
  // Local state for adding new specifications
  const [newProductSpec, setNewProductSpec] = useState({ key: "", value: "" });
  const [newVariantSpec, setNewVariantSpec] = useState({ key: "", value: "" });

  // Function to add a new product specification
  const handleAddProductSpecification = () => {
    if (newProductSpec.key && newProductSpec.value) {
      setProductSpecs((prev) => [
        ...prev,
        { key: newProductSpec.key, value: newProductSpec.value },
      ]);
      setNewProductSpec({ key: "", value: "" });
    }
  };

  // Function to add a new variant specification
  const handleAddVariantSpecification = () => {
    if (newVariantSpec.key && newVariantSpec.value) {
      setVariantSpecs((prev) => [
        ...prev,
        { key: newVariantSpec.key, value: newVariantSpec.value },
      ]);
      setNewVariantSpec({ key: "", value: "" });
    }
  };

  // Function to remove specifications
  const handleRemoveProductSpecification = (index) => {
    setProductSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVariantSpecification = (index) => {
    setVariantSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const availableCountries = [{ code: "PH", name: "Philippines" }];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Product Variant Information</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the product details and variant-specific information including color, storage, and RAM.
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
          variantData={variantData}
          setVariantData={setVariantData}
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
          productData={productData}
          setProductData={setProductData}
          localizationData={localizationData}
          setLocalizationData={setLocalizationData}
          handleNameChange={handleNameChange}
        />

        <Separator className="bg-gray-800" />

        {/* Variant Details (Color, Storage, RAM, SKU) */}
        <VariantDetailsSection
          variantData={variantData}
          setVariantData={setVariantData}
        />

        {/* Descriptions */}
        <DescriptionsSection
          localizationData={localizationData}
          setLocalizationData={setLocalizationData}
        />

        <Separator className="bg-gray-800" />

        {/* Product-Level Specifications */}
        <SpecificationsSection
          title="Product Specifications"
          description="Specifications that apply to all variants of this product"
          specifications={productSpecs}
          setSpecifications={setProductSpecs}
          newSpec={newProductSpec}
          setNewSpec={setNewProductSpec}
          handleAddSpecification={handleAddProductSpecification}
          handleRemoveSpecification={handleRemoveProductSpecification}
        />

        <Separator className="bg-gray-800" />

        {/* Variant-Level Specifications */}
        <SpecificationsSection
          title="Variant Specifications"
          description="Specifications specific to this variant (color, storage, etc.)"
          specifications={variantSpecs}
          setSpecifications={setVariantSpecs}
          newSpec={newVariantSpec}
          setNewSpec={setNewVariantSpec}
          handleAddSpecification={handleAddVariantSpecification}
          handleRemoveSpecification={handleRemoveVariantSpecification}
        />

        <Separator className="bg-gray-800" />

        {/* Pricing Section */}
        <PricingSection
          prices={prices}
          setPrices={setPrices}
        />
      </CardContent>
    </Card>
  );
}
