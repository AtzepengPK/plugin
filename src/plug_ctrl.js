import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import * as chart from "./chart";
import "./charts-annotation";
import './css/style.css!';
import { DataProcessor } from './data-processor';

const myConfig = {
    annotationDSStartIndex: 1,
    legend: {
        containerId: "chart-legends",
        box: {
            containerClass: "lbContainer",
            coloredBoxClass: "lbColored",
            labelClass: "lbLabel"
        }
    },
    tooltip: {
        containerId: "chartjs-tooltip",
    },
    graphConfig: {
        type: "line",
        data: {
            datasets: [{
                type: 'line',
                label: 'My First dataset',
                borderColor: ["rgba(0, 153, 255,0.8)"],
                backgroundColor: ["rgba(0, 153, 255,0.8)"],
                data: [],
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: 'Chart.js Line Chart'
            },
            legend: false,
            legendCallback: function (chart) {
                var legendHtml = [];
                legendHtml.push('<div style="display:inline-block;padding-bottom:20px">');

                for (var i = 0; i < chart.data.datasets.length; i++) {
                    legendHtml.push('<div id="d' + i + '" class="' + myConfig.legend.box.containerClass + '">');
                    legendHtml.push('<div class="' + myConfig.legend.box.coloredBoxClass + '" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></div>');
                    legendHtml.push('<div class="' + myConfig.legend.box.labelClass + '">' + chart.data.datasets[i].label + '</div>');
                    legendHtml.push('<div style="clear:both">');
                    legendHtml.push('</div>');
                    legendHtml.push('</div>');
                }
                for (var i = 0; i < chart.options.annotation.annotations.length; i++) {
                    legendHtml.push('<div id="a' + i + '" class="' + myConfig.legend.box.containerClass + '" style="float:left;">')
                    legendHtml.push('<div class="' + myConfig.legend.box.coloredBoxClass + '" style="background-color:' + chart.options.annotation.annotations[i].backgroundColor[i] + '"></div>');
                    legendHtml.push('<div class="' + myConfig.legend.box.labelClass + '">' + chart.options.annotation.annotations[i].label + '</div>');
                    legendHtml.push('<div style="clear:both">');
                    legendHtml.push('</div>');
                    legendHtml.push('</div>')
                }
                legendHtml.push('</div>');
                legendHtml.push('<div style="clear:both"></div>');

                return legendHtml.join("");
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].description || '';

                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label;
                    }
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    type: 'time',
                    categoryPercentage: 1.0,
                    barPercentage: 1.0
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    ticks: {
                        suggestedMin: 0
                    }
                }]
            },
            annotation: {
                events: ["mousemove", "mouseleave"],
                annotations: [
                ]
            }
        }
    }
}

let seriesList = [];
let hiddenAnnotations = [];
var cht;
var config;
let inited = false;
let dataProcessor = new DataProcessor();

