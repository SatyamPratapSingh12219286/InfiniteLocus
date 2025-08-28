import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/courses", label: "Courses", testId: "nav-courses" },
    { path: "/analytics", label: "Analytics", testId: "nav-analytics" },
    { path: "/admin", label: "Admin", testId: "nav-admin" },
  ];

  const isActive = (path: string) => {
    if (path === "/courses") {
      return location === "/" || location === "/courses";
    }
    return location === path;
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="header-title">
              <h1 className="text-xl font-semibold text-primary cursor-pointer">
                Student Feedback System
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={item.testId}>
                <button
                  className={cn(
                    "transition-colors",
                    isActive(item.path)
                      ? "text-primary border-b-2 border-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground" data-testid="user-welcome">
              Welcome, Rajesh
            </span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" data-testid="user-avatar">
              <span className="text-primary-foreground text-sm font-medium">R</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
