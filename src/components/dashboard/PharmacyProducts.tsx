
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, Edit, Trash2, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price_lkr: number;
  quantity: number;
  weight?: string;
  description?: string;
  image_url?: string;
  barcode?: string;
  is_available: boolean;
}

interface PharmacyProductsProps {
  pharmacyId?: string;
}

export const PharmacyProducts: React.FC<PharmacyProductsProps> = ({ pharmacyId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'medicine',
    price_lkr: 0,
    quantity: 0,
    weight: '',
    description: '',
    barcode: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);

  // Sample Sri Lankan pharmacy products for demonstration
  const sampleProducts = [
    { name: 'Panadol', category: 'medicine', suggested_price: 25 },
    { name: 'Piriton', category: 'medicine', suggested_price: 15 },
    { name: 'ORS', category: 'medicine', suggested_price: 10 },
    { name: 'Vitamin C', category: 'supplement', suggested_price: 150 },
    { name: 'Dettol Soap', category: 'personal_care', suggested_price: 85 },
    { name: 'Johnson Baby Powder', category: 'personal_care', suggested_price: 320 },
    { name: 'Milo', category: 'beverage', suggested_price: 450 },
    { name: 'Coca Cola', category: 'beverage', suggested_price: 100 },
    { name: 'Elephant House Ginger Beer', category: 'beverage', suggested_price: 80 },
    { name: 'Marie Biscuits', category: 'confectionery', suggested_price: 65 }
  ];

  const categories = [
    'medicine', 'supplement', 'personal_care', 'beverage', 'confectionery', 'medical_device', 'other'
  ];

  useEffect(() => {
    if (pharmacyId) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [pharmacyId]);

  const fetchProducts = async () => {
    // For now, we'll use local state since the products table doesn't exist yet
    // In a real implementation, this would fetch from the database
    setProducts([]);
    setLoading(false);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price_lkr || !pharmacyId) {
      toast.error('Please fill in required fields');
      return;
    }

    // For demonstration, we'll add to local state
    // In a real implementation, this would save to the database
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      is_available: true
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: 'medicine',
      price_lkr: 0,
      quantity: 0,
      weight: '',
      description: '',
      barcode: '',
      image_url: ''
    });
    setShowAddForm(false);
    toast.success('Product added successfully!');
  };

  const handleProductSelect = (product: any) => {
    setNewProduct({
      ...newProduct,
      name: product.name,
      category: product.category,
      price_lkr: product.suggested_price
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Product deleted successfully!');
  };

  const filteredSampleProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center">Loading products...</div>
        </CardContent>
      </Card>
    );
  }

  if (!pharmacyId) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Complete your pharmacy registration to manage products
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">Product Management</h3>
          <p className="text-muted-foreground">Manage your pharmacy inventory</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Product
            </CardTitle>
            <CardDescription>
              Search from our Sri Lankan product database or add custom items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Sri Lankan products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchTerm && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {filteredSampleProducts.map((product, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleProductSelect(product)}
                      className="justify-start text-sm"
                    >
                      {product.name} - LKR {product.suggested_price}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price_lkr}
                  onChange={(e) => setNewProduct({...newProduct, price_lkr: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight/Size</Label>
                <Input
                  id="weight"
                  value={newProduct.weight}
                  onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                  placeholder="e.g., 500mg, 100ml"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                  placeholder="Product barcode"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description..."
                className="w-full p-2 border rounded-md h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddProduct} className="medical-gradient text-white">
                Add Product
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No products added yet.</p>
              <p className="text-sm">Start by adding your first product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Image className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.category.replace('_', ' ').toUpperCase()} • 
                        Qty: {product.quantity} • 
                        LKR {product.price_lkr.toLocaleString()}
                      </p>
                      {product.weight && (
                        <p className="text-xs text-muted-foreground">{product.weight}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.is_available ? 'default' : 'secondary'}>
                      {product.is_available ? 'Available' : 'Out of Stock'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
