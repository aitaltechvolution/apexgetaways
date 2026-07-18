# Files to Copy from Claude Conversation Artifacts

This ZIP contains all config, schema, edge functions, hooks, utils, constants
and stub files. The large JSX implementation files must be copied from the
Claude conversation artifacts into the matching paths below.

## Copy these artifacts into src/

### store/
- AuthContext.jsx   → artifact "ThemeContext + AuthContext"
- ThemeContext.jsx  → same artifact

### components/ui/
- Button.jsx, Badge.jsx, Card.jsx, Modal.jsx, Alert.jsx → "UI Components 1"
- Breadcrumb.jsx, ProgressBar.jsx, ImageLabel.jsx, SectionTitle.jsx,
  AnimatedText.jsx, Skeleton.jsx, index.js → "UI Components 2"
- ReadingProgress.jsx, TestimonialForm.jsx → "Final Polish" artifact

### components/layout/
- Navbar.jsx             → "Navbar.jsx"
- Footer.jsx + ScrollToTop.jsx + LiveChat.jsx + PageTransition.jsx
  → "Footer + ScrollToTop + LiveChat + MainLayout"
- MainLayout.jsx         → "MainLayout Final Version"
- WhatsAppButton.jsx     → "SEO + WhatsApp + Cookie + 404"
- CookieConsent.jsx      → same
- GlobalSearch.jsx       → "GlobalSearch" artifact

### components/sections/
- HeroSection.jsx        → "HeroSection.jsx"
- WhyChooseUs.jsx + PopularDestinations.jsx → "WhyChooseUs + PopularDest"
- SpecialOffers.jsx + HowItWorks.jsx → "SpecialOffers + HowItWorks"
- Testimonials.jsx + TravelTips.jsx + NewsletterSection.jsx → "Testimonials+TravelTips+Newsletter"

### pages/
- Home/index.jsx         → "Homepage Assembly"
- About/index.jsx        → "About Us Page"
- Services/index.jsx + ServiceTemplate.jsx → "Services Overview + Template"
- Services/flights/ visa/ hotels/index.jsx → "Flights Visa Hotels"
- Services/airport-pickup/ bus-transport/ holiday-packages/
  travel-insurance/ corporate-travel/index.jsx → use ServiceTemplate stub
- Destinations/index.jsx → "Destinations Page"
- Destinations/DestinationDetail.jsx → "DestinationDetail"
- Blog/index.jsx         → "Blog Listing Page"
- Blog/BlogPost.jsx      → "Blog Post with Reading Progress"
- Contact/index.jsx      → "Contact Page"
- Packages/index.jsx     → "Packages Page"
- Packages/PackageDetail.jsx → "PackageDetail"
- Booking/Flights/index.jsx → "Flight Booking Page"
- Booking/PassengerDetails.jsx → "Passenger Details Step 2"
- Booking/Review.jsx     → "Review Step 3"
- Booking/Payment.jsx    → "Payment Step 4"
- Booking/Confirmation.jsx → "Confirmation Step 5"
- Booking/Hotels/index.jsx + AirportPickup/index.jsx → "Hotels + Airport Pickup"
- Booking/Bus/index.jsx  → "Bus Booking with Seat Map"
- Auth/Login.jsx + Register.jsx + ForgotPassword.jsx + ResetPassword.jsx → "Auth Pages"
- Dashboard/index.jsx + Bookings.jsx + Profile.jsx + Itineraries.jsx → "Dashboard Pages"
- Admin/AdminLayout.jsx  → "AdminLayout"
- Admin/index.jsx        → "Admin Dashboard with Charts"
- Admin/Bookings.jsx     → "Admin Bookings Management"
- Admin/Leads.jsx        → "Admin Leads"
- Admin/Pricing.jsx + Settings.jsx → "Admin Pricing + Settings"
- Admin/Customers.jsx    → "Admin Customers"
- Admin/Reports.jsx      → "Admin Reports"
- Admin/Testimonials.jsx + ServiceRequests.jsx + Offers.jsx → "Admin Remaining"
- Admin/Blog.jsx + Destinations.jsx + Packages.jsx → "Admin Blog+Destinations+Packages"
- NotFound.jsx           → "SEO + WhatsApp + Cookie + 404"

### App.jsx
→ artifact "App.jsx — Full Router"

### components/SEO.jsx
→ artifact "SEO.jsx + WhatsApp + Cookie + 404"
