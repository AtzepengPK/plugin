import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import * as chart from "./chart";
import "./charts-annotation";
import './css/style.css!';
import { DataProcessor } from './data-processor';

var myConfig = {
    type: "line",
    data: {
        datasets: []
    },
    annotations: {
        enabled: false,
        annotationDSStartIndex: 1
    },
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
        mode: "index",
        intersect: false,
    },
    axes: {
        xAxes: {
            display: true,
            type: "time"
        },
        yAxes: {
            display: true,
            label: "Count"
        }
    }
}

let hiddenAnnotations = [];
var cht;
var config;
let inited = false;
let dataProcessor;
let currentData = [];

export class PlugCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        _.defaultsDeep(this.panel, myConfig);
        _.defaultsDeep(this.panel.legend, myConfig.legend);
        _.defaultsDeep(this.panel.annotations, myConfig.annotations);
        _.defaultsDeep(this.panel.tooltip, myConfig.tooltip);
        _.defaultsDeep(this.panel.axes, myConfig.axes);

        dataProcessor = new DataProcessor(this.panel);
        //_.defaultsDeep(this.panel, {});
        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        //this.events.on("panel-size-changed", this.resizeAspectRatio.bind(this));
    }

    onInitEditMode() {
        this.addEditorTab('Config', 'public/plugins/plug/conf-editor.html', 3);
        this.addEditorTab('Annotations', 'public/plugins/plug/annotation-editor.html', 4);
    }

    onDataReceived(dataList) {
        if (!inited) {
            this.initGraph();
        }

        if (dataList == undefined)
            return

        currentData = dataList;
        this.refreshData(dataList);

        /*this.panel.data.datasets.push(
            dataProcessor.transformData(dataList[i])
        )*/

        /*var maxValueOfY = Math.max(...seriesList.map(o => o.y));

        cht.data.datasets[0].data = seriesList;
        cht.options.annotation.annotations = [];
        hiddenAnnotations = [];

        var annotations = this.addAnnotation(seriesList, maxValueOfY);
        hiddenAnnotations.push(annotations);
        cht.options.annotation.annotations.push(annotations);

        this.addLegend();*/


        this.render();
    }

    initGraph() {
        var ctx = document.getElementById("myChart");

        var options = {
            type: this.panel.type,
            data: this.panel.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: false,
                legendCallback: function (chart) {
                    var legendHtml = [];
                    legendHtml.push('<div style="display:inline-block;padding-bottom:20px">');

                    for (var i = 0; i < chart.data.datasets.length; i++) {
                        legendHtml.push('<div id="d' + i + '" class="' + this.panel.legend.box.containerClass + '">');
                        legendHtml.push('<div class="' + this.panel.legend.box.coloredBoxClass + '" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></div>');
                        legendHtml.push('<div class="' + this.panel.legend.box.labelClass + '">' + chart.data.datasets[i].label + '</div>');
                        legendHtml.push('<div style="clear:both">');
                        legendHtml.push('</div>');
                        legendHtml.push('</div>');
                    }
                    for (var i = 0; i < chart.options.annotation.annotations.length; i++) {
                        legendHtml.push('<div id="a' + i + '" class="' + this.panel.legend.box.containerClass + '" style="float:left;">')
                        legendHtml.push('<div class="' + this.panel.legend.box.coloredBoxClass + '" style="background-color:' + chart.options.annotation.annotations[i].backgroundColor[i] + '"></div>');
                        legendHtml.push('<div class="' + this.panel.legend.box.labelClass + '">' + chart.options.annotation.annotations[i].label + '</div>');
                        legendHtml.push('<div style="clear:both">');
                        legendHtml.push('</div>');
                        legendHtml.push('</div>')
                    }
                    legendHtml.push('</div>');
                    legendHtml.push('<div style="clear:both"></div>');

                    return legendHtml.join("");
                },
                tooltips: {
                    mode: this.panel.tooltip.mode,
                    intersect: this.panel.tooltip.intersect,
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
                        display: this.panel.axes.xAxes.display,
                        type: this.panel.axes.xAxes.type,
                        categoryPercentage: 1.0,
                        barPercentage: 1.0
                    }],
                    yAxes: [{
                        display: this.panel.axes.yAxes.display,
                        scaleLabel: {
                            display: true,
                            labelString: this.panel.axes.yAxes.label
                        },
                        ticks: {
                            suggestedMin: 0
                        }
                    }]
                },
                annotation: {
                    events: ["mousemove", "mouseleave"],
                    annotations: []
                }
            }
        };

        cht = new Chart(ctx, options);
        inited = true;

    }

    refreshData(data) {
        console.log("refresh data");
        if (data == undefined)
            data = currentData.slice();

        var graphData = data;
        var annotationData = [];

        if (this.panel.annotations.enabled && this.panel.annotations.annotationDSStartIndex < graphData.length) {
            annotationData = graphData.splice(this.panel.annotations.annotationDSStartIndex, (graphData.length - this.panel.annotations.annotationDSStartIndex));
        }

        this.panel.data.datasets = [];

        for (var i = 0; i < graphData.length; i++) {
            this.panel.data.datasets.push(
                dataProcessor.transformData(this.panel.type, graphData[i])
            )
        }
        var maxY = dataProcessor.getMaxY();

        for (var i = 0; i < annotationData.length; i++) {
            annotationData[i].maxValueOfY = maxY;
            cht.options.annotation.annotations = cht.options.annotation.annotations.concat(dataProcessor.transformData("annotation", annotationData[i]));
            cht.options.annotation.annotations.shift();
        }

        console.log(cht.options.annotation)

        cht.update();
    }

    onRender(seriesList) {
        if (cht)
            cht.update();
    }

    addLegend() {
        var legendNode = document.getElementById(this.panel.legend.containerId);

        if (!legendNode) {
            legendNode = document.createElement('div');
            legendNode.id = this.panel.legend.containerId;
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
        var boxes = legendEl.getElementsByClassName(this.panel.legend.box.containerClass);
        for (var i = 0; i < boxes.length; i += 1) {
            var id = boxes[i].getAttribute('id');
            boxes[i].addEventListener("click", this.legendClickCallback, false);
        }
    }

    legendClickCallback(event) {
        var target = event.target || event.srcElement;
        if (!target.classList.contains(this.panel.legend.box.containerClass)) {
            target = target.parentNode;
        }

        var label = target.getElementsByClassName(this.panel.legend.box.labelClass)[0];
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
            var annotation = this.panel.options.annotation.annotations.find(a => a.position === hAnnotation.position);
            if (!annotation) {
                this.panel.options.annotation.annotations.push(hAnnotation);
                label.classList.remove('hidden');
            } else {
                this.panel.options.annotation.annotations.splice([annotation.position], 1);
                label.classList.add('hidden');
            }
        }
        cht.update();
    }
}

PlugCtrl.templateUrl = "module.html"