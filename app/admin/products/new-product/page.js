"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Eye,
  ArrowLeft,
  Globe,
  FileText,
  Settings,
  Image,
} from "lucide-react";
import Link from "next/link";
import BasicInfoTab from "@/components/admin/new-product/BasicInfoTab";
import SEOTab from "@/components/admin/new-product/SEOTab";
import ImagesTab from "@/components/admin/new-product/ImagesTab";
import AvailabilityTab from "@/components/admin/new-product/AvailabilityTab";
import { useProductForm } from "@/hooks/useProductForm";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

export default function NewProductPage() {
  const {
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
    handleNameChange,
    handleCountryToggle,
    handleFetchProductData,
    handleSave,
    resetForm,
  } = useProductForm();

  // Props object for child components
  const sharedProps = {
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
    handleCountryToggle,
    fetchedData,
    sku,
    setSku,
    isFetching,
    isSaving,
    handleFetchProductData,
    handleNameChange,
    resetForm,
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Add New Product Variant
            </h1>
            <p className="text-gray-400">
              Create a new product variant for price comparison
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-200 cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSave("active")}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Publish"
            )}
            {/* {!isSaving && "Publish"} */}
          </Button>
        </div>
      </div>

      {/* Tabs for Product Information */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Image className="mr-2 h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Globe className="mr-2 h-4 w-4" />
            Availability
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="basic" className="space-y-4">
          <BasicInfoTab {...sharedProps} />
        </TabsContent>
        <TabsContent value="seo" className="space-y-4">
          <SEOTab
            localizationData={localizationData}
            setLocalizationData={setLocalizationData}
          />
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <ImagesTab
            images={images}
            setImages={setImages}
            fetchedImages={fetchedData?.images?.map((img) => img.href) || []}
          />
        </TabsContent>
        <TabsContent value="availability" className="space-y-4">
          <AvailabilityTab
            availability={availability}
            handleCountryToggle={handleCountryToggle}
          />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}