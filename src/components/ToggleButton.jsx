import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ToggleButton({ details, setDetails }) {
    const [isOn, setIsOn] = useState(details?.visibility || false);
    const [showPopup, setShowPopup] = useState(false); // ✅ State for pop-up
    const navigate = useNavigate();  // ✅ To redirect after logout

    useEffect(() => {
        setIsOn(details?.visibility || false);
    }, [details]);

    const toggle = async () => {
        const newVisibility = !isOn;

        try {
            const response = await axios.post("http://localhost:5000/update-visibility", {
                visibility: newVisibility,
            }, { withCredentials: true });

            if (response.data.success) {
                setDetails(prev => ({
                    ...prev,
                    visibility: response.data.visibility,
                    sdc_code: response.data.sdc_code, // Updated from trigger
                }));

                // ✅ If `sdc_code` changes, show pop-up and log out after 5 seconds
                if (response.data.sdc_code !== details?.sdc_code) {
                    setShowPopup(true); // Show pop-up

                    setTimeout(async () => {
                        await axios.post("http://localhost:5000/logout", { withCredentials: true });
                        navigate("/");  // Redirect to login page
                    }, 5000); // 5 seconds delay
                }
            } else {
                console.error("Failed to update visibility.");
            }
        } catch (error) {
            console.error("Error updating visibility:", error);
        }

        setIsOn(newVisibility);
    };

    return (
        <div style={{ position: "relative" }}>
            <button 
                onClick={toggle} 
                style={{
                    padding: "10px 20px",
                    backgroundColor: isOn ? "green" : "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px"
                }}
            >
                {isOn ? "ON" : "OFF"}
            </button>

            {/* ✅ Pop-up Message */}
            {showPopup && (
                <div 
                    style={{
                        position: "absolute",
                        top: "50px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "black",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)"
                    }}
                >
                    Your visibility is updated. Logging out...
                </div>
            )}
        </div>
    );
}
