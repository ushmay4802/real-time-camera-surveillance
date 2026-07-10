import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyOtp from "../pages/VerifyOtp/VerifyOtp";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import CameraSettings from "../pages/CameraSettings/CameraSettings";
import ProtectedRoute from "./ProtectedRoute";
import Alerts from "../pages/Alerts/Alerts";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/verify-otp" element={<VerifyOtp />} />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/camera-settings"
                        element={<CameraSettings />}
                    />

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
