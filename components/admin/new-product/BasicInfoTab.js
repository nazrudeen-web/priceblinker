import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Import sub-components
import ApiUrlSection from "./BasicInfoTab/ApiUrlSection";
import ProductSlugSection from "./BasicInfoTab/ProductSlugSection";
import LocalizationSection from "./BasicInfoTab/LocalizationSection";
import ProductDetailsSection from "./BasicInfoTab/ProductDetailsSection";
import VariantDetailsSection from "./BasicInfoTab/VariantDetailsSection";
import DescriptionsSection from "./BasicInfoTab/DescriptionsSection";
import SpecificationsSection from "./BasicInfoTab/SpecificationsSection";
import AddVariantModal from "./BasicInfoTab/AddVariantModal";
import { ProductService } from "@/services/productService";


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

  handleNameChange,
  fetchedData,
  sku,
  setSku,
  isFetching,
  handleFetchProductData,
}) {
  const [newProductSpec, setNewProductSpec] = useState({ key: "", value: "" });
  const [newVariantSpec, setNewVariantSpec] = useState({ key: "", value: "" });
  const [showAddVariant, setShowAddVariant] = useState(false);

  const handleAddNewVariant = async (variantSku) => {
    // Use the same fetch logic but only update variant-specific data
    try {
      const data = await ProductService.fetchBestBuyProduct(variantSku);
      const processed = ProductService.processFetchedData(data);

      // Create variant name with storage/color info
      const variantParts = [];
      if (processed.variantInfo.storage) variantParts.push(processed.variantInfo.storage);
      if (processed.variantInfo.color) variantParts.push(processed.variantInfo.color);

      const variantName = variantParts.length > 0
        ? `${processed.name} - ${variantParts.join(' ')}`
        : processed.name;

      const variantSlug = generateSlug(variantName, true);

      // Only update variant-specific data
      setVariantData((prev) => ({
        ...prev,
        sku: processed.sku,
        slug: variantSlug,
        color: processed.variantInfo.color,
        storage: processed.variantInfo.storage,
        ram: processed.variantInfo.ram,
      }));

      // Update localization with new variant name
      setLocalizationData((prev) => ({
        ...prev,
        name: variantName,
        canonical_url: `https://priceblinker.com/products/${variantSlug}`,
      }));

      setVariantSpecs(processed.variantSpecs);
      // Assuming setImages is a function available in the scope or passed down
      // If setImages is intended to update the images in variantData, it should be handled there.
      // For now, assuming it's a placeholder or meant to be handled within VariantDetailsSection or its parent.
      // If ProductService.processFetchedData returns images, and you want to update state:
      // setVariantData(prev => ({ ...prev, images: processed.images.slice(0, 5) }));


      setShowAddVariant(false);

    } catch (error) {
      console.error("Error fetching variant data:", error);
    }
  };

  const generateSlug = (name, isVariant = false) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!isVariant) {
      return baseSlug;
    }

    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

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
          <CardTitle className="text-lg text-white flex items-center justify-between">
            Fetch Product Data
            <Button
              onClick={() => setShowAddVariant(true)}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
            >
              Add New Variant
            </Button>
          </CardTitle>
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

      {/* Add New Variant Modal */}
      {showAddVariant && (
        <AddVariantModal
          isOpen={showAddVariant}
          onClose={() => setShowAddVariant(false)}
          onAddVariant={handleAddNewVariant}
        />
      )}

      {/* Sub-tabs for organization */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="basic" className="data-[state=active]:bg-gray-700 text-sm">
            Basic
          </TabsTrigger>
          <TabsTrigger value="variant" className="data-[state=active]:bg-gray-700 text-sm">
            Variant
          </TabsTrigger>
          <TabsTrigger value="specs" className="data-[state=active]:bg-gray-700 text-sm">
            Specs
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
                  onAddVariant={handleAddNewVariant}
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
      </Tabs>
    </div>
  );
}