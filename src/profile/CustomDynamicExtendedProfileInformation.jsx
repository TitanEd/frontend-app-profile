import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  StatefulButton,
} from '@openedx/paragon';
import {
  faChevronDown,
  faChevronUp,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './customDynamicExtendedProfileInformation.scss';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { ProgressBar } from '@openedx/paragon';

// import sampleConfig from './sampledata.json';

// Sample config from API (expanded with new types, dependencies, validations)
// const sampleConfig = [
//   {
//     name: 'AcademicInformation',
//     title: 'Academic Information',
//     getApi: '/api/academic/get',
//     saveApi: '/api/academic/save',
//     fields: [
//       { name: 'academicYear', label: 'Current Academic Year*', placeholder: 'Select year', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'], required: true },
//       { name: 'degreeLevel', label: 'Current Degree Level*', placeholder: 'Select degree', type: 'select', options: ['B.Tech', 'B.Sc', 'B.A', 'M.Tech', 'M.Sc', 'BCA', 'MCA', 'Others'], required: true },
//       { name: 'university', label: 'University Name*', helper: 'If your university isn\'t listed, select Others and enter the name manually.', placeholder: 'Select university', type: 'select', options: ['IIT Bombay', 'IIT Delhi', 'NIT Trichy', 'BITS Pilani', 'Jadavpur University', 'Others'], customOption: true, customFieldName: 'customUniversity', required: true },
//       { name: 'college', label: 'College Name*', helper: 'If your college isn\'t listed, select Others and enter the name manually.', placeholder: 'Select college', type: 'select', options: ['XYZ Institute of Technology', 'ABC Engineering College', 'PQR Degree College', 'Others'], customOption: true, customFieldName: 'customCollege', required: true },
//       { name: 'subjectAreas', label: 'Currently Pursuing Subject Areas*', placeholder: 'Select subject area', type: 'multiselect', options: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical Engineering', 'Civil Engineering', 'Data Science', 'Artificial Intelligence', 'Mathematics', 'Physics'], required: true },
//       { name: 'gender', label: 'Gender*', type: 'radio', options: ['Male', 'Female', 'Other'], required: true },
//       { name: 'interests', label: 'Interests', type: 'checkbox', options: ['Sports', 'Music', 'Reading', 'Travel'], required: false },
//       { name: 'resume', label: 'Upload Resume (PDF/DOCX)*', type: 'file', accept: '.pdf,.docx', required: true },
//       { name: 'email', label: 'Email*', type: 'text', validation: { type: 'email' }, required: true },
//       { name: 'age', label: 'Age*', type: 'number', validation: { min: 18, max: 100 }, required: true },
//       { name: 'country', label: 'Country*', type: 'select', options: ['India', 'USA'], required: true },
//       { name: 'state', label: 'State*', type: 'select', dependsOn: 'country', options: { India: ['Jharkhand', 'Delhi'], USA: ['California', 'New York'] }, required: true },
//       { name: 'district', label: 'District*', type: 'select', dependsOn: 'state', options: { Jharkhand: ['Ranchi', 'Bokaro'], Delhi: ['Central Delhi'] }, required: true },
//       { name: 'village', label: 'Village*', type: 'select', dependsOn: 'district', options: { Ranchi: ['Village1', 'Village2'] }, required: true, visibleWhen: { field: 'country', value: 'India' }, requiredWhen: { field: 'state', value: 'Jharkhand' } },
//     ],
//     cancelText: 'Cancel',
//     saveText: 'Save',
//     editText: 'Edit',
//   },
//   // Add other sections similarly...
// ];

const CustomExtendedProfileInformation = () => {
  const [sections, setSections] = useState([]);

  // useEffect(() => {
  //   // Real: fetch('/api/config').then(res => res.json()).then(setSections)
  //   setSections(sampleConfig);
  // }, []);

  const [progress, setProgress] = useState({
    percentage: 0,
    completed: 0,
    total_required: 0,
  });

  const fetchProgress = () => {
    const { LMS_BASE_URL } = getConfig();
    if (!LMS_BASE_URL) return;

    fetch(`${LMS_BASE_URL}/profile/progress/?role=student`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setProgress)
      .catch(() =>
        setProgress({ percentage: 0, completed: 0, total_required: 0 })
      );
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    const { LMS_BASE_URL } = getConfig();

    if (!LMS_BASE_URL) {
      console.error('LMS_BASE_URL not available');
      return;
    }

    fetch(`${LMS_BASE_URL}/profile/dynamic-form/`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setSections(Array.isArray(data) ? data : []))
      .catch(() => setSections([]));
  }, []);

  return (
    <div className="container-fluid mt-4 mb-4 p-4 extended-profile-information">
      <h3 className="extended-prfile-info-container-title">Extended Profile Information</h3>
      <p>Please complete the following sections to help us personalize your learning experience.</p>
      {!progress.hidden && (
        <div className="profile-progress-wrapper mb-4">
          <div className="profile-progress-label">
            <strong>Profile Completion</strong>
            <span>{progress.percentage}%</span>
          </div>
          <ProgressBar now={progress.percentage} />
        </div>
      )}

      <div className="row">
        {sections.map((section, idx) => (
          <div key={idx} className="col-md-6 mb-4">
            <GenericSection config={section}onSaved={fetchProgress} />
          </div>
        ))}
      </div>
    </div>
  );
};

