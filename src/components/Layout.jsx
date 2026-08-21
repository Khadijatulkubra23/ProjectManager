import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b1224] text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 bg-[#0b1224] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout