import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Product,
  Vendor,
  getProducts,
  getVendors,
  getProductImageUrl,
} from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { ChevronLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import SimilarProductsCarousel from "@/components/SimilarProductsCarousel";
import ColorSwatch from "@/components/ColorSwatch";
import ProductRating from "@/components/ProductRating";
import VendorRatingDisplay from "@/components/VendorRatingDisplay";
import { toast } from "sonner";

export default function ProductDetail() {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductData();
  }, [product_id]);

  const fetchProductData = async () => {
    setLoading(true);

    const productId = parseInt(product_id || "0", 10);
    const allProducts = await getProducts();
    const foundProduct = allProducts.find((p) => p.product_id === productId);
    setProduct(foundProduct || null);

    if (foundProduct) {
      const vendors = await getVendors();
      const foundVendor = vendors.find(
        (v) => v.vendor_id === foundProduct.vendor_id,
      );
      setVendor(foundVendor || null);

      setSelectedImage(foundProduct.product_thumbnail);
    }

    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const colors =
      product.product_colors
        ?.split(",")
        .map((c) => c.trim())
        .filter((c) => c.toLowerCase() !== "n/a") || [];
    const sizes =
      product.product_sizes
        ?.split(",")
        .map((s) => s.trim())
        .filter((s) => s.toLowerCase() !== "n/a") || [];

    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color", {
        description: "Color selection is required for this product",
      });
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size", {
        description: "Size selection is required for this product",
      });
      return;
    }

    addToCart({
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      quantity,
      product_thumbnail: product.product_thumbnail,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });

    let description = `Quantity: ${quantity}`;
    if (selectedColor) description += `, Color: ${selectedColor}`;
    if (selectedSize) description += `, Size: ${selectedSize}`;

    toast.success(`${product.product_name} added to cart!`, {
      description,
    });

    setQuantity(1);
    setSelectedColor("");
    setSelectedSize("");
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= product!.product_quantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-gray-600">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const colors =
    product.product_colors
      ?.split(",")
      .map((c) => c.trim())
      .filter((c) => c.toLowerCase() !== "n/a") || [];
  const sizes =
    product.product_sizes
      ?.split(",")
      .map((s) => s.trim())
      .filter((s) => s.toLowerCase() !== "n/a") || [];
  const allImages = [
    product.product_thumbnail,
    ...(product.gallery_images || []),
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={vendor ? `/vendor/${vendor.id}` : "/"}
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Backk
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center h-[400px] md:h-[500px]">
              <img
                src={getProductImageUrl(selectedImage)}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`rounded-lg overflow-hidden h-20 border-2 transition-colors ${
                      selectedImage === image
                        ? "border-[#070418]"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={getProductImageUrl(image)}
                      alt={`${product.product_name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.product_name}
              </h1>
              {vendor && (
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">
                    By{" "}
                    <Link
                      to={`/vendor/${vendor.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {vendor.shop_name || vendor.name}
                    </Link>
                  </p>
                  <VendorRatingDisplay
                    productId={product.product_id}
                    vendorName={vendor.shop_name || vendor.name}
                  />
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="bg-slate-50 rounded-lg px-4 py-3 inline-block mb-4">
                <p className="text-sm text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                  Price
                </p>
                <p className="text-3xl font-bold text-slate-700">
                  ${product.product_price.toLocaleString("en-US")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {product.product_quantity > 0 ? (
                  <span className="text-green-600 font-semibold">
                    In Stock ({product.product_quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.product_short_description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.product_short_description}
                </p>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Available Colors
                </h3>
                <ColorSwatch
                  colors={colors}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  size="lg"
                />
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Available Sizes
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-semibold transition-colors ${
                        selectedSize === size
                          ? "border-[#070418] bg-[#070418] text-white"
                          : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            {product.product_quantity > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Quantity
                    </h3>
                    <div className="flex items-center gap-4 border border-gray-300 rounded-lg w-fit">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-5 h-5 text-gray-600" />
                      </button>
                      <span className="px-6 font-bold text-lg">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.product_quantity}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#070418] text-white font-bold py-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            )}

            {/* Product Info */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product Code</p>
                  <p className="font-semibold text-gray-900">
                    {product.product_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-semibold text-gray-900">
                    {product.product_slug}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Ratings & Reviews */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ProductRating productId={product.product_id} />
        </div>

        {/* Similar Products */}
        <SimilarProductsCarousel
          currentProductId={product.product_id}
          vendorId={product.vendor_id}
        />
      </div>

      <Footer />
    </div>
  );
}
