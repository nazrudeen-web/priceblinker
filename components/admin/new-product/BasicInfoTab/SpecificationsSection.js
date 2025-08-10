
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function SpecificationsSection({
  specifications,
  setSpecifications,
  newSpec,
  setNewSpec,
}) {
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

  return (
    <div className="space-y-4">
      <Label className="text-gray-300">
        Specifications (product_specifications table)
      </Label>
      
      {/* Add New Specification */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Specification name (e.g., RAM)"
          value={newSpec.key}
          onChange={(e) =>
            setNewSpec((prev) => ({ ...prev, key: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Value (e.g., 8GB)"
            value={newSpec.value}
            onChange={(e) =>
              setNewSpec((prev) => ({ ...prev, value: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button
            onClick={handleAddSpecification}
            className="bg-white text-black hover:bg-gray-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Display Existing Specifications */}
      {specifications.length > 0 && (
        <div className="space-y-2">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 p-3 rounded"
            >
              <span className="text-white">
                <strong>{spec.key}:</strong> {spec.value}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSpecification(index)}
                className="text-red-400 hover:text-red-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
