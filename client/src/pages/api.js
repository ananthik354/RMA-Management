import axios from "axios";

const API =
  "http://localhost:5000/api";

export const getReminder =
(id) =>
  axios.get(
    `${API}/reminder/${id}`
  );

export const updateReminder =
(id, data) =>
  axios.put(
    `${API}/reminder/update/${id}`,
    data
  );