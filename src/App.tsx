import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { NutritionDashboard } from "@/components/nutrition-dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Toaster />
            <Sonner />
            <header className="border-b">
              <div className="container mx-auto py-4 flex items-center gap-2">
                <img 
                  src="https://sdmntpreastus2.oaiusercontent.com/files/00000000-0d7c-61f6-a76a-7adf6bff0704/raw?se=2025-04-10T18%3A40%3A40Z&sp=r&sv=2024-08-04&sr=b&scid=ce4a17e9-31a1-5c83-a799-9a5052ea48e3&skoid=ac1d63ad-0c69-4017-8785-7a50eb04382c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-09T21%3A04%3A54Z&ske=2025-04-10T21%3A04%3A54Z&sks=b&skv=2024-08-04&sig=nL5tDK%2BXFJiNHxomfZB6osFUmiw5DyXNtw0dxsR7Y6s%3D" 
                  alt="NutriBot Logo" 
                  className="h-8 w-8" 
                />
                <div>
                  <h1 className="text-2xl font-bold">NutriBot - Your AI Companion</h1>
                  <p className="text-muted-foreground">Your personal nutrition assistant powered by AI</p>
                </div>
              </div>
            </header>
            <main className="flex-1 pb-16">
              <NutritionDashboard />
            </main>
            <footer className="border-t py-4 bg-muted/50 w-full fixed bottom-0 z-10">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                NutriBot - AI-Powered Nutrition Assistant © {new Date().getFullYear()}
              </div>
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                Created by Preetam Tony J ✨
              </div>
            </footer>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
