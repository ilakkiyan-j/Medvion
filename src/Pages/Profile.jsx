import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import ToggleButton from "../components/ToggleButton";
import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    useEffect(() => {
        async function fetchDetails() {
            try {
                const response = await axios.get("http://localhost:5000/details", { withCredentials: true });

                if (response.data.details) {
                    const detailsData = response.data.details;

                    // Ensure the photo is properly formatted
                    if (detailsData.photo) {
                        detailsData.photo = `data:image/jpeg;base64,${detailsData.photo}`;
                    }

                    setDetails(detailsData);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                setError(true);
                if (error.response?.status === 400) navigate("/");
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-content">
                    {loading ? (
                        <p className="loading-text">Loading profile...</p>
                    ) : error || !details ? (
                        <p className="error-text">Error loading profile. Please try again.</p>
                    ) : (
                        <div className="grid-1">
                             <div className="grid-2">
                        <div className="profile-card">
                            <h2 className="profile-name">{details.full_name || "N/A"}</h2>
                            <p className="profile-info">Date of Birth: {formatDate(details.date_of_birth)}</p>
                            <p className="profile-info">Gender: {details.gender || "N/A"}</p>
                            <p className="profile-info">Age: {details.age || "N/A"}</p>
                            <p className="profile-info">Phone: {details.phone_no || "N/A"}</p>
                            <p className="profile-info">Mail: {details.email || "N/A"}</p>
                            <p className="profile-info">Address: {details.address || "N/A"}</p>
                            <button className="edit-btn">Edit Details</button>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </div>

                            <div className="emergency-details">
                                <h3 className="section-title">Emergency Details</h3>
                                <p className="profile-info">Name: {details.emg_name}</p>
                                <p className="profile-info">Phone: {details.emg_phone}</p>
                                <p className="profile-info">Address: {details.emg_address}</p>
                                <p className="profile-info">Relation: {details.relation}</p>
                                <button className="edit-btn">Edit Details</button>
                            </div>

                           </div>
                            <div className="account-details">
                                <p className="profile-info">SDC Code: {details.sdc_code || "Not Assigned"}</p>
                                <div className="visibility-toggle">
                                    <p className="profile-info">SDC Card Visibility:</p>
                                    <ToggleButton details={details} setDetails={setDetails} />
                                </div>
                                <p className="profile-info">QR Code:</p>
                                <QRCodeCanvas
                                    value={details.qr_code || "default-value"}
                                    size={200}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="H"
                                    className="qr-code"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="about-section">
                    <h1 className="about-title">About Us</h1>
                    <p className="about-text">
                        At Medvion, we are dedicated to creating a platform that caters to all your needs.
                        Our mission is to simplify and enhance your experience by providing innovative solutions
                        tailored to your unique requirements. Whether you're looking for convenience, efficiency,
                        or reliability, Medvion is here to empower you every step of the way.
                    </p>
                </div>
            </div>
        </>
    );
}
