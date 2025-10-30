import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionForm from "./pages/TransactionForm";
import Documentation from "./pages/Documentation";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="dashboard" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Transactions */}
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/new" element={<TransactionForm />} />
            <Route path="transactions/:id/edit" element={<TransactionForm />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboardd" element={<Dashboard />} />
          <Route path="/docs" element={<Documentation />} />

        </Routes>
      </Router>
    </>
  );
}


// import React from "react";
// // import "./App.css";
// import { Routes, Route, Navigate, useLocation } from "react-router";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";

// export default function App() {
//   const location = useLocation();

//   // Hide Navbar and Header on login page
//   const isLoginPage = location.pathname === "/login";

//   return (
//     <>
//       {!isLoginPage && (
//         <>
//           <h1 className="text-3xl font-bold text-blue-600 underline text-center mt-4">
//             Hello, Budget Tracker!
//           </h1>
//           <Navbar />
//         </>
//       )}

//       <div style={{ padding: !isLoginPage ? 16 : 0 }}>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<ProtectedRoute />}>
//             <Route index element={<Navigate to="/dashboard" replace />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="transactions" element={<Transactions />} />
//           </Route>
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </>
//   );
// }
