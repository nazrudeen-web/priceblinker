// components/admin/quick-actions.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Package, Store, DollarSign } from "lucide-react";

const quickActions = [
  {
    title: "Add Product",
    description: "Add a new product to track",
    icon: Package,
    href: "/admin/products/new",
  },
  {
    title: "Add Store",
    description: "Register a new store",
    icon: Store,
    href: "/admin/stores/new",
  },
  {
    title: "Add Price",
    description: "Add price for existing product",
    icon: DollarSign,
    href: "/admin/prices/new",
  },
];

export default function QuickActions() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-400">
          Common tasks you might want to perform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
            >
              <action.icon className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-gray-500">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
