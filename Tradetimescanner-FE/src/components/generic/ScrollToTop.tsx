import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset window scroll (for non-protected routes or global overflow)
        window.scrollTo(0, 0);

        // Reset internal scroll containers (specifically for the main content area in ProtectedRoute)
        const scrollContainers = document.querySelectorAll('.overflow-y-auto');
        scrollContainers.forEach(container => {
            container.scrollTop = 0;
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
