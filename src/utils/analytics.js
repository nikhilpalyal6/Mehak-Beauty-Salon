import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || "G-WTTMTLHJ6X";

export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  } else {
    console.warn("GA ID not found in environment variables.");
  }
};

export const pageView = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
    });
  }
};

export const trackEvent = (category, action, label = "") => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};