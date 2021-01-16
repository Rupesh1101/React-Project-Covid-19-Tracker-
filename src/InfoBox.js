import React from 'react';
import {Card, CardContent, Typography, } from '@material-ui/core';


function InfoBox({title, isRed, isGray, active, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} 
        ${isRed && "infoBox--Red"} ${isGray && "infoBox--Gray"}`}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>
                {/* Number of Cases */}
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"} ${isGray && "infoBox_cases--gray"}`}>
                {cases}</h2>

                {/* Total Cases */}
                <Typography className="infoBox_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
            
        </Card>
    )
};

export default InfoBox;


