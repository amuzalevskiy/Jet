/**
 * Created by andrii.muzalevskyi on 20.08.2014.
 */
define(
    function () {

        return {
            layout: {
                raw: -1, // nothing to change
                none: -1,

                vraw: 0, // stack elements
                verticalRaw: 0,
                v: 1, // stack elements always use same width {display: table-row}
                vertical: 1,

                hraw: 2, // stack elements horizontally
                horizontalRaw: 2,
                h:3, // stack elements horizontally, always use same height {display: table-cell}
                horizontal: 3,

                flow: 4, // float: left
                flowLeft: 4,

                flowRight: 5 // float: right
            }
        };

    }
);