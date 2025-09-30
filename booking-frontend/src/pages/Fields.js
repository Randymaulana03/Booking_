import { useEffect, useState } from "react";
import axios from "axios";

export default function Fields() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/fields")
      .then(res => setFields(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Fields</h2>
      <ul>
        {fields.map(f => (
          <li key={f.id}>{f.name} - {f.location}</li>
        ))}
      </ul>
    </div>
  );
}
