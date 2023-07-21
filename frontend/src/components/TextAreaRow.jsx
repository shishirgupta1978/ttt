import React, { useState } from 'react';





export const TextAreaRow = (props) => {
  const [figure, setFigure] = useState(props.figure);
  const [editMode, setEditMode] = useState(false);

  const handleTextArea1Change = (event) => {
    setFigure({ ...figure, alt_text1: event.target.value });
    props.onTextAreaChange(props.figure.id, event.target.value);
  };

  const handleTextArea2Change = (event) => {
    setFigure({ ...figure, alt_text2: event.target.value });
    props.onTextAreaChange(props.figure.id, event.target.value);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
  };

  const handleTextAreaSelection = (event) => {
    setFigure({ ...figure, is_alt_text1_selected: Number(event.target.value) === 1 ? true : false });
    props.onTextAreaChange(props.figure.id, event.target.value);
  };

  return (
    <tr key={figure.id}>
      <td colSpan="2" style={{ verticalAlign: "middle", padding: "20px" }}>
        {figure.number}
      </td>
      <td colSpan="2" style={{ verticalAlign: "middle", padding: "20px" }}>
        <input
          type="radio"
          value={1}
          checked={figure.is_alt_text1_selected === true}
          onChange={handleTextAreaSelection}
        />&nbsp;&nbsp;&nbsp;Alt&nbsp;Text&nbsp;1
        <br />
        <input
          type="radio"
          value={0}
          checked={figure.is_alt_text1_selected === false}
          onChange={handleTextAreaSelection}
        />&nbsp;&nbsp;&nbsp;Alt&nbsp;Text&nbsp;2
      </td>
      <td colSpan="4" style={{ verticalAlign: "middle", padding: "20px" }}>
        {figure.is_alt_text1_selected === true ? (
          <textarea
            value={figure.alt_text1}
            style={{ padding: "10px", margin: "0px", border: "0" }}
            onChange={handleTextArea1Change}
            readOnly={!editMode}
            rows={3}
            cols={40}
          />
        ) : (
          <textarea
            value={figure.alt_text2}
            style={{ padding: "10px", margin: "0px", border: "0" }}
            onChange={handleTextArea2Change}
            readOnly={!editMode}
            rows={3}
            cols={40}
          />
        )}
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {editMode ? (
          <button className="btn btn-outline-primary" onClick={handleSaveClick}>
            Save
          </button>
        ) : (
          <button className="btn btn-outline-primary" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};


