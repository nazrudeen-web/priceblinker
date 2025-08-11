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
import { Package, Store, DollarSign, Plus } from "lucide-react"; // Added Plus icon
import Link from "next/link"; // Added Link

const quickActions = [
  {
    title: "Add Product",
    description: "Add a new product variant",
    icon: Package,
    href: "/admin/products/new-product",
  },
  {
    title: "Add Price",
    description: "Add price for existing product",
    icon: DollarSign,
    href: "/admin/prices/add",
  },
  {
    title: "Manage Products",
    description: "View and edit all products",
    icon: Store,
    href: "/admin/products",
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
          {quickActions.map((action, index) => {
            // Special styling for "Add Price"
            if (action.title === "Add Price") {
              return (
                <Link href={action.href} className="block" key={index}>
                  <Button className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    {action.title}
                  </Button>
                </Link>
              );
            }
            // Default styling for other actions
            return (
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}