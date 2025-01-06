import { Building2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span className="font-bold text-lg">LuxeHaven</span>
            </div>
            <p className="text-muted-foreground">
              Your trusted partner in finding the perfect home. Whether you&apos;re buying, selling, or renting, we&apos;re here to help.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/properties" className="text-muted-foreground hover:text-foreground">Properties</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/buy" className="text-muted-foreground hover:text-foreground">Buy Property</Link></li>
              <li><Link href="/rent" className="text-muted-foreground hover:text-foreground">Rent Property</Link></li>
              <li><Link href="/sell" className="text-muted-foreground hover:text-foreground">Sell Property</Link></li>
              <li><Link href="/valuation" className="text-muted-foreground hover:text-foreground">Property Valuation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-muted-foreground">123 Luxury Lane, Suite 100</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-muted-foreground">contact@luxehaven.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} LuxeHaven Realty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}