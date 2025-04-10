
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, Apple, MessageSquare, Replace } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://sdmntpreastus2.oaiusercontent.com/files/00000000-0d7c-61f6-a76a-7adf6bff0704/raw?se=2025-04-10T18%3A40%3A40Z&sp=r&sv=2024-08-04&sr=b&scid=ce4a17e9-31a1-5c83-a799-9a5052ea48e3&skoid=ac1d63ad-0c69-4017-8785-7a50eb04382c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-09T21%3A04%3A54Z&ske=2025-04-10T21%3A04%3A54Z&sks=b&skv=2024-08-04&sig=nL5tDK%2BXFJiNHxomfZB6osFUmiw5DyXNtw0dxsR7Y6s%3D" alt="NutriBot Logo" className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-foreground">NutriBot</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content - adding pb-24 to create space for footer */}
      <main className="flex-1 container mx-auto p-4 pb-24">
        <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="bmi" className="flex items-center gap-2">
              <Activity size={16} />
              <span className="hidden sm:inline">BMI Calculator</span>
              <span className="inline sm:hidden">BMI</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Apple size={16} />
              <span className="hidden sm:inline">Nutrition Analysis</span>
              <span className="inline sm:hidden">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="alternatives" className="flex items-center gap-2">
              <Replace size={16} />
              <span className="hidden sm:inline">Healthy Alternatives</span>
              <span className="inline sm:hidden">Alternatives</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Nutrition Chat</span>
              <span className="inline sm:hidden">Chat</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mb-16">
            {children}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-muted/50 w-full mt-auto fixed bottom-0 z-10">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          NutriBot - AI-Powered Nutrition Assistant © {new Date().getFullYear()}
        </div>
        <div className="container mx-auto text-center text-sm text-muted-foreground">
        Created by Preetam Tony J ✨
        </div>
        
      </footer>
    </div>
  );
}
