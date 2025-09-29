import { useState } from "react";
import "./Mailer.css";

function Mailer() {
  const [html, setHtml] = useState("");
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [subject, setSubject] = useState("");

  const handleOnChangeHtml = (e) => {
    console.log(html);
    setHtml(e.target.value);
  };

  const handleAddToEmails = (e) => {
    if (!newEmail) return;
    e.preventDefault();
    setEmails((prev) => [...prev, newEmail]);
    setNewEmail("");
  };

  const handleOnChangeNewEmail = (e) => {
    setNewEmail(e.target.value.trim());
  };

  const renderEmails = () => emails.map((email) => <p key={email}>{email}</p>);

  const handleSendHtml = async () => {
    try {
      console.log(`handleSendHtml:${html}`);
      const response = await fetch(
        "https://autoex.kz/phpmailer/api/sendmail.php",
        {
          method: "POST",
          body: JSON.stringify({
            emails,
            subject,
            html,
          }),
        }
      );

      // try JSON
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response from server:", text);
        return;
      }

      console.log("Server response:", data);
      if (!data.success) {
        console.error("Mailer error:", data.message);
      }
      alert("Mail sent successfully.");
      setEmails([]);
      setNewEmail("");
      setHtml("");
      setSubject("");
    } catch (error) {
      console.error(`Error sending: ${error}`);
    }
  };

  return (
    <div className="mailer">
      <div className="email-input-container">
        <input
          placeholder="Enter emails here + Add button"
          value={newEmail}
          type="text"
          onChange={handleOnChangeNewEmail}
          onSubmit={handleAddToEmails}
        />
        <button onClick={handleAddToEmails}>Add to list</button>
      </div>
      <ul>{emails && renderEmails()}</ul>
      <input
        placeholder="Subject"
        value={subject}
        type="text"
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Enter html here..."
        value={html}
        onChange={handleOnChangeHtml}
        name="textArea"
        id="textArea"
      ></textarea>
      <button onClick={handleSendHtml}>Send</button>
    </div>
  );
}

export default Mailer;
