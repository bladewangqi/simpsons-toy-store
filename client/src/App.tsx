import { Switch, Route, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/common/ThemeProvider";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";

// Get the base path for GitHub Pages from Vite's BASE_URL
const getBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL;
  return baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");
};

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductList} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/account" component={Account} />
      <Route path="/orders" component={Orders} />
      <Route path="/favorites" component={Favorites} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = getBasePath();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router base={basePath}>
            <AppRouter />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
