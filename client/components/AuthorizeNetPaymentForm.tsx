import { useState } from "react";
import { AlertCircle, Loader, Lock, CreditCard } from "lucide-react";

interface AuthorizeNetPaymentFormProps {
  amount: number;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
  onSubmit?: (e: React.FormEvent) => boolean;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
}

export default function AuthorizeNetPaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false,
  onSubmit,
}: AuthorizeNetPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    saveCard: false,
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
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    if (field === "saveCard") {
      setFormData((prev) => ({
        ...prev,
        saveCard: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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

    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      setError("Please enter a valid CVV (3-4 digits)");
      return;
    }

    setLoading(true);

    try {
      console.log("AuthorizeNetPaymentForm: Starting payment processing");

      // Extract card details
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      const [expMonth, expYear] = formData.expiryDate.split("/");
      
      // Prepare payment payload for Authorize.net
      const paymentPayload = {
        createTransactionRequest: {
          merchantAuthentication: {
            name: process.env.REACT_APP_AUTHNET_API_LOGIN_ID,
            transactionKey: process.env.REACT_APP_AUTHNET_TRANSACTION_KEY,
          },
          refId: `ref_${Date.now()}`,
          transactionRequest: {
            transactionType: "authCaptureTransaction",
            amount: amount.toFixed(2),
            payment: {
              creditCard: {
                cardNumber: cardNumber,
                expirationDate: `20${expYear}-${expMonth}`,
                cardCode: formData.cvv,
              },
            },
            billTo: {
              firstName: formData.cardholderName.split(" ")[0] || "",
              lastName: formData.cardholderName.split(" ").slice(1).join(" ") || "",
            },
            userFields: {
              userField: [
                {
                  name: "saveCard",
                  value: formData.saveCard ? "true" : "false",
                },
              ],
            },
          },
        },
      };

      console.log(
        "AuthorizeNetPaymentForm: Sending payment request to backend",
      );

      // Send to backend for Authorize.net processing
      const response = await fetch("/api/authorize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Payment processing failed",
        );
      }

      if (
        result.transactionResponse &&
        result.transactionResponse.responseCode === "1"
      ) {
        // Payment successful
        const transactionId = result.transactionResponse.transId;
        console.log(
          "AuthorizeNetPaymentForm: Payment succeeded with transaction ID:",
          transactionId,
        );

        onPaymentSuccess(transactionId);

        console.log(
          "AuthorizeNetPaymentForm: onPaymentSuccess called successfully",
        );
      } else {
        const errorMessage =
          result.transactionResponse?.messages?.[0]?.description ||
          "Payment declined";
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      console.error("AuthorizeNetPaymentForm: Payment error:", errorMessage);
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Type Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Credit or Debit Card
        </h3>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Card Number
          <span className="text-red-500 ml-1">*</span>
          <span className="text-xs font-normal text-gray-600 ml-2">(required)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange(e, "cardNumber")}
            placeholder="0000 0000 0000 0000"
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono text-lg"
            required
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F019bed8f83b84cb3bfcbf3cb8538b427%2Fd63bbb5fe4de4432a17d09b5ee709a23?format=webp&width=800&height=1200"
            alt="Card"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-auto"
          />
        </div>
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Expiry MM/YY
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs font-normal text-gray-600 ml-2">(required)</span>
          </label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange(e, "expiryDate")}
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            CVV/CW
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs font-normal text-gray-600 ml-2">(required)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange(e, "cvv")}
              placeholder="000"
              maxLength={4}
              className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono text-lg"
              required
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F019bed8f83b84cb3bfcbf3cb8538b427%2F949497916aa148e28a063934588cd646?format=webp&width=800&height=1200"
              alt="CVV"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange(e, "cardholderName")}
          placeholder="Full Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {/* Save Card Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.saveCard}
          onChange={(e) => handleInputChange(e, "saveCard")}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700">
          Save card to my account
        </span>
      </label>

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

      {/* Apply Card Button */}
      <button
        type="submit"
        disabled={loading || isProcessing}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            APPLY CARD
          </>
        )}
      </button>

      {/* Test Sandbox Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-3">
          Authorize.net Sandbox Test Credentials
        </p>
        <div className="text-xs text-blue-700 space-y-2">
          <div>
            <strong>Test Card Numbers:</strong>
            <ul className="ml-3 mt-1 space-y-1">
              <li>Visa: 4111111111111111</li>
              <li>Mastercard: 5424000000000015</li>
              <li>American Express: 374245455400126</li>
            </ul>
          </div>
          <div>
            <strong>Expiry Date:</strong> Any future date (MM/YY)
          </div>
          <div>
            <strong>CVV:</strong> Any 3 or 4 digits
          </div>
          <div>
            <strong>Name:</strong> Any name
          </div>
          <p className="mt-2 text-blue-600">
            ℹ️ This is a sandbox environment for testing. Use test card numbers
            above.
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
