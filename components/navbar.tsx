"use client";

import Link from "next/link";
import { Building2, Home, Search, Plus, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/properties" });
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8" />
              <span className="font-bold text-xl">LuxeHaven</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link href="/properties" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                <Search className="h-4 w-4" />
                <span>Properties</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/properties/new">
                    <Plus className="mr-2 h-4 w-4" />
                    List Property
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={session.user?.image || ''} 
                          alt={session.user?.name || ''} 
                        />
                        <AvatarFallback>
                          {getInitials(session.user?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64">
                    <div className="flex items-center space-x-3 p-2 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={session.user?.image || ''} 
                          alt={session.user?.name || ''} 
                        />
                        <AvatarFallback>
                          {getInitials(session.user?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-2">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings/profile" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />
                    
                    <div className="p-2">
                      <DropdownMenuItem 
                        onClick={handleSignOut} 
                        className="flex items-center text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}