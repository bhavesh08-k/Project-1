import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import { ScrollToTop } from './ScrollToTop'

export default function Layout() {
  return (
    <div className="page-shell">
      <ScrollToTop />
      <div className="demo-banner">Demo booking system — mock data, localStorage only. No real payments.</div>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
