// https://github.com/joeweiss/peaks.js/blob/master/customizing.md


export default class CustomPointMarker {
    constructor(options, zoomview, overview) {
        // (required, see below)
        this._options = options;
        this._zoomview = zoomview;
        this._overview = overview;
    }

    init(group) {
        // (required, see below)
        this._group = group;
        this._label = new Konva.Label({
            x: 0.5,
            y: 0.5
        });

        this._tag = new Konva.Tag({
            fill:             this._options.color,
            stroke:           this._options.color,
            strokeWidth:      1,
            pointerDirection: 'down',
            pointerWidth:     10,
            pointerHeight:    10,
            lineJoin:         'round',
            shadowColor:      'black',
            shadowBlur:       10,
            shadowOffsetX:    3,
            shadowOffsetY:    3,
            shadowOpacity:    0.3
        });

        this._label.add(this._tag);

        this._text = new Konva.Text({
            text:       this._options.point.labelText,
            fontFamily: 'Calibri',
            fontSize:   14,
            padding:    5,
            fill:       'white'
        });

        this._label.add(this._text);

        // Vertical Line - create with default y and points, the real values
        // are set in fitToView().
        this._line = new Konva.Line({
            x:           0,
            y:           0,
            stroke:      this._options.color,
            strokeWidth: 1
        });

        group.add(this._label);
        group.add(this._line);

        this.fitToView();

        this.bindEventHandlers();
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
        // (required, see below)
        let height = this._options.layer.getHeight();

        let labelHeight = this._text.height() + 2 * this._text.padding();
        let offsetTop = 14;
        let offsetBottom = 26;

        this._group.y(offsetTop + labelHeight + 0.5);
        this._line.points([0.5, 0, 0.5, height - labelHeight - offsetTop - offsetBottom]);
    }

    timeUpdated() {
        // (optional, see below)
    }

    destroy() {
        // (optional, see below)
    }
}


