import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { Login } from "../pages/auth/Login";
import { RegisterAccount } from "../pages/auth/Signup";
import Home from "../pages/home/Home";
import Scanner from "../pages/home/Scanner";
import AllScans from "../pages/home/AllScans";
import { Reset } from "../pages/auth/reset";
import Analysis from "../pages/home/Analysis";
import StrategyGen from "../pages/home/StrategyGen";
import { Verify } from "../pages/auth/verify";
import Premium from "../pages/home/Premium";
import GetPremium from "../pages/home/GetPremium";
import FreeTrial from "../pages/home/FreeTrial";
import GetPremiumCanceled from "../pages/home/GetPremiumCanceled";
import GetPremiumSuccess from "../pages/home/GetPremiumSuccess";
import { ResetPass } from "../pages/auth/Changepasword";
import AdminprotectedRoutes from "./AdminprotectedRoutes";
import SignalRoom from "../pages/home/SignalRoom";
import ComminSoon from "../pages/home/ComminSoon";
import SignalLab from "../pages/home/SignalLab";
import Allsavedsignal from "../pages/home/Allsavedsignal";
import AllSavedStrategies from "../pages/home/AllSavedStrategies";
import StrategyDetail from "../pages/home/StrategyDetail";
import ProChartAnalysis from "../pages/home/ProChartAnalysis";
import ScrollToTop from "../components/generic/ScrollToTop";
import TermsConditions from "../pages/legal/TermsConditions";

export default () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="" element={<Home />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="allscans" element={<AllScans />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="signalroom" element={<SignalRoom />} />
          <Route path="strategy" element={<StrategyGen />} />
          <Route path="trades" element={<Scanner />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="pro-chart" element={<ProChartAnalysis />} />
          <Route path="premium" element={<Premium />} />
          <Route path="comingsoon" element={<ComminSoon />} />
          <Route path="aisignallab" element={<SignalLab />} />
          <Route path="saved-signals" element={<Allsavedsignal />} />
          <Route path="saved-strategies" element={<AllSavedStrategies />} />
          <Route path="strategy/:id" element={<StrategyDetail />} />
          <Route path="comingsoon" element={<ComminSoon />} />
        </Route>
        <Route path="/adminpanel/*" element={<AdminprotectedRoutes />} />
        <Route path="getpremium" element={<GetPremium />} />
        <Route path="freetrial" element={<FreeTrial />} />
        <Route path="premiumcanceled" element={<GetPremiumCanceled />} />
        <Route path="premiumsuccess" element={<GetPremiumSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterAccount />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/verify/:id" element={<Verify />} />
        <Route path="/resetpass/:id" element={<ResetPass />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
      </Routes>
    </Router>
  );
};
