"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, Package, Store, DollarSign, Activity } from "lucide-react";

const stats = [
  { title: "Total Products", value: "1,247", change: "+12%", icon: Package },
  { title: "Total Stores", value: "24", change: "+3%", icon: Store },
  // { title: "Price Entries", value: "8,456", change: "+18%", icon: DollarSign },
  // { title: "Activity Today", value: "156", change: "+5%", icon: Activity },
];

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>{stat.change}</span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
