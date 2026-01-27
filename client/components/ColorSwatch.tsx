import { Check } from "lucide-react";

interface ColorSwatchProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  size?: "sm" | "md" | "lg";
}

const colorMap: { [key: string]: string } = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00AA00",
  yellow: "#FFFF00",
  purple: "#800080",
  pink: "#FFC0CB",
  orange: "#FFA500",
  brown: "#8B4513",
  gray: "#808080",
  navy: "#000080",
  darkblue: "#00008B",
  maroon: "#800000",
  teal: "#008080",
  olive: "#808000",
  khaki: "#F0E68C",
  indigo: "#4B0082",
  violet: "#EE82EE",
  turquoise: "#40E0D0",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  cream: "#FFFDD0",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  coral: "#FF7F50",
  salmon: "#FA8072",
  crimson: "#DC143C",
  scarlet: "#FF2400",
  magenta: "#FF00FF",
  lime: "#00FF00",
  cyan: "#00FFFF",
  aqua: "#00FFFF",
  ivory: "#FFFFF0",
};

function getColorValue(colorName: string): string {
  const lowerName = colorName.toLowerCase().trim();

  if (lowerName.startsWith("#")) {
    return lowerName;
  }

  return colorMap[lowerName] || "#CCCCCC";
}

export default function ColorSwatch({
  colors,
  selectedColor,
  onColorSelect,
  size = "md",
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const colorValue = getColorValue(color);
        const isSelected = selectedColor === color;

        return (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`relative rounded-full transition-all duration-200 flex-shrink-0 ${sizeClasses[size]} ${
              isSelected
                ? "ring-2 ring-offset-2 ring-blue-600 scale-110"
                : "hover:scale-110 ring-1 ring-gray-300"
            }`}
            style={{
              backgroundColor: colorValue,
              borderColor: colorValue === "#FFFFFF" ? "#E5E7EB" : undefined,
              border: colorValue === "#FFFFFF" ? "2px solid" : undefined,
            }}
            title={color}
          >
            {isSelected && (
              <Check
                className="w-5 h-5 absolute inset-0 m-auto text-white drop-shadow-lg"
                strokeWidth={3}
                style={{
                  filter:
                    colorValue === "#FFFFFF" ||
                    colorValue === "#FFFF00" ||
                    colorValue === "#FFC0CB" ||
                    colorValue === "#FFFDD0" ||
                    colorValue === "#FFFFF0"
                      ? "drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))"
                      : undefined,
                  color:
                    colorValue === "#FFFFFF" ||
                    colorValue === "#FFFF00" ||
                    colorValue === "#FFC0CB" ||
                    colorValue === "#FFFDD0" ||
                    colorValue === "#FFFFF0"
                      ? "#000000"
                      : "#FFFFFF",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
