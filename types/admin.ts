export interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: 'ADMIN' | 'USER';
    _count: {
      properties: number;
      payments: number;
    };
  }
  
  export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    imageUrls: string[];
    type: 'RENT' | 'SALE';
    status: 'AVAILABLE' | 'SOLD' | 'RENTED';
  }
  
  export interface Analytics {
    totalUsers: number;
    totalProperties: number;
    totalPayments: number;
    propertiesByType: Array<{
      type: string;
      _count: number;
    }>;
    propertiesByLocation: Array<{
      location: string;
      _count: number;
    }>;
    recentTransactions: Array<{
      id: string;
      amount: number;
      user: User;
      property: Property;
    }>;
  }