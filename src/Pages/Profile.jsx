import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import ToggleButton from "../components/ToggleButton";

export default function Profile() {
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLogout = async () => {
        await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
        navigate("/"); 
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

                    // ✅ Fix: Ensure photo is a valid Base64 image
                    if (detailsData.photo) {
                        detailsData.photo = `data:image/jpeg;base64,${detailsData.photo}`;
                    }

                    setDetails(detailsData);
                } else {
                    setError(true); // Set error if no details found
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
        <div>
            <Navbar />
            <div>
                {loading ? (
                    <p>Loading profile...</p>
                ) : error || !details ? (
                    <p style={{ color: "red" }}>Error loading profile. Please try again.</p>
                ) : (
                    <>
                        <h2>{details.full_name || "N/A"}</h2>
                        <p>Date of Birth: {formatDate(details?.date_of_birth)}</p>
                        <p>Gender: {details?.gender || "N/A"}</p>
                        <p>Age: {details?.age || "N/A"}</p>
                        <p>Phone: {details?.phone_no || "N/A"}</p>
                        <p>Mail: {details?.email || "N/A"}</p>
                        <p>Address: {details?.address || "N/A"}</p>
                        <button>Edit Details</button>

                        <div>
                            {details.photo ? (
                                <img 
                                    src={details.photo} 
                                    alt="Profile Pic" 
                                    style={{ width: "150px", height: "150px", borderRadius: "50%" }} 
                                />
                            ) : (
                                <p style={{ color: "gray" }}>No profile picture available</p>
                            )}
                        </div>

                        <button onClick={handleLogout}>Logout</button>

                        <div>
                            <p>SDC Code: {details?.sdc_code || "Not Assigned"}</p>
                            <p>Account Visibility: </p>
                            <ToggleButton details={details} setDetails={setDetails} />
                            <p>QR Code: </p>
                            <QRCodeCanvas 
                                value={details?.qr_code || "default-value"} 
                                size={200}   
                                bgColor="#ffffff" 
                                fgColor="#000000" 
                                level="H"   
                            />
                        </div>
                    </>
                )}
            </div>
            <div>
                <h1>About us</h1>
                <p>At Medvion, we are dedicated to creating a platform that caters to all your needs. Our mission is to simplify and enhance your experience by providing innovative solutions tailored to your unique requirements. Whether you&apos;re looking for convenience, efficiency, or reliability, Medvion is here to empower you every step of the way.</p>
            </div>
        </div>
    );
}
