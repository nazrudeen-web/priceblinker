import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

export default function SpecificationsSection({
  title = "Specifications",
  description = "Add product specifications",
  specifications,
  setSpecifications,
  newSpec,
  setNewSpec,
  handleAddSpecification,
  handleRemoveSpecification,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
      </div>

      {/* Add New Specification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Specification name"
          value={newSpec.key}
          onChange={(e) => setNewSpec((prev) => ({ ...prev, key: e.target.value }))}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input
          placeholder="Specification value"
          value={newSpec.value}
          onChange={(e) => setNewSpec((prev) => ({ ...prev, value: e.target.value }))}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Button
          onClick={handleAddSpecification}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!newSpec.key || !newSpec.value}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Spec
        </Button>
      </div>

      {/* Current Specifications */}
      {specifications.length > 0 && (
        <div className="space-y-2">
          <Label className="text-gray-300">Current {title}</Label>
          <div className="flex flex-wrap gap-2">
            {specifications.map((spec, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-700 text-gray-300 border-gray-600 pr-1"
              >
                <span className="mr-2">
                  <strong>{spec.key}:</strong> {spec.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-gray-400 hover:text-red-400"
                  onClick={() => handleRemoveSpecification(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}