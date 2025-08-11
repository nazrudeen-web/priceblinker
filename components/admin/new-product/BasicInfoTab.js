

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [newProductSpec, setNewProductSpec] = useState({ key: "", value: "" });
  const [newVariantSpec, setNewVariantSpec] = useState({ key: "", value: "" });

  const handleAddProductSpecification = () => {
    if (newProductSpec.key && newProductSpec.value) {
      setProductSpecs((prev) => [
        ...prev,
        { key: newProductSpec.key, value: newProductSpec.value },
      ]);
      setNewProductSpec({ key: "", value: "" });
    }
  };

  const handleAddVariantSpecification = () => {
    if (newVariantSpec.key && newVariantSpec.value) {
      setVariantSpecs((prev) => [
        ...prev,
        { key: newVariantSpec.key, value: newVariantSpec.value },
      ]);
      setNewVariantSpec({ key: "", value: "" });
    }
  };

  const handleRemoveProductSpecification = (index) => {
    setProductSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVariantSpecification = (index) => {
    setVariantSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const availableCountries = [{ code: "PH", name: "Philippines" }];

  return (
    <div className="space-y-4">
      {/* API Fetch Section - Compact */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Fetch Product Data</CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Enter SKU to automatically populate product information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiUrlSection
            sku={sku}
            setSku={setSku}
            isFetching={isFetching}
            handleFetch={handleFetchProductData}
          />
        </CardContent>
      </Card>

      {/* Sub-tabs for organization */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="basic" className="data-[state=active]:bg-gray-700 text-sm">
            Basic
          </TabsTrigger>
          <TabsTrigger value="variant" className="data-[state=active]:bg-gray-700 text-sm">
            Variant
          </TabsTrigger>
          <TabsTrigger value="specs" className="data-[state=active]:bg-gray-700 text-sm">
            Specs
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-gray-700 text-sm">
            Pricing
          </TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Product Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocalizationSection
                  localizationData={localizationData}
                  setLocalizationData={setLocalizationData}
                  availableCountries={availableCountries}
                />
                <ProductDetailsSection
                  productData={productData}
                  setProductData={setProductData}
                  localizationData={localizationData}
                  setLocalizationData={setLocalizationData}
                  handleNameChange={handleNameChange}
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">URLs & Slugs</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSlugSection
                  productData={productData}
                  setProductData={setProductData}
                  variantData={variantData}
                  setVariantData={setVariantData}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Descriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionsSection
                localizationData={localizationData}
                setLocalizationData={setLocalizationData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variant Details */}
        <TabsContent value="variant" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Variant Details</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Color, storage, RAM, and other variant-specific information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VariantDetailsSection
                variantData={variantData}
                setVariantData={setVariantData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specifications */}
        <TabsContent value="specs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Product Specs</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Specifications shared across all variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpecificationsSection
                  title=""
                  description=""
                  specifications={productSpecs}
                  setSpecifications={setProductSpecs}
                  newSpec={newProductSpec}
                  setNewSpec={setNewProductSpec}
                  handleAddSpecification={handleAddProductSpecification}
                  handleRemoveSpecification={handleRemoveProductSpecification}
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Variant Specs</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Specifications unique to this variant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpecificationsSection
                  title=""
                  description=""
                  specifications={variantSpecs}
                  setSpecifications={setVariantSpecs}
                  newSpec={newVariantSpec}
                  setNewSpec={setNewVariantSpec}
                  handleAddSpecification={handleAddVariantSpecification}
                  handleRemoveSpecification={handleRemoveVariantSpecification}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Initial Pricing</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Add initial prices for this variant (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PricingSection
                prices={prices}
                setPrices={setPrices}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

