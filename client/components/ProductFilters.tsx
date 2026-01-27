import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Product, Vendor, SubCategory } from "@/lib/api";
import { X, ChevronDown } from "lucide-react";

export interface FilterState {
  searchTerm: string;
  priceRange: [number, number];
  vendors: number[];
  categories: number[];
  ratings: number[];
}

interface ProductFiltersProps {
  products: Product[];
  vendors: Vendor[];
  subCategories: SubCategory[];
  onApplyFilters: (filters: FilterState) => void;
  onReset: () => void;
  maxPrice: number;
}

export default function ProductFilters({
  products,
  vendors,
  subCategories,
  onApplyFilters,
  onReset,
  maxPrice,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    search: true,
    price: true,
    vendors: true,
    categories: true,
    ratings: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get all sub-categories (show all available categories)
  const availableCategories = subCategories;

  const vendorList = vendors.filter((v) =>
    products.some((p) => p.vendor_id === v.vendor_id),
  );

  const ratingOptions = [1, 2, 3, 4, 5];

  const handleApplyFilters = () => {
    onApplyFilters({
      searchTerm,
      priceRange,
      vendors: selectedVendors,
      categories: selectedCategories,
      ratings: selectedRatings,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setPriceRange([0, maxPrice]);
    setSelectedVendors([]);
    setSelectedCategories([]);
    setSelectedRatings([]);
    onReset();
  };

  const isFiltersActive =
    searchTerm ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    selectedVendors.length > 0 ||
    selectedCategories.length > 0 ||
    selectedRatings.length > 0;

  return (
    <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200 p-6 h-fit sticky top-4 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-almarai font-bold text-slate-900">Filters</h2>
        {isFiltersActive && (
          <button
            onClick={handleReset}
            className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search by Name */}
        <div className="pb-4 border-b border-slate-200">
          <button
            onClick={() => toggleSection("search")}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <label className="text-sm font-semibold text-slate-900 cursor-pointer">
              Search Product
            </label>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                expandedSections.search ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.search && (
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          )}
        </div>

        {/* Price Range */}
        <div className="pb-4 border-b border-slate-200">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <label className="text-sm font-semibold text-slate-900 cursor-pointer">
              Price Range
            </label>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                expandedSections.price ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                min={0}
                max={maxPrice}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Vendors */}
        <div className="pb-4 border-b border-slate-200">
          <button
            onClick={() => toggleSection("vendors")}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <label className="text-sm font-semibold text-slate-900 cursor-pointer">
              Vendors {selectedVendors.length > 0 && `(${selectedVendors.length})`}
            </label>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                expandedSections.vendors ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.vendors && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {vendorList.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    id={`vendor-${vendor.id}`}
                    checked={selectedVendors.includes(vendor.vendor_id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedVendors([
                          ...selectedVendors,
                          vendor.vendor_id,
                        ]);
                      } else {
                        setSelectedVendors(
                          selectedVendors.filter((v) => v !== vendor.vendor_id),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`vendor-${vendor.id}`}
                    className="text-sm text-slate-700 cursor-pointer flex-1"
                  >
                    {vendor.shop_name || vendor.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="pb-4 border-b border-slate-200">
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <label className="text-sm font-semibold text-slate-900 cursor-pointer">
              Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </label>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                expandedSections.categories ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.categories && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableCategories.length > 0 ? (
                availableCategories.map((subCategory) => (
                  <div
                    key={subCategory.sub_category_id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Checkbox
                      id={`category-${subCategory.sub_category_id}`}
                      checked={selectedCategories.includes(subCategory.sub_category_id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, subCategory.sub_category_id]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== subCategory.sub_category_id),
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`category-${subCategory.sub_category_id}`}
                      className="text-sm text-slate-700 cursor-pointer flex-1"
                    >
                      {subCategory.sub_category_name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No categories available</p>
              )}
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="pb-4 border-b border-slate-200">
          <button
            onClick={() => toggleSection("ratings")}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <label className="text-sm font-semibold text-slate-900 cursor-pointer">
              Ratings {selectedRatings.length > 0 && `(${selectedRatings.length})`}
            </label>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                expandedSections.ratings ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.ratings && (
            <div className="space-y-2">
              {ratingOptions.map((rating) => (
                <div
                  key={rating}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRatings([...selectedRatings, rating]);
                      } else {
                        setSelectedRatings(
                          selectedRatings.filter((r) => r !== rating),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm text-slate-700 cursor-pointer flex-1 flex items-center gap-1"
                  >
                    {"⭐".repeat(rating)} {rating}+ Stars
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="pt-4 space-y-2">
          <Button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 rounded-lg transition-colors shadow-md"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
