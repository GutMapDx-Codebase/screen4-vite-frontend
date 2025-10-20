import React, { useState } from "react";

const DashboardTable = () => {
  // Initial state for checkboxes
  const [formData, setFormData] = useState({});

  // Handle checkbox change
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Calculate total "Screen" and "Confirm" counts
  const totalScreen = Object.keys(formData).filter((key) => key.includes("Screen") && formData[key]).length;
  const totalConfirm = Object.keys(formData).filter((key) => key.includes("Confirm") && formData[key]).length;

  return (
    <div>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan="6"
              style={{ border: "1px solid black", padding: "8px" }}
            >
              Laboratory Tests (Please tick tests required)
            </th>
            <th
              colSpan="1"
              style={{ border: "1px solid black", padding: "8px" }}
            ></th>
            <th
              colSpan="1"
              style={{ border: "1px solid black", padding: "8px" }}
            >
              Screen
            </th>
            <th
              colSpan="1"
              style={{ border: "1px solid black", padding: "8px" }}
            >
              Confirm
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["", "screen", "confirm", "", "Methamphetamine"],
            ["Alcohol", "", "", "Cocaine", "Morphine"],
            ["Amphetamines", "", "", "Ketamine", "Network Rail Std"],
            ["Benzodiazepines", "", "", "Maritime Std", "Opiates"],
            ["Buprenorphine", "", "", "MDMA", "SSRI"],
            ["Blood", "", "", "Methadone", "TCA"],
            ["Other (Please Specify)", "", "", "", "THC"],
          ].map(([leftTest, a, b, rightTest, c], index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {leftTest}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {index !== 0 && (
                  <input
                    type="checkbox"
                    name={`${leftTest.split(" ")[0]}Screen`}
                    checked={formData[`${leftTest.split(" ")[0]}Screen`] || false}
                    onChange={handleChange}
                  />
                )}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {index !== 0 && (
                  <input
                    type="checkbox"
                    name={`${leftTest.split(" ")[0]}Confirm`}
                    checked={formData[`${leftTest.split(" ")[0]}Confirm`] || false}
                    onChange={handleChange}
                  />
                )}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {rightTest}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {index !== 0 && index !== 7 && (
                  <input
                    type="checkbox"
                    name={`${rightTest.split(" ")[0]}Screen`}
                    checked={formData[`${rightTest.split(" ")[0]}Screen`] || false}
                    onChange={handleChange}
                  />
                )}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {index !== 0 && index !== 7 && (
                  <input
                    type="checkbox"
                    name={`${rightTest.split(" ")[0]}Confirm`}
                    checked={formData[`${rightTest.split(" ")[0]}Confirm`] || false}
                    onChange={handleChange}
                  />
                )}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{c}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <input
                  type="checkbox"
                  name={`${c.split(" ")[0]}Screen`}
                  checked={formData[`${c.split(" ")[0]}Screen`] || false}
                  onChange={handleChange}
                />
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <input
                  type="checkbox"
                  name={`${c.split(" ")[0]}Confirm`}
                  checked={formData[`${c.split(" ")[0]}Confirm`] || false}
                  onChange={handleChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display Total Counts */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>Total Screen: {totalScreen}</h3>
        <h3>Total Confirm: {totalConfirm}</h3>
      </div>
    </div>
  );
};

export default DashboardTable;
