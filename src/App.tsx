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
                  src="https://i.postimg.cc/WzfKp2mL/image.png" 
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
