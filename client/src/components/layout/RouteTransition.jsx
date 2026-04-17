import { useLocation } from "react-router-dom";

export const RouteTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="route-fade-in">
      {children}
    </div>
  );
};
