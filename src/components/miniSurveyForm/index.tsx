import React, { useEffect, useRef, useState } from 'react';
import type { formValues } from './type';
import FormField from '../../commonComponents/formField';
function MiniSurveyForm() {
  const initialFormValue: formValues = {
    name: '',
    email: '',
    message: '',
    rating: '',
  };

  const [values, setValues] = useState(initialFormValue);
  const didInit = useRef(false);
  const [historyList, setHistoryList] = useState<formValues[]>([]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const storedData = localStorage.getItem('formData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed)) {
          setHistoryList(parsed);
        }
      } catch (e) {
        console.error('Failed to parse formData');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(values, 'submit--');
    const updateHistory = [...historyList, values];
    setHistoryList(updateHistory);
    localStorage.setItem('formData', JSON.stringify(updateHistory));
    setValues(initialFormValue);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleClearAll = () => {
    setHistoryList([]);
    localStorage.removeItem('formData');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
        <FormField
          label="Name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="border rounded p-2"
        />

        <FormField
          label="email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <FormField
          label="Message"
          type="textarea"
          name="message"
          value={values.message}
          onChange={handleChange}
          className="border rounded p-2"
        />

        <FormField
          label="Rating"
          type="select"
          name="rating"
          value={values.rating}
          onChange={handleChange}
          options={['1', '2', '3', '4', '5']}
        />
        <button
          type="button"
          className="border rounded px-4 py-2 bg-blue-500 text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
      <div className="p-4 gap-4 max-w-md mx-auto">
        <div className="flex justify-between">
          <p>Submission History</p>
          <button
            className="border rounded px-4 py-2 bg-blue-500 text-white"
            onClick={handleClearAll}
          >
            clearAll
          </button>
        </div>
        <ul>
          {historyList.map((item, index) => (
            <li key={index} className="border-b py-2">
              <p>Name: {item.name}</p>
              <p>Email: {item.email}</p>
              <p>Message: {item.message}</p>
              <p>Rating: {item.rating}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default MiniSurveyForm;
