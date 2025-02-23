import { useEffect, useState } from "react";
import axios from "axios";
import Navbar
 from "../components/Navbar";
export default function Records() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await axios.get("http://localhost:5000/records", { withCredentials: true });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch records");
        }

        setRecords(response.data.records);
        setFilteredRecords(response.data.records); // Initialize filtered records
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  // Function to handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = records.filter((record) =>
      Object.values(record).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(query)
      )
    );

    setFilteredRecords(filtered);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
       <Navbar />
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search records..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
      />

      {/* Display Filtered Records */}
      {filteredRecords.length === 0 ? (
        <p>No records found</p>
      ) : (
        filteredRecords.map((record, index) => (
          <div key={index}>
            <p>Entry Type: {record.entry_type}</p>
            <p>Diagnosis Name: {record.diagnosis_name}</p>
            <p>History of Present Illness: {record.history_of_present_illness}</p>
            <p>Treatment Undergone: {record.treatment_undergone}</p>
            <p>Physician Name: {record.physician_name}</p>
            <p>Hospital Name: {record.hospital}</p>
            <p>Place: {record.place}</p>
            <p>Appointment Date: {record.appointment_date}</p>
            <p>Reg No: {record.reg_no}</p>
            <p>Alternative System of Medicine: {record.alternative_system_of_medicine}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}



