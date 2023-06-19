import React, { useState } from 'react';
import "./App.css"
const App = () => {
  const [response, setResponse] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    c_address_s1: '',
    c_address_s2: '',
    is_permanent_current_add: false,
    p_address_s1: '',
    p_address_s2: '',
    documents: [
      {
        document_name: '',
        document_type: '',
        document_file: null
      },
      {
        document_name: '',
        document_type: '',
        document_file: null
      }
    ]
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedDocuments = [...formData.documents];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        [name]: value
      };
      setFormData((prevFormData) => ({
        ...prevFormData,
        documents: updatedDocuments
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e, index) => {
    const { name, files } = e.target;
    const updatedDocuments = [...formData.documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [name]: files[0]
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: updatedDocuments
    }));
  };

  const postData = async () => {
    // Check for mandatory fields
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.dob ||
      !formData.c_address_s1 ||
      !formData.c_address_s2 ||
      !formData.documents[0].document_name ||
      !formData.documents[0].document_type ||
      !formData.documents[0].document_file ||
      !formData.documents[1].document_name ||
      !formData.documents[1].document_type ||
      !formData.documents[1].document_file
    ) {
      alert('Please fill in all the mandatory fields.');
      return;
    }

    // Validate age
    const currentDate = new Date();
    const birthDate = new Date(formData.dob);
    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
    if (ageDifference < 18) {
      alert('Minimum age should be 18 years.');
      return;
    }

    // Validate address fields if Same as Residential is not checked
    if (!formData.is_permanent_current_add && (!formData.p_address_s1 || !formData.p_address_s2)) {
      alert('Please fill in the permanent address fields.');
      return;
    }

    // Validate documents
    const document1Type = formData.documents[0].document_type.toLowerCase();
    const document2Type = formData.documents[1].document_type.toLowerCase();
    const document1File = formData.documents[0].document_file;
    const document2File = formData.documents[1].document_file;

    if (document1Type !== 'image' && document1Type !== 'pdf') {
      alert('Invalid document type for Document 1. Please select image or pdf.');
      return;
    }

    if (document2Type !== 'image' && document2Type !== 'pdf') {
      alert('Invalid document type for Document 2. Please select image or pdf.');
      return;
    }

    if (!document1File || !document2File) {
      alert('Please upload files for both Document 1 and Document 2.');
      return;
    }

    // Construct form data
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'documents') {
        formData.documents.forEach((document, index) => {
          formDataToSend.append(`documents[${index}][document_name]`, document.document_name);
          formDataToSend.append(`documents[${index}][document_type]`, document.document_type);
          formDataToSend.append(`documents[${index}][document_file]`, document.document_file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('{{baseUrl}}/v1/user/document-submit', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        setResponse(data);
      } else {
        alert('An error occurred while submitting the data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the data.');
    }
  };

  return (
    <div className='container'>
      <div>
        <label className='label'>First Name*: </label>
        <input className='input' type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} />
      </div>
      <div>
        <label className="label">Last Name*: </label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} />
      </div>
      <div>
        <label className="label">Email*: </label>
        <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
      </div>
      <div>
        <label className="label">Date of Birth*: </label>
        <input className="input"  type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
      </div>
      <div>
        <label className='label'>Residential Address Line 1*: </label>
        <input className="input" type="text" name="c_address_s1" value={formData.c_address_s1} onChange={handleInputChange} />
      </div>
      <div>
        <label className='label'>Residential Address Line 2*: </label>
        <input className="input" type="text" name="c_address_s2" value={formData.c_address_s2} onChange={handleInputChange} />
      </div>
      <div>
        <label className="label">Same as Residential: </label>
        <input className='checkbox'
          type="checkbox"
          name="is_permanent_current_add"
          checked={formData.is_permanent_current_add}
          onChange={(e) => handleInputChange(e, undefined)}
        />
      </div>
      {!formData.is_permanent_current_add && (
        <>
          <div>
            <label className="label">Permanent Address Line 1*: </label>
            <input className="input" type="text" name="p_address_s1" value={formData.p_address_s1} onChange={handleInputChange} />
          </div>
          <div>
            <label className="label">Permanent Address Line 2*: </label>
            <input className="input" type="text" name="p_address_s2" value={formData.p_address_s2} onChange={handleInputChange} />
          </div>
        </>
      )}
      <div>
        <label className="label">Document Name 1*: </label>
        <input className="input"
          type="text"
          name="documents[0][document_name]"
          value={formData.documents[0].document_name}
          onChange={(e) => handleInputChange(e, 0)}
        />
      </div>
      <div>
        <label className="label">Document Type 1*: </label>
        <select
          name="documents[0][document_type]"
          value={formData.documents[0].document_type}
          onChange={(e) => handleInputChange(e, 0)}
        >
          <option value="">Select Type</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <div>
        <label className="input">Document File 1*: </label>
        <input className="input" type="file" name="documents[0][document_file]" onChange={(e) => handleFileChange(e, 0)} />
      </div>
      <div>
        <label className="label">Document Name 2*: </label>
        <input className="input"
          type="text"
          name="documents[1][document_name]"
          value={formData.documents[1].document_name}
          onChange={(e) => handleInputChange(e, 1)}
        />
      </div>
      <div>
        <label className="label">Document Type 2*: </label>
        <select
          name="documents[1][document_type]"
          value={formData.documents[1].document_type}
          onChange={(e) => handleInputChange(e, 1)}
        >
          <option value="">Select Type</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <div>
        <label className="label">Document File 2*: </label>
        <input className="input" type="file" name="documents[1][document_file]" onChange={(e) => handleFileChange(e, 1)} />
      </div>
      <button className='button' onClick={postData}>Submit</button>
      {response && (
        <div>
          <h3 className='response'>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;

