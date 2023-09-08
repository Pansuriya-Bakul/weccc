import React from 'react';
import './ProgressBar.css';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

const HealthToday = ({ data }) => {
    let colorClass;

    if (data >= 0 && data <= 15) {
        colorClass = "red";
    } else if (data <= 30) {
        colorClass = "orange";
    } else if (data <= 55) {
        colorClass = "yellow";
    } else if (data <= 80) {
        colorClass = "olive";
    } else {
        colorClass = "green";
    }

    // Calculate the left position for the arrow based on the data value
    const arrowLeftPosition = `${data}%`;

    return (
        <div className="progress-bar">
            <div className={`progress ${colorClass}`} >
                <div className="tick-container">
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => (
                        <React.Fragment key={value}>
                            <div className="tick" style={{ left: `${value}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 1}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 2}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 3}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 4}%` }}></div>
                            <div className="medium-tick" style={{ left: `${value + 5}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 6}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 7}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 8}%` }}></div>
                            <div className="small-tick" style={{ left: `${value + 9}%` }}></div>

                            <span className="tick-label" style={{ left: `${value}%` }}>{value}</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="data-arrow" style={{ left: arrowLeftPosition }}>
                <ArrowDropUpIcon fontSize="large" />
                <span className="data-value">{data}</span>
            </div>
        </div>
    );
};

export default HealthToday;
