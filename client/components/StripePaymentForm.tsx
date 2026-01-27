import { useState } from "react";
import { AlertCircle, Loader, Lock } from "lucide-react";

interface StripePaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
  onSubmit?: (e: React.FormEvent) => boolean;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function StripePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false,
  onSubmit,
}: StripePaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof PaymentFormData,
  ) => {
    let value = e.target.value;

    if (field === "cardNumber") {
      value = value.replace(/\s/g, "").slice(0, 16);
      value = value.replace(/(\d{4})/g, "$1 ").trim();
    } else if (field === "expiryDate") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    } else if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate parent form first if callback provided
    if (onSubmit) {
      const isValid = onSubmit(e);
      if (!isValid) {
        return;
      }
    }

    setError(null);

    // Basic validation
    if (!formData.cardholderName) {
      setError("Cardholder name is required");
      return;
    }

    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid 16-digit card number");
      return;
    }

    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      setError("Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (formData.cvv.length !== 3) {
      setError("Please enter a valid 3-digit CVV");
      return;
    }

    setLoading(true);

    try {
      console.log("StripePaymentForm: Starting payment processing");

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment
      const paymentIntentId = "test_payment_intent_" + Date.now();
      console.log(
        "StripePaymentForm: Payment succeeded, calling onPaymentSuccess with:",
        paymentIntentId,
      );

      onPaymentSuccess(paymentIntentId);

      console.log("StripePaymentForm: onPaymentSuccess called successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      console.error("StripePaymentForm: Payment error:", errorMessage);
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange(e, "cardholderName")}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Card Number
        </label>
        <input
          type="text"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange(e, "cardNumber")}
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
          required
        />
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange(e, "expiryDate")}
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={formData.cvv}
            onChange={(e) => handleInputChange(e, "cvv")}
            placeholder="123"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
            required
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-900">Payment Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || isProcessing}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay ${amount.toLocaleString("en-US")}
          </>
        )}
      </button>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">
          Test Payment Information
        </p>
        <div className="text-xs text-blue-700 space-y-1">
          <p>
            <strong>Name:</strong> Test User
          </p>
          <p>
            <strong>Card Number:</strong> 4242 4242 4242 4242
          </p>
          <p>
            <strong>Expiry:</strong> 12/25 (or any future date)
          </p>
          <p>
            <strong>CVV:</strong> 123 (or any 3 digits)
          </p>
          <p className="mt-2 text-blue-600">
            ℹ️ This is a test environment. Use any future expiry date for
            testing.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <p className="text-xs text-gray-600 flex items-center gap-1">
        <Lock className="w-4 h-4" />
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}
