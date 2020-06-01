import {createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
    overrides: {
        MuiToggleButton: {
            root: {
                width: '39vw'
            },
        },
    },
});

export default (theme);