export class PlugCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        _.defaultsDeep(this.panel, myConfig);
        _.defaultsDeep(this.panel.legend, myConfig.legend);
        _.defaultsDeep(this.panel.tooltip, myConfig.tooltip);
        _.defaultsDeep(this.panel.graphConfig, myConfig.graphConfig);

        //_.defaultsDeep(this.panel, {});
        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        //this.events.on("panel-size-changed", this.resizeAspectRatio.bind(this));
    }

    /*zoomOut(evt) {
        this.publishAppEvent('zoom-out', 2);
    }*/

    onInitEditMode() {
        this.addEditorTab('Config', 'public/plugins/plug/editor.html', 3);
    }

    onDataReceived(dataList) {
        if (!inited) {
            var ctx = document.getElementById("myChart");
            cht = new Chart(ctx, this.panel.graphConfig);
            inited = true;
        }

        if (dataList == undefined)
            return

        console.log(dataList);
        var annotations = dataProcessor.transformData("annotation", dataList);
        console.log(annotations);

        //this.render(dataList);
    }

    onRender(seriesList) {
        if (seriesList == undefined)
            return

        var maxValueOfY = Math.max(...seriesList.map(o => o.y));

        cht.data.datasets[0].data = seriesList;
        cht.options.annotation.annotations = [];
        hiddenAnnotations = [];

        var annotations = this.addAnnotation(seriesList, maxValueOfY);
        hiddenAnnotations.push(annotations);
        cht.options.annotation.annotations.push(annotations);

        this.addLegend();
        cht.update();
    }

    addLegend() {
        var legendNode = document.getElementById(myConfig.legend.containerId);

        if (!legendNode) {
            legendNode = document.createElement('div');
            legendNode.id = myConfig.legend.containerId;
            var container = document.getElementById("canvasContainer");
            container.insertBefore(legendNode, container.firstChild);
            legendNode.style.opacity = 1;
            legendNode.style.position = 'relative';
            legendNode.style.padding = '10px 10px';
        }

        legendNode.innerHTML = cht.generateLegend();
        this.resizeCanvas(legendNode);
        this.addLegendClickListener(legendNode);
    }

    resizeCanvas(legendEl) {
        let px = legendEl.clientHeight + "px";
        document.getElementById("canvasContainer").style.height = "calc(100% - " + px + ")";
    }

    addLegendClickListener(legendEl) {
        var boxes = legendEl.getElementsByClassName(myConfig.legend.box.containerClass);
        for (var i = 0; i < boxes.length; i += 1) {
            var id = boxes[i].getAttribute('id');
            boxes[i].addEventListener("click", this.legendClickCallback, false);
        }
    }

    legendClickCallback(event) {
        var target = event.target || event.srcElement;
        if (!target.classList.contains(myConfig.legend.box.containerClass)) {
            target = target.parentNode;
        }

        var label = target.getElementsByClassName(myConfig.legend.box.labelClass)[0];
        var id = target.getAttribute('id');
        var index = id.substring(1, id.length);
        if (id[0] == 'd') {
            var meta = cht.getDatasetMeta(index);
            if (meta.hidden === null) {
                meta.hidden = !cht.data.datasets[index].hidden;
                label.classList.add('hidden');
            } else {
                meta.hidden = null;
                label.classList.remove('hidden');
            }
        } else {
            var hAnnotation = hiddenAnnotations[index];
            var annotation = cht.options.annotation.annotations.find(a => a.position === hAnnotation.position);
            if (!annotation) {
                cht.options.annotation.annotations.push(hAnnotation);
                label.classList.remove('hidden');
            } else {
                cht.options.annotation.annotations.splice([annotation.position], 1);
                label.classList.add('hidden');
            }
        }
        cht.update();
    }

    addAnnotation(seriesList, maxValueOfY) {
        if (maxValueOfY == 0)
            maxValueOfY = 10;

        return {
            drawTime: "beforeDatasetsDraw",
            type: "box",
            id: '0',
            position: '0',
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: seriesList[1].x,
            xMax: seriesList[3].x,
            yMin: 0,
            yMax: maxValueOfY,
            label: "test",
            backgroundColor: ["rgba(101, 33, 171, 0.5)"],
            borderColor: "rgb(101, 33, 171)",
            borderWidth: 1,
            onMousemove: function (e) {
                var tooltipEl = document.getElementById(myConfig.tooltip.containerId);

                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = myConfig.tooltip.containerId;
                    tooltipEl.innerHTML = "<div style='background-color:red'></div>";
                    document.body.appendChild(tooltipEl);
                }

                var divRoot = tooltipEl.querySelector('div');
                divRoot.innerHTML = seriesList[1].description;

                var xPos = e.clientX;
                var yPos = e.clientY;

                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = xPos + 10 + 'px';
                tooltipEl.style.top = yPos + 2 + 'px';
                tooltipEl.style.fontSize = '15px';
                tooltipEl.style.padding = '10px 10px';

            },
            onMouseleave: function (e) {
                var tooltip = document.getElementById('chartjs-tooltip');
                tooltip.parentNode.removeChild(tooltip);
            }
        }
    }
}

PlugCtrl.templateUrl = "module.html"