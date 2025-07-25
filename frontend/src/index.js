import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center" // Position of the toasts
        reverseOrder={false} // Order of toasts (newest on top)
        gutter={8} // Space between toasts
        containerClassName="" // Additional class for the container
        containerStyle={{
          // Custom style for the toaster container
          top: 20,
          right: 20,
        }}
        toastOptions={{
          // Default options for all toasts
          className: '', // Additional class for individual toast
          duration: 5000, // Default duration for toasts

          // Styling for success toasts
          success: {
            iconTheme: {
              primary: '#10B981', // Green icon
              secondary: '#ECFDF5', // Light background for icon
            },
            style: {
              background: '#065F46', // Dark green background
              color: '#ECFDF5',     // Light text color
              border: '1px solid #10B981', // Green border
              borderRadius: '8px', // Rounded corners
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow
            },
          },

          // Styling for error toasts
          error: {
            iconTheme: {
              primary: '#EF4444', // Red icon
              secondary: '#FEF2F2', // Light background for icon
            },
            style: {
              background: '#991B1B', // Dark red background
              color: '#FEF2F2',     // Light text color
              border: '1px solid #EF4444', // Red border
              borderRadius: '8px', // Rounded corners
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow
            },
          },

          // Styling for loading toasts
          loading: {
            iconTheme: {
              primary: '#3B82F6', // Blue icon
              secondary: '#EFF6FF', // Light background for icon
            },
            style: {
              background: '#1E40AF', // Dark blue background
              color: '#EFF6FF',     // Light text color
              border: '1px solid #3B82F6', // Blue border
              borderRadius: '8px', // Rounded corners
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow
            },
          },

          // Styling for general toasts (used for custom toasts if no specific type is matched)
          style: {
            background: '#2D3748', // Dark grey background
            color: '#E2E8F0',     // Light grey text color
            border: '1px solid #4A5568', // Grey border
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
