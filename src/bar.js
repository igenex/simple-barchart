/**
 * bar.js
 * simple bar chart lib
 * {date} - version 1.0
 * {url}
 * 
 * Copyright 2018 Eugene Sikirzhitsky
 * Released under the MIT Licence
 * {license url}
 * 
 */

'use strict';

function BarChart(targetId, width, height, data) {
    // Base
    let chart = this;
    // Specify configuration 
    chart.configureChart(targetId, width, height, data);

    // Pre operations
    chart.performPreOperations();

    // Draw chart
    chart.drawChart();

    console.log(chart);

}

BarChart.prototype.configureChart = function (targetId, width, height, data) {

    let chart = this;
    // Global canvas specifications
    chart.setCanvasParameters(targetId, width, height, data);
    // Global chart specifications
    chart.setChartParameters();


}

BarChart.prototype.setCanvasParameters = function (targetId, width, height, data) {
    let chart = this;
    // Canvas specifications come from outside
    chart.id = targetId;
    chart.width = width;
    chart.height = height;
    chart.data = data;
}

BarChart.prototype.setChartParameters = function () {
    let chart = this;
    // Axis configurations 
    chart.axisRatio = 10; // in terms of percentage
    chart.verticalMargin = (chart.height * chart.axisRatio) / 100;
    chart.horizontalMargin = (chart.width * chart.axisRatio) / 100;
    chart.axisColor = '#b1b1b1';
    chart.axisWidth = 0.75;

    // Label Configurations
    chart.fontRatio = 3; // in terms of percentage
    chart.fontFamily = 'times';
    chart.fontStyle = 'normal';
    chart.fontWeight = '300';
    chart.fontColor = '#666';
    chart.verticalFontSize = (chart.height * chart.fontRatio) / 100;
    chart.horizontalFontSize = (chart.width * chart.fontRatio) / 100;

    // Guideline configuration
    chart.guidelineColor = '#e5e5e5';
    chart.guidelineWidth = 0,5;
}

BarChart.prototype.performPreOperations = function () {
    let chart = this;

    // Create canvas
    chart.createCanvas();
    // Get data
    chart.handleData();
    // Prepare data
    chart.prepareData();
}

BarChart.prototype.createCanvas = function () {
    let chart = this;

    //Create canvas
    let canvas = document.createElement('canvas');
    canvas.id = chart.id + '-' + Math.random();
    canvas.width = chart.width;
    canvas.height = chart.height;

    // append canvas to target container
    document.querySelector(`#${chart.id}`).innerHTML = ''; // clean container;
    document.querySelector(`#${chart.id}`).appendChild(canvas); // add canvas to cleat container

    // Add canvs to chart object
    chart.canvas = canvas;
    chart.context = canvas.getContext('2d');
}

BarChart.prototype.handleData = function() {
    let chart = this;

    // Data sets
    chart.labels = [];
    chart.values = [];

    // Handle Data
    chart.data.forEach(item => {
        chart.labels.push(item.label);
        chart.values.push(item.value);
    });
};

BarChart.prototype.prepareData = function () {
    let chart = this;

    // Global variables
    chart.itemsNum = chart.data.length;
    chart.maxValue = Math.max(...chart.values);
    chart.minValue = Math.min(...chart.values);

    // axis specifications
    chart.verticalAxisWidth = chart.height - 2 * chart.verticalMargin; //bottom and top margins
    chart.horizontalAxisWidth = chart.width - 2 * chart.horizontalMargin; // left and right margins

    // Label specifications
    chart.verticalUpperBound = Math.ceil(chart.maxValue / 10) * 10;
    chart.verticalLabelFreq = chart.verticalUpperBound / chart.itemsNum;
    chart.horizontalLabelFreq = chart.horizontalAxisWidth / chart.itemsNum;
};

BarChart.prototype.drawChart = function () {
    let chart = this;

    // Vertical Axis
    chart.drawVerticalAxis();
    // Horizontal Axis
    chart.drawHorizontalAxis();

    // Vertical labels
    chart.drawVerticalLabels();
    
    // Horizontal labels
    chart.drawHorizontalLabels();

    // Horizontal Guidelines
    chart.drawHorizontalGuidelines();

    // Vertical Guidelines
    chart.drawVerticalGuidelines();

    // Bars
    chart.drawBars();
};

BarChart.prototype.drawVerticalAxis = function() {
    let chart = this;

    //Vertical axis
    chart.context.beginPath();
    chart.context.strokeStyle = chart.axisColor;
    chart.context.lineWidth = chart.axisWidth;
    chart.context.moveTo(chart.horizontalMargin, chart.verticalMargin);
    chart.context.lineTo(chart.horizontalMargin, chart.height - chart.verticalMargin);
    chart.context.stroke();
};

BarChart.prototype.drawHorizontalAxis = function() {
    let chart = this;

    chart.context.beginPath();
    chart.context.strokeStyle = chart.axisColor;
    chart.context.lineWidth = chart.axisWidth;
    chart.context.moveTo(chart.horizontalMargin, chart.height - chart.verticalMargin);
    chart.context.lineTo(chart.width - chart.horizontalMargin, chart.height - chart.verticalMargin);
    chart.context.stroke();
};

