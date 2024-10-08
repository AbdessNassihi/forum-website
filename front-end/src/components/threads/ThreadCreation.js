import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormComponent from '../FormComponent';
import { apiCall } from '../../services/api';

const ThreadCreation = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        threadTitle: '',
        threadText: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };


    const validateForm = () => {
        const newErrors = {};
        if (!formData.threadTitle) newErrors.title = 'Please enter a title';
        if (!formData.threadText) newErrors.text = 'Please enter a description';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await apiCall('post', '/threads', {
                title: formData.threadTitle,
                textthread: formData.threadText
            });

            if (response.status === 201) {
                navigate('/', { state: { showToast: true, message: response.data.message, toastType: 'success' } });
            }
            else if (response.status === 400) {
                const errorObj = {};
                response.data.errors.forEach(error => {
                    errorObj[error.path] = error.msg;
                });
                setErrors(errorObj);
            }

            else {
                toast.error('Failed to create thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An server side error has occured', { hideProgressBar: true, autoClose: 2000 });
        }
    };


    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>

                <FormComponent
                    placeholder="Title"
                    name="threadTitle"
                    value={formData.threadTitle}
                    onChange={handleInputChange}
                    error={errors.title}
                />
                <FormComponent
                    placeholder="Describe your thread"
                    name="threadText"
                    value={formData.threadText}
                    onChange={handleInputChange}
                    error={errors.title}
                />
                <button type="submit" className="btn btn-primary">Create thread</button>
            </form>
        </div>
    );
};

export default ThreadCreation;
