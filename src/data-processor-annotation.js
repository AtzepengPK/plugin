export class DataProcessorAnnotation {
    constructor() {
    }

    randomRgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ', 0.4)';
    }

    transform(dataset) {
        var annotations = [];

        /*var offset = (new Date().getTimezoneOffset() * 60 * 1000);
        var timeRange = angular.element('grafana-app').injector().get('timeSrv').timeRange();
        var temp_date_from = new Date(timeRange.from + offset);
        var temp_date_to = new Date(timeRange.to + offset);
        var date_from = temp_date_from.getFullYear() + '-' + ('0' + (temp_date_from.getMonth() + 1)).slice(-2) + '-' + ('0' + temp_date_from.getDate()).slice(-2) + 'T' + ('0' + temp_date_from.getHours()).slice(-2) + ':' + ('0' + temp_date_from.getMinutes()).slice(-2) + ':' + ('0' + temp_date_from.getSeconds()).slice(-2) + '.000Z';
        var date_to = temp_date_to.getFullYear() + '-' + ('0' + (temp_date_to.getMonth() + 1)).slice(-2) + '-' + ('0' + temp_date_to.getDate()).slice(-2) + 'T' + ('0' + temp_date_to.getHours()).slice(-2) + ':' + ('0' + temp_date_to.getMinutes()).slice(-2) + ':' + ('0' + temp_date_to.getSeconds()).slice(-2) + '.000Z';
*/
        for (var i = 0; i < dataset.datapoints.length; i++) {

            annotations.push(
                this.buildAnnotation(dataset.datapoints[i], i, dataset.maxValueOfY)
            );
        }
        return annotations;
    }

    buildAnnotation(datapoint, index, maxY) {
        var maxDate = new Date(datapoint["@timestamp"][0]);
        maxDate.setHours(maxDate.getHours() + 1);
        var color = this.randomRgba();


        return {
            drawTime: "beforeDatasetsDraw",
            type: "box",
            id: index.toString(),
            position: index,
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: new Date(datapoint["@timestamp"][0]),
            xMax: maxDate,
            yMin: 0,
            yMax: maxY,
            label: datapoint.UDC_code,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            onMousemove: function (e) {
                var tooltipEl = document.getElementById('chartjs-tooltip');

                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = "chartjs-tooltip";
                    tooltipEl.innerHTML = "<div style='background-color:red'></div>";
                    document.body.appendChild(tooltipEl);
                }

                var divRoot = tooltipEl.querySelector('div');
                divRoot.innerHTML = "CIAOO";

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