import React from "react";

const DynamicContent = ({
  currentSection,
  problems,
  handleProblemChange,
  handleTextWithNumberChange,
  tableData,
  handleTableChange,
  addTableRow,
}) => {
  const renderProblemInputs = () => {
    if (!currentSection || !currentSection.problems) return null;

    return (
        <div className="problem-section">
            <h3 className="section-title">ගැටළුව / අවශ්‍යතාවය</h3>
            {currentSection.problems.map((prob) => {
                switch (prob.type) {
                    case "number":
                        return (
                            <div key={prob.id} className="form-group">
                                <label className="form-label">{prob.label}:</label>
                                <input
                                    type="number"
                                    value={problems[prob.id] || ""}
                                    onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        );
                    case "yesno":
                        return (
                            <div key={prob.id} className="form-group">
                                <label className="form-label">{prob.label}:</label>
                                <select
                                    value={problems[prob.id] || ""}
                                    onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">තෝරන්න</option>
                                    <option value="yes">ඔව්</option>
                                    <option value="no">නැත</option>
                                </select>
                            </div>
                        );
                    case "select":
                        return (
                            <div key={prob.id} className="form-group">
                                <label className="form-label">{prob.label}:</label>
                                <select
                                    value={problems[prob.id] || ""}
                                    onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">තෝරන්න</option>
                                    {prob.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    case "text_with_number":
                        return (
                            <div key={prob.id} className="form-group">
                                <label className="form-label">{prob.label}:</label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        placeholder="විස්තරය"
                                        value={problems[prob.id]?.text || ""}
                                        onChange={(e) => handleTextWithNumberChange(prob.id, "text", e.target.value)}
                                        className="form-control"
                                    />
                                    <input
                                        type="number"
                                        placeholder="සංඛ්‍යාව"
                                        value={problems[prob.id]?.number || ""}
                                        onChange={(e) => handleTextWithNumberChange(prob.id, "number", e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
  };

  const renderTable = () => {
    if (!currentSection || !currentSection.isTable) return null;
    return (
        <div className="table-section">
            <h3 className="section-title">දත්ත වගුව</h3>
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            {currentSection.tableColumns.map((col) => (<th key={col}>{col}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {currentSection.tableColumns.map((col) => (
                                    <td key={col}>
                                        <input
                                            type="text"
                                            value={row[col] || ""}
                                            onChange={(e) => handleTableChange(rowIndex, col, e.target.value)}
                                            className="table-input"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button type="button" onClick={addTableRow} className="btn btn-secondary">
                නව පේළියක් එකතු කරන්න
            </button>
        </div>
    );
  };

  return (
    <>
      {renderProblemInputs()}
      {renderTable()}
    </>
  );
};

export default DynamicContent;