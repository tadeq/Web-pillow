import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Slider,
    Typography,
} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import FilterIcon from '@material-ui/icons/Filter';
import PaletteIcon from '@material-ui/icons/Palette';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import {ThemeProvider, withStyles} from '@material-ui/core/styles';
import './App.css';
import api from './api';
import styles from './styles';
import theme from './muiThemes';


const ACCEPTED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];
const NO_FILTER = 'No filter';
const MODIFICATION_ENHANCE = 'enhance';
const MODIFICATION_FILTER = 'filter';

class App extends React.Component {

    state = {
        filename: undefined,
        originalImage: undefined,
        editedImage: undefined,
        brightnessSliderValue: 1.0,
        colorSliderValue: 1.0,
        contrastSliderValue: 1.0,
        sharpnessSliderValue: 1.0,
        filters: [],
        selectedFilter: NO_FILTER,
        discardDialogOpen: false,
        downloadDialogOpen: false,
        modificationType: MODIFICATION_ENHANCE,
        compareClicked: false,
    };

    componentDidMount() {
        api.fetch(api.endpoints.getAvailableFilters(),
            (response) => this.setState({
                filters: [NO_FILTER].concat(response),
            }))
    }

    handleImageLoad = event => {
        const image = event.target.files[0];
        if (image !== undefined && ACCEPTED_IMAGE_TYPES.includes(image.type)) {
            this.setState({
                filename: image.name,
                originalImage: URL.createObjectURL(image),
                editedImage: URL.createObjectURL(image)
            })
        }
    };

    handleDownloadDialogOpen = () => {
        this.setState({
            downloadDialogOpen: true,
        })
    };

    downloadImage = () => {
        const link = document.createElement('a');
        link.href = this.state.editedImage;
        link.setAttribute('download', this.state.filename);
        document.body.appendChild(link);
        link.click();
    };

    handleDownloadDialogCloseAndPreserveImage = () => {
        this.downloadImage();
        this.setState({
            downloadDialogOpen: false,
        });
    };

    handleDownloadDialogClose = () => {
        this.downloadImage();
        this.resetState();
    };

    handleDiscardDialogOpen = () => {
        this.setState({
            discardDialogOpen: true,
        })
    };

    handleDiscardDialogClose = () => {
        this.setState({
            discardDialogOpen: false,
        })
    };

    resetState = () => {
        document.getElementById('img_input').value = '';
        this.setState({
            filename: undefined,
            originalImage: undefined,
            editedImage: undefined,
            brightnessSliderValue: 1.0,
            colorSliderValue: 1.0,
            contrastSliderValue: 1.0,
            sharpnessSliderValue: 1.0,
            selectedFilter: NO_FILTER,
            discardDialogOpen: false,
            downloadDialogOpen: false,
            modificationType: MODIFICATION_ENHANCE,
            compareClicked: false,
        })
    };

