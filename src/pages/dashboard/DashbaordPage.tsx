import Dashboard from "../../components/dashboard/Dashboard"
import Footer from "../../components/footer/Footer"
import Header from "../../components/header/Header"

const DashboardPage=()=>{
    return(
         <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
        <Dashboard />
          <Footer />

      </div>
    )
}

export default DashboardPage;