const GenericSection = ({ config, onSaved }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [savedData, setSavedData] = useState(null);
  const [multiOpen, setMultiOpen] = useState({});
  const [errors, setErrors] = useState({});

  const hasSavedData = !!savedData;
  const fields = Array.isArray(config.fields) ? config.fields : [];

  useEffect(() => {
    const { LMS_BASE_URL } = getConfig();

    if (!LMS_BASE_URL) return;

    fetch(`${LMS_BASE_URL}${config.getApi}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setSavedData(Object.keys(data || {}).length ? data : null);
      })
      .catch(() => setSavedData(null));
  }, [config.getApi]);




  useEffect(() => {
    if (hasSavedData) {
      setFormData(savedToForm(savedData, fields));
    } else {
      setFormData(initFormData(fields));
    }
  }, [savedData, fields]);

  const initFormData = (fields) => {
    const data = {};
    fields.forEach(f => {
      if (f.type === 'multiselect' || f.type === 'checkbox') data[f.name] = [];
      else if (f.type === 'file') data[f.name] = null;
      else data[f.name] = '';
      if (f.customOption) data[f.customFieldName] = '';
    });
    return data;
  };

  const savedToForm = (saved, fields) => {
    const data = initFormData(fields);
    fields.forEach(f => {
      let val = saved?.[f.name];
      if (f.customOption) {
        const opts = getOptions(f, data[f.dependsOn || '']);
        if (opts && !opts.includes(val) && val) {
          data[f.name] = 'Others';
          data[f.customFieldName] = val;
        } else {
          data[f.name] = val || '';
        }
      } else if (f.type === 'multiselect' || f.type === 'checkbox') {
        data[f.name] = Array.isArray(val) ? val : [];
      } else if (f.type === 'file') {
        data[f.name] = null; // Files not persisted in demo
      } else {
        data[f.name] = val || '';
      }
    });
    return data;
  };

  const getOptions = (field, parentValue = '') => {
    if (Array.isArray(field.options)) return field.options;
    if (parentValue && field.options?.[parentValue]) return field.options[parentValue];
    return [];
  };

  const resetDependents = (fieldName, newData) => {
    const dependents = fields.filter(f => f.dependsOn === fieldName);
    dependents.forEach(d => {
      newData[d.name] = d.type === 'multiselect' || d.type === 'checkbox' ? [] : (d.type === 'file' ? null : '');
      if (d.customOption) newData[d.customFieldName] = '';
      // Recurse for multi-level
      resetDependents(d.name, newData);
    });
  };

  const toggleAccordion = () => setIsOpen(p => !p);

  const handleChange = (e, name, field) => {
    let value;
    if (field.type === 'file') {
      value = e.target.files[0];
    } else if (field.type === 'checkbox') {
      value = formData[name] || [];
      if (e.target.checked) {
        value = [...value, e.target.value];
      } else {
        value = value.filter(v => v !== e.target.value);
      }
    } else if (field.type === 'radio') {
      value = e.target.value;
    } else {
      value = e.target.value;
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      resetDependents(name, newData);
      return newData;
    });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelect = (fieldName, opt) => {
    setFormData(prev => {
      const arr = prev[fieldName] || [];
      return { ...prev, [fieldName]: arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt] };
    });
  };

  const removeMulti = (fieldName, val) => {
    setFormData(prev => ({ ...prev, [fieldName]: prev[fieldName].filter(v => v !== val) }));
  };

  const toggleMultiDropdown = (fieldName) => setMultiOpen(p => ({ ...p, [fieldName]: !p[fieldName] }));

  const preparePayload = () => {
    const payload = {};
    fields.forEach(f => {
      if (f.customOption && formData[f.name] === 'Others') {
        payload[f.name] = formData[f.customFieldName] || '';
      } else if (f.type === 'file') {
        payload[f.name] = formData[f.name]?.name || ''; // Simulate, real: FormData upload
      } else {
        payload[f.name] = formData[f.name];
      }
    });
    return payload;
  };

  const validateField = (field, value) => {
    if (field.visibleWhen && !evaluateCondition(field.visibleWhen)) return ''; // Not visible → no error
    const isRequired = field.required || (field.requiredWhen && evaluateCondition(field.requiredWhen));
    if (isRequired && (!value || (Array.isArray(value) && !value.length))) return `${field.label.replace('*', '').trim()} is required`;

    if (field.validation) {
      const val = field.validation;
      if (val.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
      if (val.minLength && value.length < val.minLength) return `Minimum length ${val.minLength}`;
      if (val.maxLength && value.length > val.maxLength) return `Maximum length ${val.maxLength}`;
      if (val.min && Number(value) < val.min) return `Minimum value ${val.min}`;
      if (val.max && Number(value) > val.max) return `Maximum value ${val.max}`;
      if (val.pattern && value && !new RegExp(val.pattern).test(value)) return 'Invalid format';
    }
    return '';
  };

  const evaluateCondition = (cond) => {
    if (!cond) return true;
    return formData[cond.field] === cond.value; // Simple equality, extend for > < etc if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const newErrors = {};
    fields.forEach(f => {
      const err = validateField(f, formData[f.name]);
      if (err) newErrors[f.name] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      setIsSaving(false);
      return;
    }

    try {
      const payload = preparePayload();
      // Real: for file, use FormData; await fetch(config.saveApi, { method: 'POST', body: formDataWithFiles })
      const { LMS_BASE_URL } = getConfig();

      await getAuthenticatedHttpClient().post(
        `${LMS_BASE_URL}${config.saveApi}`,
        payload
      );

      setSavedData(payload);

      setIsEditing(false);
      onSaved && onSaved();
    } catch {
      alert('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(savedToForm(savedData, fields));
    setIsEditing(false);
    setErrors({});
  };

  const handleEdit = () => setIsEditing(true);

  const isFieldVisible = (field) => !field.visibleWhen || evaluateCondition(field.visibleWhen);

  const renderField = (field) => {
    if (!isFieldVisible(field)) return null;

    const value = formData[field.name];
    const parentVal = field.dependsOn ? formData[field.dependsOn] : '';
    const options = getOptions(field, parentVal);
    const showCustom = field.customOption && value === 'Others';
    const helper = field.helper || '';
    const error = errors[field.name];

    const commonProps = {
      isInvalid: !!error,
    };


    switch (field.type) {
      case 'select':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label htmlFor={field.name} className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            <Form.Control
              as="select"
              value={value}
              onChange={e => handleChange(e, field.name, field)}
            >
              <option value="">{field.placeholder || 'Select'}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Form.Control>
            {showCustom && (
              <Form.Control
                className="mt-2"
                placeholder={`Enter custom ${field.label.toLowerCase().replace('*', '').trim()}`}
                value={formData[field.customFieldName] || ''}
                onChange={e => handleChange(e, field.customFieldName, field)}
              />
            )}
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      case 'text': case 'tel': case 'email': case 'number': case 'date':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label htmlFor={field.name} className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            <Form.Control
              type={field.type === 'email' ? 'email' : (field.type === 'number' ? 'number' : field.type)}
              placeholder={field.placeholder || ''}
              value={value}
              onChange={e => handleChange(e, field.name, field)}
              min={field.validation?.min}
              max={field.validation?.max}
            />
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      case 'textarea':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label htmlFor={field.name} className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            <Form.Control
              as="textarea"
              rows={field.rows || 3}
              placeholder={field.placeholder || ''}
              value={value}
              onChange={e => handleChange(e, field.name, field)}
            />
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      case 'multiselect':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label htmlFor={field.name} className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            <div className="d-flex flex-wrap gap-3 mb-3">
              {(value || []).map(val => (
                <span key={val} className="badge bg-primary text-white d-flex align-items-center m-1">
                  {val}
                  <Button variant="black" size="sm" className="p-0 ms-1 text-white m-1" onClick={() => removeMulti(field.name, val)}>
                    <FontAwesomeIcon icon={faClose} />
                  </Button>
                </span>
              ))}
            </div>
            <div className="position-relative multi-select-container">
              <div
                className="form-control d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => toggleMultiDropdown(field.name)}
              >
                <span className={value?.length ? 'multi-select-text' : 'text-muted '}>
                  {value?.length ? value.join(', ') : (field.placeholder || 'Select options')}
                </span>
                <FontAwesomeIcon icon={multiOpen[field.name] ? faChevronUp : faChevronDown} className="multi-select-bold-icon" />
              </div>
              {multiOpen[field.name] && (
                <div className="multi-select-dropdown shadow-sm">
                  {options.map(opt => (
                    <div
                      key={opt}
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => handleMultiSelect(field.name, opt)}
                    >
                      <input type="checkbox" checked={value.includes(opt)} readOnly className="me-2 mr-2" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      case 'radio':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            <Form.RadioSet
              name={field.name}
              onChange={e => handleChange(e, field.name, field)}
              value={value}
            >
              {options.map(opt => (
                <Form.Radio key={opt} value={opt}>{opt}</Form.Radio>
              ))}
            </Form.RadioSet>
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      case 'checkbox':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            {options.map(opt => (
              <Form.Checkbox
                key={opt}
                value={opt}
                checked={(value || []).includes(opt)}
                onChange={e => handleChange(e, field.name, field)}
              >
                {opt}
              </Form.Checkbox>
            ))}
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      case 'file':
        return (
          <Form.Group controlId={field.name} className="mb-4" {...commonProps}>
            <label htmlFor={field.name} className="d-block">{field.label}</label>
            {helper && <p className="small text-muted mb-2">{helper}</p>}
            <Form.Control
              type="file"
              accept={field.accept}
              onChange={e => handleChange(e, field.name, field)}
            />
            {value && <p className="mt-2">Selected: {value.name}</p>}
            {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        );

      default: return null;
    }
  };

  const renderForm = () => (
    <Form onSubmit={handleSubmit} className="p-4">
      <div className="row">
        {fields.map((f, i) => (
          <div key={i} className="col-md-6 mb-4">
            {renderField(f)}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end information-form-actions-buttons">
        <Button variant="outline-secondary" onClick={handleCancel} className="information-form-actions-buttons-cancel">
          {config.cancelText}
        </Button>
        <StatefulButton
          state={isSaving ? 'pending' : 'default'}
          labels={{ default: config.saveText, pending: 'Saving...' }}
          type="submit"
          className="information-form-actions-buttons-save"
        />
      </div>
    </Form>
  );

  const renderDisplayMode = () => (
    <div className="p-4">
      <div className="row">
        {fields.map((f, i) => (
          <div key={i} className="col-6 mb-3">
            <strong>{f.label.replace('*', '').trim()}</strong>
            <p className="mb-0">
              {Array.isArray(savedData?.[f.name])
                ? savedData[f.name].join(', ') || '-'
                : (f.type === 'file' ? savedData?.[f.name] || '-' : savedData?.[f.name] || '-')}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 d-flex justify-content-end information-form-actions-buttons">
        <Button variant="outline-primary" className="information-form-button-edit" onClick={handleEdit}>
          {config.editText}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`compnent-card-container ${isOpen ? 'open' : ''}`}>
      <div className="header d-flex align-items-center justify-content-between p-4" onClick={toggleAccordion}>
        <h5 className="mb-0">{config.title}</h5>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      {isOpen && (
        <div className="content">
          {isEditing || !hasSavedData ? renderForm() : renderDisplayMode()}
        </div>
      )}
    </div>
  );
};


export default CustomExtendedProfileInformation;