    toBase64 = (imageUrl, callback) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', imageUrl);
        xhr.responseType = 'blob';
        xhr.send();
    };

    handleModificationEnhanceSelect = () => {
        this.setState({
            modificationType: MODIFICATION_ENHANCE
        }, this.enhanceImage)
    };

    handleModificationFilterSelect = () => {
        this.setState({
            modificationType: MODIFICATION_FILTER
        }, this.applyFilter)
    };

    handleBrightnessSliderValueChange = (event) => {
        const sliderValue = parseFloat(event.target.textContent);
        if (!isNaN(sliderValue)) {
            this.setState({
                brightnessSliderValue: sliderValue
            }, this.enhanceImage)
        }
    };

    handleColorSliderValueChange = (event) => {
        const sliderValue = parseFloat(event.target.textContent);
        if (!isNaN(sliderValue)) {
            this.setState({
                colorSliderValue: sliderValue
            }, this.enhanceImage)
        }
    };

    handleContrastSliderValueChange = (event) => {
        const sliderValue = parseFloat(event.target.textContent);
        if (!isNaN(sliderValue)) {
            this.setState({
                contrastSliderValue: sliderValue
            }, this.enhanceImage)
        }
    };

    handleSharpnessSliderValueChange = (event) => {
        const sliderValue = parseFloat(event.target.textContent);
        if (!isNaN(sliderValue)) {
            this.setState({
                sharpnessSliderValue: sliderValue
            }, this.enhanceImage)
        }
    };

    handleFilterChange = event => {
        this.setState({
            selectedFilter: event.target.value,
        }, this.applyFilter)
    };

    enhanceImage = () => {
        this.toBase64(this.state.originalImage, (encodedImage) => {
            const imageEnhanceDto = {
                filename: this.state.filename,
                image: encodedImage,
                brightness: this.state.brightnessSliderValue,
                color: this.state.colorSliderValue,
                contrast: this.state.contrastSliderValue,
                sharpness: this.state.sharpnessSliderValue,
            };
            return api.fetch(api.endpoints.enhanceImage(imageEnhanceDto), this.setEditedImageFromResponse)
        });
    };

    applyFilter = () => {
        if (this.state.selectedFilter === NO_FILTER) {
            this.setState({
                editedImage: this.state.originalImage,
            })
        } else {
            this.toBase64(this.state.originalImage, (encodedImage) => {
                const imageFilterDto = {
                    filename: this.state.filename,
                    image: encodedImage,
                    filter: this.state.selectedFilter,
                };
                return api.fetch(api.endpoints.applyFilter(imageFilterDto), this.setEditedImageFromResponse)
            });
        }
    };

    setEditedImageFromResponse = (response) => {
        const byteCharacters = atob(response.image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: `image/${this.state.filename.split('.').slice(-1)[0]}`});
        this.setState({
            editedImage: URL.createObjectURL(blob)
        });
    };

    handleCompareButtonClick = () => {
        this.setState({
            compareClicked: true,
        })
    };

    handleCompareButtonRelease = () => {
        this.setState({
            compareClicked: false,
        })
    };

    mapToGridItem = (filterName) => {
        return (
            <Grid item xs={6}>
                <FormControlLabel value={filterName}
                                  key={filterName}
                                  control={<Radio color='primary'/>}
                                  disabled={this.state.originalImage === undefined || this.state.modificationType !== MODIFICATION_FILTER}
                                  label={filterName}/>
            </Grid>
        )
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.body}>
                <div className={classes.image_box}>
                    <img className={classes.image}
                         src={this.state.compareClicked ? this.state.originalImage : this.state.editedImage} alt=''/>
                </div>
                <div className={classes.top_buttons_box}>
                    <Button className={classes.top_button} variant='contained' component='label' startIcon={<SendIcon/>}
                            disabled={this.state.originalImage !== undefined}>
                        Upload File
                        <input id='img_input' hidden type='file' accept='.jpg,.jpeg,.png'
                               onChange={this.handleImageLoad}/>
                    </Button>
                    <Button className={classes.top_button} variant='contained' color='primary' startIcon={<SaveIcon/>}
                            disabled={this.state.originalImage === undefined} onClick={this.handleDownloadDialogOpen}>
                        Save image
                    </Button>
                    <Dialog open={this.state.downloadDialogOpen}
                            onClose={this.handleDownloadDialogCloseAndPreserveImage}>
                        <DialogTitle>Download image</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to keep the image in the editor?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleDownloadDialogCloseAndPreserveImage} color='primary'>
                                Yes
                            </Button>
                            <Button onClick={this.handleDownloadDialogClose} color='primary'>
                                No
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button className={classes.top_button} variant='contained' color='secondary'
                            startIcon={<DeleteIcon/>}
                            disabled={this.state.originalImage === undefined} onClick={this.handleDiscardDialogOpen}>
                        Discard Changes
                    </Button>
                    <Dialog open={this.state.discardDialogOpen} onClose={this.handleDiscardDialogClose}>
                        <DialogTitle>Discard changes</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to discard all changes?<br/>
                                The image will be removed from editor.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.resetState} color='primary'>
                                Yes
                            </Button>
                            <Button onClick={this.handleDiscardDialogClose} color='primary'>
                                No
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button className={classes.top_button} variant='contained' startIcon={<RemoveRedEyeIcon/>}
                            disabled={this.state.originalImage === undefined}
                            onMouseDown={this.handleCompareButtonClick}
                            onMouseUp={this.handleCompareButtonRelease}>
                        Show original
                    </Button>
                </div>
                <div className={classes.modification_buttons_box}>
                    <ToggleButtonGroup value={this.state.modificationType} exclusive>
                        <ThemeProvider theme={theme}>
                            <ToggleButton value={MODIFICATION_ENHANCE} onClick={this.handleModificationEnhanceSelect}
                                          selected={this.state.modificationType === MODIFICATION_ENHANCE}
                                          disabled={this.state.originalImage === undefined}>
                                <PaletteIcon className={classes.modification_icon}/>Enhance
                            </ToggleButton>
                            <ToggleButton value={MODIFICATION_FILTER} onClick={this.handleModificationFilterSelect}
                                          selected={this.state.modificationType === MODIFICATION_FILTER}
                                          disabled={this.state.originalImage === undefined}>
                                <FilterIcon className={classes.modification_icon}/>Filter
                            </ToggleButton>
                        </ThemeProvider>
                    </ToggleButtonGroup>
                </div>
                <div className={classes.sliders_box}>
                    <Typography id='brightness-slider' align='left' gutterBottom>
                        Brightness
                    </Typography>
                    <Slider
                        defaultValue={1.0}
                        control={this.state.brightnessSliderValue}
                        valueLabelDisplay='auto'
                        step={0.1}
                        min={0}
                        max={5}
                        disabled={this.state.originalImage === undefined || this.state.modificationType !== MODIFICATION_ENHANCE}
                        onChangeCommitted={this.handleBrightnessSliderValueChange}
                    />
                    <Typography id='color-slider' align='left' gutterBottom>
                        Color
                    </Typography>
                    <Slider
                        defaultValue={1.0}
                        control={this.state.colorSliderValue}
                        valueLabelDisplay='auto'
                        step={0.1}
                        min={0}
                        max={5}
                        disabled={this.state.originalImage === undefined || this.state.modificationType !== MODIFICATION_ENHANCE}
                        onChangeCommitted={this.handleColorSliderValueChange}
                    />
                    <Typography id='contrast-slider' align='left' gutterBottom>
                        Contrast
                    </Typography>
                    <Slider
                        defaultValue={1.0}
                        control={this.state.contrastSliderValue}
                        valueLabelDisplay='auto'
                        step={0.1}
                        min={0}
                        max={5}
                        disabled={this.state.originalImage === undefined || this.state.modificationType !== MODIFICATION_ENHANCE}
                        onChangeCommitted={this.handleContrastSliderValueChange}
                    />
                    <Typography id='sharpness-slider' align='left' gutterBottom>
                        Sharpness
                    </Typography>
                    <Slider
                        defaultValue={1.0}
                        control={this.state.sharpnessSliderValue}
                        valueLabelDisplay='auto'
                        step={0.1}
                        min={0}
                        max={5}
                        disabled={this.state.originalImage === undefined || this.state.modificationType !== MODIFICATION_ENHANCE}
                        onChangeCommitted={this.handleSharpnessSliderValueChange}
                    />
                </div>
                <FormControl className={classes.filtersForm}>
                    <RadioGroup name={MODIFICATION_FILTER} control={this.state.selectedFilter} defaultValue={NO_FILTER}
                                onChange={this.handleFilterChange}>
                        <Grid container>
                            {this.state.filters.map(this.mapToGridItem)}
                        </Grid>
                    </RadioGroup>
                </FormControl>
            </div>
        )
    }
}

export default withStyles(styles)(App);