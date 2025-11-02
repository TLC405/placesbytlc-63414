import { CyberpunkLoadingScreen } from "./CyberpunkLoadingScreen";

export const PlacesLoadingSkeleton = () => {
  return (
    <CyberpunkLoadingScreen 
      text="LOADING PLACES" 
      subtext="Scanning database for locations"
    />
  );
};