BarChart.prototype.drawVerticalLabels = function () {
    let chart = this;

    // Text Specifications
    let fontSpec = [chart.fontStyle, chart.fontWeight, chart.verticalFontSize, chart.fontFamily];
    let labelFont = fontSpec.join(" ");
    chart.context.font = labelFont;
    chart.context.textAlign = 'right';
    chart.context.fillStyle = chart.fontColor;

    // Scale values
    let scaledVerticalLabelFreq = (chart.verticalAxisWidth / chart.verticalUpperBound) * chart.verticalLabelFreq;

    //Draw labels
    for (let i = 0; i <= chart.itemsNum; i++) {
        let labelText = chart.verticalUpperBound - i * chart.verticalLabelFreq;
        let verticalLabelX = chart.horizontalMargin - chart.horizontalMargin / chart.axisRatio;
        let verticalLabelY = chart.verticalMargin + i * scaledVerticalLabelFreq;

        chart.context.fillText(labelText, verticalLabelX, verticalLabelY);
    }
};

BarChart.prototype.drawHorizontalLabels = function () {
    let chart = this;

    // Text Specifications
    let fontSpec = [chart.fontStyle, chart.fontWeight, chart.verticalFontSize, chart.fontFamily];
    let labelFont = fontSpec.join(" ");
    chart.context.textAlign = 'center';
    chart.context.textBaseline = 'top';
    chart.context.font = labelFont;
    chart.context.fillStyle = chart.fontColor;

    // Draw labels
    for (let i = 0; i < chart.itemsNum; i++) {
        let horizontalLabelX = chart.horizontalMargin + i * chart.horizontalLabelFreq + chart.horizontalLabelFreq / 2;
        let horizontalLabelY = chart.height - chart.verticalMargin + chart.verticalMargin / chart.axisRatio;

        chart.context.fillText(chart.labels[i], horizontalLabelX, horizontalLabelY);

    }
};

BarChart.prototype.drawHorizontalGuidelines = function () {
    let chart = this;

    // Specifications
    chart.context.strokeStyle = chart.guidelineColor;
    chart.context.lineWidth = chart.guidelineWidth;

    // Scale values
    let scaledVerticalLabelFreq = (chart.verticalAxisWidth / chart.verticalUpperBound) * chart.verticalLabelFreq;

    //Draw labels
    for (let i = 0; i <= chart.itemsNum; i++) {
        
        // Startin point coordinates
        let horizontalGuidelineStartX = chart.horizontalMargin;
        let horizontalGuidelineStartY = chart.verticalMargin + i * scaledVerticalLabelFreq;

        // End point coordinates
        let horizontalGuidelineEndX = chart.horizontalMargin + chart.horizontalAxisWidth;
        let horizontalGuidelineEndY = chart.verticalMargin + i * scaledVerticalLabelFreq;

        chart.context.beginPath();
        chart.context.moveTo(horizontalGuidelineStartX, horizontalGuidelineStartY);
        chart.context.lineTo(horizontalGuidelineEndX, horizontalGuidelineEndY);
        chart.context.stroke();


    }
};

BarChart.prototype.drawVerticalGuidelines = function () {
    let chart = this;

    // Specifications
    chart.context.strokeStyle = chart.guidelineColor;
    chart.context.lineWidth = chart.guidelineWidth;

    for (let i = 0; i < chart.itemsNum; i++) {
        // Starting point coordinates
        let verticalGuidelineStartX = chart.horizontalMargin + i * chart.horizontalLabelFreq;
        let verticalGuidelineStartY = chart.height - chart.verticalMargin;

        // End point coordinates
        let verticalGuidelineEndX = chart.horizontalMargin + i * chart.horizontalLabelFreq;
        let verticalGuidelineEndY = chart.verticalMargin;

        chart.context.beginPath();
        chart.context.moveTo(verticalGuidelineStartX, verticalGuidelineStartY);
        chart.context.lineTo(verticalGuidelineEndX, verticalGuidelineEndY);
        chart.context.stroke();
    }
};

BarChart.prototype.drawBars = function () {
    let chart = this;

    let color = chart.createRandomRGBColor();

    for (let i = 0; i < chart.itemsNum; i++) {
        let color = chart.createRandomRGBColor();
        let fillOpacity = '0.3';
        let fillColor = `rgba(${color.r},${color.g},${color.b},${fillOpacity})`;
        let borderColor = `rgb(${color.r},${color.g},${color.b})`;


        chart.context.beginPath();
        
        let barX = chart.horizontalMargin + i * chart.horizontalLabelFreq + chart.horizontalLabelFreq / chart.axisRatio;
        let barY = chart.height - chart.verticalMargin;
        let barWidth = chart.horizontalLabelFreq - 2 * chart.horizontalLabelFreq / chart.axisRatio;
        let barHeight = -1 * chart.verticalAxisWidth * chart.values[i] / chart.maxValue;

        chart.context.fillStyle = fillColor;
        chart.context.strokeStyle = borderColor;
        chart.context.rect(barX, barY, barWidth, barHeight);
        chart.context.stroke();
        chart.context.fill();
    }

};

BarChart.prototype.createRandomRGBColor = function () {
    let red = getRandomInt(0, 257);
    let green = getRandomInt(0, 257);
    let blue = getRandomInt(0, 257);

    return {
        r: red,
        g: green,
        b: blue
    };
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
