// https://github.com/joeweiss/peaks.js/blob/master/customizing.md


export default class SimplePointMarker {
    constructor(options, zoomview, overview) {
        // (required, see below)
        this._options = options;
        this._zoomview = zoomview;
        this._overview = overview;
    }

    init(group) {
        // (required, see below)
        this._group = group;
        this._line = new Konva.Line({
            x:           0,
            y:           0,
            stroke:      this._options.color,
            strokeWidth: 1
        });

        group.add(this._line);

        this.fitToView();
    }


    bindEventHandlers() {

        let container = this._zoomview;

        this._group.on('mouseenter', function() {
            container.style.cursor = 'move';
        });

        this._group.on('mouseleave', function() {
            container.style.cursor = 'default';
        });


    }

    fitToView() {
        let height = this._options.layer.getHeight();
        // this._line.points([0.5, 0, 0.5, height]);
        this._line.points([0, height*(1/3), 0, height * (2/3)]);
    }

    timeUpdated() {
        // (optional, see below)
    }

    destroy() {
        // (optional, see below)
        console.log("TODO: destroy");
    }
};

