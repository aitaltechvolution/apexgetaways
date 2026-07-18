import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './store/ThemeContext'
import { AuthProvider } from './store/AuthContext'
import { BookingProvider } from './store/BookingContext'
import MainLayout from './components/layout/MainLayout'
import CookieConsent from './components/layout/CookieConsent'

// Pages
import HomePage          from './pages/Home/index'
import DestinationsPage  from './pages/Destinations/index'
import DestDetailPage    from './pages/Destinations/Detail'
import PackagesPage      from './pages/Packages/index'
import PackageDetailPage from './pages/Packages/Detail'
import ServicesPage      from './pages/Services/index'
import ServiceDetailPage from './pages/Services/Detail'
import AboutPage         from './pages/About/index'
import ContactPage       from './pages/Contact/index'
import BlogPage          from './pages/Blog/index'
import BlogPostPage      from './pages/Blog/Post'
import FAQPage           from './pages/FAQ/index'
import TestimonialsPage  from './pages/Testimonials/index'
import PrivacyPage       from './pages/Legal/Privacy'
import TermsPage         from './pages/Legal/Terms'
import NotFoundPage      from './pages/NotFound/index'

// Booking
import BookingHubPage    from './pages/Booking/index'
import FlightsPage       from './pages/Booking/Flights/index'
import HotelsPage        from './pages/Booking/Hotels/index'
import PickupPage        from './pages/Booking/Pickup/index'
import PassengersPage    from './pages/Booking/PassengerDetails'
import ReviewPage        from './pages/Booking/Review'
import ConfirmationPage  from './pages/Booking/Confirmation'

// Auth
import LoginPage         from './pages/Auth/Login'
import RegisterPage      from './pages/Auth/Register'
import ForgotPage        from './pages/Auth/ForgotPassword'

// Admin
import AdminLayout       from './pages/Admin/index'

function Wrap({ children }) {
  return <MainLayout>{children}</MainLayout>
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <Toaster position="top-right" toastOptions={{
              style: { borderRadius:'12px', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'14px', background:'#0F1826', color:'#fff', border:'1px solid rgba(201,168,76,0.2)' }
            }}/>
            <CookieConsent/>
            <Routes>
              {/* Main site */}
              <Route path="/"              element={<Wrap><HomePage/></Wrap>}/>
              <Route path="/destinations"  element={<Wrap><DestinationsPage/></Wrap>}/>
              <Route path="/destinations/:id" element={<Wrap><DestDetailPage/></Wrap>}/>
              <Route path="/packages"      element={<Wrap><PackagesPage/></Wrap>}/>
              <Route path="/packages/:id"  element={<Wrap><PackageDetailPage/></Wrap>}/>
              <Route path="/services"      element={<Wrap><ServicesPage/></Wrap>}/>
              <Route path="/services/:slug" element={<Wrap><ServiceDetailPage/></Wrap>}/>
              <Route path="/about"         element={<Wrap><AboutPage/></Wrap>}/>
              <Route path="/contact"       element={<Wrap><ContactPage/></Wrap>}/>
              <Route path="/blog"          element={<Wrap><BlogPage/></Wrap>}/>
              <Route path="/blog/:slug"    element={<Wrap><BlogPostPage/></Wrap>}/>
              <Route path="/faq"           element={<Wrap><FAQPage/></Wrap>}/>
              <Route path="/testimonials"  element={<Wrap><TestimonialsPage/></Wrap>}/>
              <Route path="/privacy"       element={<Wrap><PrivacyPage/></Wrap>}/>
              <Route path="/terms"         element={<Wrap><TermsPage/></Wrap>}/>
              <Route path="/policy"        element={<Wrap><PrivacyPage/></Wrap>}/>

              {/* Booking flow */}
              <Route path="/booking"               element={<Wrap><BookingHubPage/></Wrap>}/>
              <Route path="/booking/flights"       element={<Wrap><FlightsPage/></Wrap>}/>
              <Route path="/booking/hotels"        element={<Wrap><HotelsPage/></Wrap>}/>
              <Route path="/booking/pickup"        element={<Wrap><PickupPage/></Wrap>}/>
              <Route path="/booking/passengers"    element={<Wrap><PassengersPage/></Wrap>}/>
              <Route path="/booking/review"        element={<Wrap><ReviewPage/></Wrap>}/>
              <Route path="/booking/confirmation"  element={<Wrap><ConfirmationPage/></Wrap>}/>

              {/* Auth — no main layout */}
              <Route path="/auth/login"            element={<LoginPage/>}/>
              <Route path="/auth/register"         element={<RegisterPage/>}/>
              <Route path="/auth/forgot-password"  element={<ForgotPage/>}/>

              {/* Admin — own layout */}
              <Route path="/admin/*"               element={<AdminLayout/>}/>

              <Route path="*"                      element={<Wrap><NotFoundPage/></Wrap>}/>
            </Routes>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
