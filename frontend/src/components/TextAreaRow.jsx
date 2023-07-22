import React, { useState } from 'react';




export const TextAreaRow = (props) => {
  const [figure, setFigure1] = useState(props.figure);
  const [editMode, setEditMode] = useState(false);

  const handleTextareaChange = (event, figureId) => {
    const { value } = event.target;
    props.setFigures((prevFigures) => {
      const updatedFigures = prevFigures.map((figure) => {
        if (figure.id === figureId) {
          return {
            ...figure,
            alt_text1: value,
          };
        }
        return figure;
      });
      return updatedFigures;
    });
  };

  const handleTextareaChange2 = (event, figureId) => {
    const { value } = event.target;
    props.setFigures((prevFigures) => {
      const updatedFigures = prevFigures.map((figure) => {
        if (figure.id === figureId) {
          return {
            ...figure,
            alt_text2: value,
          };
        }
        return figure;
      });
      return updatedFigures;
    });
  };


  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
  };

  const handleTextAreaSelection = (event,figureId) => {

    const { value } = event.target;
    props.setFigures((prevFigures) => {
      const updatedFigures = prevFigures.map((figure) => {
        if (figure.id === figureId) {
          return {
            ...figure,
            is_alt_text1_selected: Number(value) == 1 ? true : false,
          };
        }
        return figure;
      });
      return updatedFigures;
    });


    props.setFigure({ ...figure, is_alt_text1_selected: Number(event.target.value) === 1 ? true : false });
//    props.handleTextAreaSelection(props.figure.id, event.target.value);
  };

  return (
    <tr key={props.figure.id}>
      <td colSpan={2} style={{ verticalAlign: "middle" }}>
        {props.figure.number}
      </td>
      <td style={{ verticalAlign: "middle", width:'140px' }}>
        <input
          type="radio"
          value={1}
          checked={props.figure.is_alt_text1_selected === true}
          onChange={(event) => handleTextAreaSelection(event, figure.id)}
        />&nbsp;&nbsp;&nbsp;Alt&nbsp;Text&nbsp;1
        <br />
        <input
          type="radio"
          value={0}
          checked={props.figure.is_alt_text1_selected == false}
          onChange={(event) => handleTextAreaSelection(event, figure.id)}
        />&nbsp;&nbsp;&nbsp;Alt&nbsp;Text&nbsp;2
      </td>
      <td colSpan={4} style={{ verticalAlign: "middle", paddingLeft: "20px" }}>
        {props.figure.is_alt_text1_selected == true ? (
          <textarea
            value={props.figure.alt_text1}
            style={{ padding: "5px", margin: "0px", border: "0", width:'100%' }}
            onChange={(event) => handleTextareaChange(event, figure.id)}
            readOnly={!editMode}
            rows={2}
          />
        ) : (
          <textarea
            value={props.figure.alt_text2}
            style={{ padding: "5px", margin: "0px", border: "0", width:'100%' }}
            onChange={(event) => handleTextareaChange2(event, figure.id)}
            readOnly={!editMode}
            rows={2}
          />
        )}
      </td>
      <td  style={{ verticalAlign: "middle",width:'130px' }}>
        {editMode ? (
          <button className="btn btn-outline-secondary" onClick={handleSaveClick}>
            Save
          </button>
        ) : (
          <button className="btn btn-outline-secondary" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};


