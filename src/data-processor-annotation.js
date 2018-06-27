export class DataProcessorAnnotation {
    constructor(dataset) {
        this.dataset = dataset;
        this.annotationStructure = {
            drawTime: "beforeDatasetsDraw",
            type: "box",
            id: '0',
            position: '0',
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: 0,
            xMax: 0,
            yMin: 0,
            yMax: 0,
            label: "default",
            backgroundColor: ["rgba(101, 33, 171, 0.5)"],
            borderColor: ["rgb(101, 33, 171)"],
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

    transform() {
        console.log(this.dataset);
        var annotations = [];
        for (var i = 0; i < this.dataset.length; i++) {
            annotations.push(
                this.buildAnnotation(this.dataset[i].datapoints)
            );
        }
        return annotations;
    }

    buildAnnotation(datapoints) {
        var data = []
        for (var i = 0; i < datapoints.length; i++) {
            console.log(datapoints[i])
            data.push(this.annotationStructure);
        }
        return data;
    }
}