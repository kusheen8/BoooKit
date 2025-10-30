import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import type { Booking } from "@shared/schema";

export default function Confirmation() {
  const [, params] = useRoute("/confirmation/:bookingId");
  const [, setLocation] = useLocation();
  const bookingId = params?.bookingId;

  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: ["/api/bookings", bookingId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking");
      return response.json();
    },
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showSearch={false} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse space-y-8">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto" />
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Booking not found</h2>
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

  const dateObj = new Date(booking.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-600 dark:text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              Booking Confirmed
            </h1>
            <p className="text-lg text-muted-foreground">
              Your adventure awaits! Check your email for booking details.
            </p>
          </div>

          {/* Booking Reference */}
          <div className="bg-card border-2 border-card-border rounded-xl p-6 md:p-8 space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="text-center pb-4 border-b-2 border-border">
              <div className="text-sm text-muted-foreground mb-2">Ref ID:</div>
              <div className="font-mono text-xl md:text-2xl font-bold tracking-wider" data-testid="text-booking-reference">
                {booking.bookingReference}
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Experience</div>
                <div className="font-semibold text-lg" data-testid="text-experience-name">
                  {booking.experienceName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-semibold" data-testid="text-booking-date">{formattedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-semibold" data-testid="text-booking-time">{booking.time}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Guests</div>
                  <div className="font-semibold">{booking.quantity}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Paid</div>
                  <div className="font-mono font-bold text-lg text-green-600">₹{booking.total}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-semibold">{booking.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold text-sm break-all">{booking.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="pt-4 animate-in fade-in duration-700 delay-500">
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-12 bg-primary text-primary-foreground rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform"
              data-testid="button-back-home"
            >
              Back to Home
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed animate-in fade-in duration-700 delay-600">
            A confirmation email has been sent to {booking.email}. Please arrive 15 minutes before your scheduled time.
          </p>
        </div>
      </main>
    </div>
  );
}
