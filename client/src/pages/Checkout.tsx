import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import type { InsertBooking, PromoValidationResponse } from "@shared/schema";

interface CheckoutData {
  experienceId: string;
  experienceName: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const dataParam = searchParams.get("data");

  const checkoutData: CheckoutData | null = dataParam
    ? JSON.parse(decodeURIComponent(dataParam))
    : null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [promoResult, setPromoResult] = useState<PromoValidationResponse | null>(null);
  const [discount, setDiscount] = useState(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validatePromo = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest<PromoValidationResponse>("POST", "/api/promo/validate", {
        code,
        subtotal: checkoutData?.subtotal || 0,
      });
    },
    onSuccess: (data) => {
      setPromoResult(data);
      if (data.valid) {
        setDiscount(data.discount);
      }
    },
  });

  const createBooking = useMutation({
    mutationFn: async (booking: InsertBooking) => {
      const response = await apiRequest("POST", "/api/bookings", booking);
      const data = await response.json(); // ✅ Parse JSON here
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ Booking response:", data);

      const bookingId =
        data._id || data.id || data.bookingId || (data.booking && data.booking._id);

      if (!bookingId) {
        console.warn("⚠️ Booking ID missing in response:", data);
        alert("Booking saved, but confirmation link failed. Please check MongoDB.");
        return;
      }

      console.log("🎯 Redirecting to confirmation page:", `/confirmation/${bookingId}`);
      setLocation(`/confirmation/${bookingId}`);
    },

  });


  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No booking data found</h2>
          <button
            onClick={() => setLocation("/")}
            className="text-primary hover:underline"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const dateObj = new Date(checkoutData.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const finalTotal = checkoutData.total - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      validatePromo.mutate(promoCode.trim().toUpperCase());
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const booking: InsertBooking = {
      experienceId: checkoutData.experienceId,
      fullName: fullName.trim(),
      email: email.trim(),
      date: checkoutData.date,
      time: checkoutData.time,
      quantity: checkoutData.quantity,
      promoCode: promoResult?.valid ? promoCode.toUpperCase() : undefined,
      agreeToTerms,
    };

    createBooking.mutate(booking);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 hover-elevate rounded-lg px-3 py-2 -ml-3 transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Checkout</span>
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Information</h2>

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium block">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={validateForm}
                  placeholder="Your name"
                  className={`w-full h-12 md:h-14 px-4 rounded-lg border-2 focus:ring-4 focus:ring-offset-2 focus:outline-none transition-all ${errors.fullName
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-input focus:border-primary focus:ring-primary/20'
                    }`}
                  data-testid="input-fullname"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateForm}
                  placeholder="test@test.com"
                  className={`w-full h-12 md:h-14 px-4 rounded-lg border-2 focus:ring-4 focus:ring-offset-2 focus:outline-none transition-all ${errors.email
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-input focus:border-primary focus:ring-primary/20'
                    }`}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Promo Code */}
            <div className="space-y-4">
              <label htmlFor="promoCode" className="text-sm font-medium block">
                Promo code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 h-12 md:h-14 px-4 rounded-lg border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                  data-testid="input-promo"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || validatePromo.isPending}
                  className="px-6 md:px-8 h-12 md:h-14 bg-foreground text-background rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  data-testid="button-apply-promo"
                >
                  {validatePromo.isPending ? "..." : "Apply"}
                </button>
              </div>
              {promoResult && (
                <p className={`text-sm flex items-center gap-1 ${promoResult.valid ? 'text-green-600' : 'text-destructive'}`}>
                  {promoResult.valid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {promoResult.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-input text-primary focus:ring-4 focus:ring-primary/20 cursor-pointer"
                  data-testid="checkbox-terms"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  I agree to the terms and safety policy
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-destructive flex items-center gap-1 ml-8">
                  <X className="w-4 h-4" />
                  {errors.terms}
                </p>
              )}
            </div>
          </form>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border-2 border-card-border rounded-xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {/* Experience Details */}
              <div className="space-y-3 pb-6 border-b-2 border-border">
                <div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                  <div className="font-semibold" data-testid="text-experience">{checkoutData.experienceName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-semibold" data-testid="text-date">{formattedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-semibold" data-testid="text-time">{checkoutData.time}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Qty</div>
                  <div className="font-semibold" data-testid="text-qty">{checkoutData.quantity}</div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-semibold" data-testid="text-subtotal">₹{checkoutData.subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-mono font-semibold" data-testid="text-taxes">₹{checkoutData.taxes}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-mono font-semibold" data-testid="text-discount">-₹{discount}</span>
                  </div>
                )}

                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="font-mono text-2xl font-bold" data-testid="text-total">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={createBooking.isPending}
                className="w-full h-12 md:h-14 bg-primary text-primary-foreground rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                data-testid="button-confirm-payment"
              >
                {createBooking.isPending ? "Processing..." : "Pay and Confirm"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
