define(
    [
        './Jet',

        './ViewBuilder/ClassEditor',
        './ViewBuilder/ClassViewer',
        './ViewBuilder/Table',

        // just load views, them will be automatically registered into theme
        './View/Property/Viewer',
        './View/Property/Editor/Text',
        './View/Property/Editor/Number',
        './View/Property/Editor/Date'
    ],
    function (Jet, ClassEditor, ClassViewer, Table) {
        // initialize standard renderers

        // form elements

        // StdClass renderers
        Jet.baseTheme.addBuilders(
            [
                'Jet/StdClass'
            ], {
                edit: new ClassEditor(),
                view: new ClassViewer()
            }
        );

        return Jet;
    }
);