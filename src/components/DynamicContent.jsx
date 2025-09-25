import React from "react";

const DynamicContent = ({
    currentSection,
    problems,
    handleProblemChange,
    handleTextWithNumberChange,
    tableData,
    handleTableChange,
    handleHybridTableChange,
    addTableRow,
    addOtherRow,
    deleteOtherRow,
        secondaryTableData,
   addSecondaryTableRow,
    handleSecondaryTableChange,
    deleteTableRow,
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
    if (!currentSection || (!currentSection.isTable && !currentSection.isHybridTable)) {
        return null;
    }

    // Renders BOTH the fully fixed and the semi-fixed tables
    if (currentSection.isHybridTable) {
        return (
            <div className="table-section">
                <h3 className="section-title">දත්ත වගුව</h3>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>{currentSection.fixedColumnHeader}</th>
                                {currentSection.tableColumns.map((col) => (<th key={col}>{col}</th>))}
                                {/* Add an empty header ONLY if there's a dynamic part */}
                                {currentSection.dynamicRow && <th style={{ width: '120px' }}></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render the main fixed rows */}
                            {currentSection.mainRows.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.label}</td>
                                    {currentSection.tableColumns.map((col) => (
                                        <td key={col}>
                                            <input
                                                type="text"
                                                value={(tableData?.fixed?.[row.id]?.[col]) || ""}
                                                onChange={(e) => handleHybridTableChange('fixed', row.id, col, e.target.value)}
                                                className="table-input"
                                            />
                                        </td>
                                    ))}
                                    {/* Add an empty cell to align columns ONLY if there's a dynamic part */}
                                    {currentSection.dynamicRow && <td></td>}
                                </tr>
                            ))}
                            {/* Conditionally Render the dynamic "Other" rows ONLY if a dynamicRow is defined */}
                            {currentSection.dynamicRow && tableData?.dynamic?.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder={currentSection.dynamicRow.placeholder}
                                            value={row.description || ""}
                                            onChange={(e) => handleHybridTableChange('dynamic', row.id, 'description', e.target.value)}
                                            className="table-input"
                                        />
                                    </td>
                                    {currentSection.tableColumns.map((col) => (
                                        <td key={col}>
                                            <input
                                                type="text"
                                                value={row[col] || ""}
                                                onChange={(e) => handleHybridTableChange('dynamic', row.id, col, e.target.value)}
                                                className="table-input"
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        {tableData.dynamic.length > 1 && (
                                            <button type="button" onClick={() => deleteOtherRow(row.id)} className="btn btn-danger">
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Conditionally Render the button ONLY if a dynamicRow is defined */}
                {currentSection.dynamicRow && (
                    <button type="button" onClick={addOtherRow} className="btn btn-secondary" style={{ marginTop: '10px' }}>
                        Add Other Row
                    </button>
                )}
            </div>
        );
    }

    // Renders the original, simple dynamic tables
    if (currentSection.isTable) {
        return (
            <div className="table-section">
                <h3 className="section-title">දත්ත වගුව</h3>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {currentSection.tableColumns.map((col) => (<th key={col}>{col}</th>))}
                                {currentSection.canDeleteRows && <th style={{ width: '120px' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(tableData) && tableData.map((row, rowIndex) => (
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
                                    {currentSection.canDeleteRows && (
                                        <td>
                                            <button type="button" onClick={() => deleteTableRow(rowIndex)} className="btn btn-danger">
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" onClick={addTableRow} className="btn btn-secondary" style={{ marginTop: '10px' }}>
                    නව පේළියක් එකතු කරන්න
                </button>
            </div>
        );
    }

    return null;
};

    const renderExtraFields = () => {
        if (!currentSection || !currentSection.extraFields) {
            return null;
        }

        return (
            <div className="extra-fields-section" style={{ marginTop: '20px' }}>
                {currentSection.extraFields.map((field) => (
                    <div key={field.id} className="form-group">
                        <label className="form-label">{field.label}:</label>
                        <input
                            type={field.type}
                            value={problems[field.id] || ""}
                            onChange={(e) => handleProblemChange(field.id, e.target.value)}
                            className="form-control"
                        />
                    </div>
                ))}
            </div>
        );
    };

const renderSecondaryTable = () => {
        if (!currentSection || !currentSection.secondaryTable) {
            return null;
        }

        const secondaryTableConfig = currentSection.secondaryTable;

        return (
            <div className="table-section" style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                {/* You can add a title here if you want, e.g., <h3 className="section-title">Additional Info</h3> */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {secondaryTableConfig.tableColumns.map((col) => (<th key={col}>{col}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {secondaryTableData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {secondaryTableConfig.tableColumns.map(col => (
                                        <td key={col}>
                                            <input
                                                type="text"
                                                value={row[col] || ""}
                                                onChange={(e) => handleSecondaryTableChange(rowIndex, col, e.target.value)}
                                                className="table-input"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" onClick={addSecondaryTableRow} className="btn btn-secondary" style={{ marginTop: '10px' }}>
                    නව පේළියක් එකතු කරන්න
                </button>
            </div>
        );
    };
        
    // (Removed duplicate code block outside of function)

    return (
        <>
            {renderProblemInputs()}
            {renderTable()}
            {renderExtraFields()}
            {renderSecondaryTable()}
        </>
    );
};

export default DynamicContent;