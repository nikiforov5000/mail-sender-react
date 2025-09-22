import React, { useState } from "react";
import { useDeboundceValue } from "../../hooks/useDebounceValue";

function Mailer() {
  const [input, setInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  const handleOnchangeTextArea = (e) => {
    setInput(e.value);
  };

  const handleAddEmail = (e) => {
    if (!emailInput) return;
    e.preventDefault();
    setEmails((prev) => setEmails([...prev, emailInput]));
    setEmailInput("");
  };

  const handleOnChangeEmail = (e) => {
    setEmailInput(e.target.value);
  };

  const renderEmailList = () =>
    emails.map((email) => <p key={email}>{email}</p>);

  return (
    <div className="mailer">
      <input
        value={emailInput}
        type="text"
        onChange={handleOnChangeEmail}
        onSubmit={handleAddEmail}
      />
      <button onClick={handleAddEmail}>Add to list</button>
      <ul>{emails && renderEmailList()}</ul>
      <textarea
        value={input}
        onChange={handleOnchangeTextArea}
        name="textArea"
        id="textArea"
      ></textarea>
    </div>
  );
}

export default Mailer;
