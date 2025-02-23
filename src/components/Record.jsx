export default function Record(props) {
  return (
    <div>
      <div>
        <p>Entry Type: {props.entry_type}</p>
        <p>Diagnosis Name: {props.diagnosis_name}</p>
        <p>History of Present Illness: {props.history_of_present_illness}</p>
        <p>Treatment Undergone: {props.treatment_undergone}</p>
        <p>Physician Name: {props.physician_name}</p>
        <p>Hospital Name: {props.hospital}</p>
        <p>Place: {props.place}</p>
        <p>Appointment Date: {props.appointment_date}</p>
        <p>Reg No: {props.reg_no}</p>
        <p>Alternative System of Medicine: {props.alternative_system_of_medicine}</p>
      </div>

      {/* {props.hospitalized && (
        <div>
          <h3>Hospitalization Details</h3>
          <p>Hospitalized Duration: {props.hospitalized_duration}</p>
          <p>Reason for Hospitalization: {props.reason_for_hospitalization}</p>
          <p>Bed No: {props.bed_no}</p>
          <p>Treatment Undergone: {props.treatment_undergone}</p>
        </div>
      )}

      {props.surgery && (
        <div>
          <h3>Surgery Details</h3>
          <p>Surgery Type: {props.surgery_type}</p>
          <p>Surgery Duration: {props.surgery_duration}</p>
          <p>Surgery Outcome: {props.surgery_outcome}</p>
          <p>Diagnosis: {props.diagnosis}</p>
          <p>Bed No: {props.surgery_bed_no}</p>
        </div>
      )}

      {props.medicines && props.name_of_the_medicines?.length > 0 && (
        <div>
          <h3>Medicines Provided</h3>
          {props.name_of_the_medicines.map((medicine, i) => (
            <p key={i}>
              {medicine}: {props.intake_per_day[i]}
            </p>
          ))}
        </div>
      )}

      {props.prescriptions && (
        <div>
          <h3>Prescriptions</h3>
          <iframe width="100%" height="600px" src={`data:application/pdf;base64,${props.prescriptions}`} />
        </div>
      )}

      {props.lab_results && (
        <div>
          <h3>Lab Results</h3>
          <iframe width="100%" height="600px" src={`data:application/pdf;base64,${props.lab_results}`} />
        </div>
      )} */}
    </div>
  );
}
