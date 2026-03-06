import React, { useState } from 'react';
import './BMICalculator.css';

const BMICalculator = () => {
    const [formData, setFormData] = useState({
        weight: '',
        height: '',
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const calculateBMI = (e) => {
        e.preventDefault();

        const weight = parseFloat(formData.weight);
        const heightInCm = parseFloat(formData.height);

        if (!weight || !heightInCm || weight <= 0 || heightInCm <= 0) {
            alert('Please enter valid values for weight and height');
            return;
        }

        // Convert height from cm to meters
        const heightInM = heightInCm / 100;

        // Calculate BMI
        const bmi = weight / (heightInM * heightInM);
        const bmiValue = bmi.toFixed(1);

        // Determine category
        let category = '';
        let categoryColor = '';
        let healthMessage = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            categoryColor = 'info';
            healthMessage = 'You may need to gain weight. Consider consulting a healthcare professional for personalized advice.';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal';
            categoryColor = 'success';
            healthMessage = 'Great! You have a healthy weight. Maintain your current lifestyle with balanced diet and regular exercise.';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            categoryColor = 'warning';
            healthMessage = 'You may benefit from weight management. Consider increasing physical activity and improving your diet.';
        } else {
            category = 'Obese';
            categoryColor = 'danger';
            healthMessage = 'Your health may be at risk. Please consult a healthcare professional for guidance on weight management.';
        }

        setResult({
            bmi: bmiValue,
            category,
            categoryColor,
            healthMessage,
            weight,
            height: heightInCm,
        });
    };

    const handleReset = () => {
        setFormData({ weight: '', height: '' });
        setResult(null);
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">⚖️ BMI Calculator</h1>
                    <p className="page-description">
                        Calculate your Body Mass Index and understand your health status
                    </p>
                </div>

                <div className="alert alert-warning mb-lg">
                    ⚠️ <strong>Note:</strong> BMI is a general indicator and may not be accurate for athletes, pregnant women, or elderly individuals. Always consult a healthcare professional for personalized advice.
                </div>

                <div className="bmi-container">
                    <div className="card">
                        <h3>Enter Your Details</h3>
                        <form onSubmit={calculateBMI} className="bmi-form">
                            <div className="form-group">
                                <label htmlFor="weight" className="form-label">
                                    Weight (kg) *
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    className="form-input"
                                    placeholder="Enter your weight in kilograms"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="height" className="form-label">
                                    Height (cm) *
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    className="form-input"
                                    placeholder="Enter your height in centimeters"
                                    value={formData.height}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                />
                            </div>

                            <div className="bmi-actions">
                                <button type="submit" className="btn btn-primary btn-full">
                                    Calculate BMI
                                </button>
                                {result && (
                                    <button type="button" onClick={handleReset} className="btn btn-secondary btn-full">
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {result && (
                        <div className="bmi-result-section">
                            <div className={`card bmi-result-card alert-${result.categoryColor}`}>
                                <h2 className="bmi-result-title">Your BMI Result</h2>
                                <div className="bmi-value-display">
                                    <div className="bmi-value">{result.bmi}</div>
                                    <div className={`bmi-category bmi-category-${result.categoryColor}`}>
                                        {result.category}
                                    </div>
                                </div>
                                <div className="bmi-input-summary">
                                    <p><strong>Weight:</strong> {result.weight} kg</p>
                                    <p><strong>Height:</strong> {result.height} cm</p>
                                </div>
                            </div>

                            <div className="card">
                                <h3>Health Message</h3>
                                <p className="bmi-health-message">
                                    {result.healthMessage}
                                </p>
                            </div>

                            <div className="card">
                                <h3>BMI Categories</h3>
                                <div className="bmi-chart">
                                    <div className="bmi-chart-item">
                                        <div className="bmi-chart-range">Below 18.5</div>
                                        <div className="bmi-chart-label bmi-category-info">Underweight</div>
                                    </div>
                                    <div className="bmi-chart-item">
                                        <div className="bmi-chart-range">18.5 - 24.9</div>
                                        <div className="bmi-chart-label bmi-category-success">Normal</div>
                                    </div>
                                    <div className="bmi-chart-item">
                                        <div className="bmi-chart-range">25.0 - 29.9</div>
                                        <div className="bmi-chart-label bmi-category-warning">Overweight</div>
                                    </div>
                                    <div className="bmi-chart-item">
                                        <div className="bmi-chart-range">30.0 and above</div>
                                        <div className="bmi-chart-label bmi-category-danger">Obese</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
