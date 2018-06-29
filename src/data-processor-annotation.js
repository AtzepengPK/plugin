export class DataProcessorAnnotation {
    constructor(dataset,panel) {
        this.panel = panel;
        this.dataset = dataset;
    }

    transform() {
        var annotations = [];
        for (var i = 0; i < this.dataset.datapoints.length; i++) {
            annotations.push(
                this.buildAnnotation(this.dataset.datapoints[i], i, this.dataset.maxValueOfY)
            );
        }
        return annotations;
    }

    buildAnnotation(datapoint, index, maxY) {

        var maxDate = new Date(datapoint["@timestamp"][0]);
        maxDate.setHours(maxDate.getHours() + 1);

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
            backgroundColor: ["rgba(101, 33, 171, 0.5)"],
            borderColor: ["rgb(101, 33, 171)"],
            borderWidth: 1,
            onMousemove: function (e) {
                var tooltipEl = document.getElementById(this.panel.tooltip.containerId);

                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = this.panel.tooltip.containerId;
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