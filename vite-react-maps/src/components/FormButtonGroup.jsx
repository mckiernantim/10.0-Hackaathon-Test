import React from 'react';

const FormButtonGroup = ({handleClick, buttonList}) => {
    return (
        <div>
            {buttonList.map((option, ind) => (
            <button key={ind} value={option} onClick={(e) => handleClick(e)}>
              {" "}
              {option}{" "}
            </button>
          ))}
        </div>
    );
}

export default FormButtonGroup;
