import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, Clock, Users, Calendar, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import type { Experience } from "@shared/schema";

export default function ExperienceDetails() {
  const [, params] = useRoute("/experience/:id");
  const [, setLocation] = useLocation();
  const experienceId = params?.id;

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "";


  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: experience, isLoading } = useQuery<Experience>({
    queryKey: ["/api/experiences", experienceId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/experiences/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch experience");
      return response.json();
    },
    enabled: !!experienceId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-96 md:h-[500px] bg-muted rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
              <div className="h-96 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Experience not found</h2>
          <button
            onClick={() => setLocation("/")}
            className="text-primary hover:underline"
            data-testid="button-back-home"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + taxes;

  const canConfirm = selectedDate && selectedTime && quantity > 0;

  const handleConfirm = () => {
    if (canConfirm) {
      const bookingData = {
        experienceId: experience.id,
        experienceName: experience.name,
        date: selectedDate,
        time: selectedTime,
        quantity,
        subtotal,
        taxes,
        total,
      };
      setLocation(`/checkout?data=${encodeURIComponent(JSON.stringify(bookingData))}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 hover-elevate rounded-lg px-3 py-2 -ml-3 transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Details</span>
        </button>

        {/* Hero Image */}
        <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden mb-8">
          <img
            src={`${API_BASE_URL}${experience.imageUrl}`}
            alt={experience.name}
            className="w-full h-full object-cover"
          />
        </div>


        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Location */}
            <div className="space-y-4">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold" data-testid="text-experience-name">
                {experience.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{experience.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground">
                {experience.description}
              </p>
              {experience.duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>Duration: {experience.duration}</span>
                </div>
              )}
              {experience.minAge && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>Minimum age: {experience.minAge}</span>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Choose date</h2>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {(experience.availableDates || []).slice(0, 7).map((date) => {
                  const dateObj = new Date(date);
                  const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                  const isSelected = selectedDate === date;

                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary hover-elevate'
                        }`}
                      data-testid={`button-date-${date}`}
                    >
                      <div className="text-xs font-medium">{month}</div>
                      <div className="text-lg font-bold">{day}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Choose time</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(experience.timeSlots || []).map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const isAvailable = slot.available;

                    return (
                      <button
                        key={slot.time}
                        onClick={() => isAvailable && setSelectedTime(slot.time)}
                        disabled={!isAvailable}
                        className={`relative px-6 py-3 rounded-full border-2 font-medium transition-all ${!isAvailable
                          ? 'opacity-50 cursor-not-allowed border-border'
                          : isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary hover-elevate'
                          }`}
                        data-testid={`button-time-${slot.time}`}
                      >
                        <span className={!isAvailable ? 'line-through' : ''}>{slot.time}</span>
                        {isAvailable && slot.capacity && (
                          <div className="text-xs mt-1 opacity-75">
                            {slot.capacity} spots left
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-destructive rotate-[-20deg]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About Section */}
            <div className="space-y-4 bg-muted/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scenic routes, trained guides, and safety briefing. Minimum age 10. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.
              </p>
            </div>
          </div>

          {/* Right Column - Pricing Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border-2 border-card-border rounded-xl p-6 md:p-8 space-y-6">
              {/* Price Header */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Starts at</div>
                <div className="font-mono text-3xl font-bold" data-testid="text-price">
                  ₹{experience.price}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover-elevate disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    data-testid="button-quantity-decrease"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="min-w-12 text-center text-lg font-semibold" data-testid="text-quantity">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover-elevate transition-all"
                    data-testid="button-quantity-increase"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-border pt-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-semibold" data-testid="text-subtotal">₹{subtotal}</span>
                </div>

                {/* Taxes */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-mono font-semibold" data-testid="text-taxes">₹{taxes}</span>
                </div>

                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="font-mono text-2xl font-bold" data-testid="text-total">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full h-12 md:h-14 bg-primary text-primary-foreground rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                data-testid="button-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
