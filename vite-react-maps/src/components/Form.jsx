import React from "react";

const Form = ({ handleSubmit, inputRef }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <br />
        <label>Or find Some Food By Name</label>
        <input ref={inputRef} />
        <button type="submit">Search</button>
      </form>
    </>
  );
};

export default Form;
