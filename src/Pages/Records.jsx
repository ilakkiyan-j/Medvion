import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRecords, setExpandedRecords] = useState({});
  const [pdfUrls, setPdfUrls] = useState({});

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await axios.get("http://localhost:5000/records", {
          withCredentials: true,
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch records");
        }

        setRecords(response.data.records);
        setFilteredRecords(response.data.records);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = records.filter((record) =>
      Object.values(record).some(
        (value) => value && value.toString().toLowerCase().includes(query)
      )
    );

    setFilteredRecords(filtered);
  };

  const toggleDetails = (index) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Convert Bytea (binary data) to a downloadable PDF Blob
  const convertToPdfUrl = (byteaData, index, type) => {
    if (!byteaData) return;

    const byteArray = new Uint8Array(byteaData.data); // Convert Buffer to Uint8Array
    const blob = new Blob([byteArray], { type: "application/pdf" }); // Create Blob
    const url = URL.createObjectURL(blob);

    setPdfUrls((prevUrls) => ({
      ...prevUrls,
      [`${type}-${index}`]: url,
    }));
  };

  useEffect(() => {
    // Convert prescriptions & lab results for each record
    filteredRecords.forEach((record, index) => {
      if (record.prescriptions) {
        convertToPdfUrl(record.prescriptions, index, "prescriptions");
      }
      if (record.lab_results) {
        convertToPdfUrl(record.lab_results, index, "lab_results");
      }
    });

    return () => {
      // Revoke all generated URLs when component unmounts
      Object.values(pdfUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filteredRecords]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar />
      <input
        type="text"
        placeholder="Search records..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
      />

      {filteredRecords.length === 0 ? (
        <p>No records found</p>
      ) : (
        filteredRecords.map((record, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Physician Name:</strong> {record.physician_name}</p>
            <p><strong>Hospital Name:</strong> {record.hospital}</p>
            <p><strong>Place:</strong> {record.place}</p>
            <p><strong>Appointment Date:</strong> {record.appointment_date}</p>

            <button onClick={() => toggleDetails(index)}>
              {expandedRecords[index] ? "Hide Details" : "Show Details"}
            </button>

            {expandedRecords[index] && (
              <div style={{ marginTop: "10px", background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>
                <details>
                  <summary><strong>General Information</strong></summary>
                  <p>Entry Type: {record.entry_type}</p>
                  <p>Diagnosis Name: {record.diagnosis_name}</p>
                  <p>History of Present Illness: {record.history_of_present_illness}</p>
                  <p>Treatment Undergone: {record.treatment_undergone}</p>
                  <p>Reg No: {record.reg_no}</p>
                  <p>Alternative System of Medicine: {record.alternative_system_of_medicine}</p>
                </details>

                {record.hospitalized && (
                  <details>
                    <summary><strong>Hospitalization Details</strong></summary>
                    <p>Hospitalized Duration: {record.hospitalized_duration}</p>
                    <p>Reason for Hospitalization: {record.reason_for_hospitalization}</p>
                    <p>Bed No: {record.bed_no}</p>
                    <p>Treatment Undergone: {record.treatment_undergone}</p>
                  </details>
                )}

                {record.surgery && (
                  <details>
                    <summary><strong>Surgery Details</strong></summary>
                    <p>Surgery Type: {record.surgery_type}</p>
                    <p>Surgery Duration: {record.surgery_duration}</p>
                    <p>Surgery Outcome: {record.surgery_outcome}</p>
                    <p>Diagnosis: {record.diagnosis}</p>
                    <p>Bed No: {record.surgery_bed_no}</p>
                  </details>
                )}

                {record.medicines && record.name_of_the_medicines?.length > 0 && (
                  <details>
                    <summary><strong>Medicines Provided</strong></summary>
                    {record.name_of_the_medicines.map((medicine, i) => (
                      <p key={i}>
                        {medicine}: {record.intake_per_day[i]}
                      </p>
                    ))}
                  </details>
                )}

                {record.prescriptions && pdfUrls[`prescriptions-${index}`] && (
                  <details>
                    <summary><strong>Prescriptions</strong></summary>
                    <iframe width="100%" height="400px" src={pdfUrls[`prescriptions-${index}`]} />
                    <a href={pdfUrls[`prescriptions-${index}`]} download="Prescription.pdf">
                      Download Prescription
                    </a>
                  </details>
                )}

                {record.lab_results && pdfUrls[`lab_results-${index}`] && (
                  <details>
                    <summary><strong>Lab Results</strong></summary>
                    <iframe width="100%" height="400px" src={pdfUrls[`lab_results-${index}`]} />
                    <a href={pdfUrls[`lab_results-${index}`]} download="Lab_Results.pdf">
                      Download Lab Results
                    </a>
                  </details>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
