import React from 'react';
import {
    Typography,
    Slider,
    Button,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import './App.css';
import api from './api';

const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];

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
        selectedFilter: undefined,
    };

    componentDidMount() {
        api.fetch(api.endpoints.getAvailableFilters(),
            (response) => this.setState({
                filters: ['No filter'].concat(response),
            }))
    }

    handleImageLoad = event => {
        const image = event.target.files[0];
        if (acceptedImageTypes.includes(image.type)) {
            this.setState({
                filename: image.name,
                originalImage: URL.createObjectURL(image),
                editedImage: URL.createObjectURL(image)
            })
        }
    };

    handleImageDownloadOrRemove = () => {
        this.setState({
            filename: undefined,
            originalImage: undefined,
            editedImage: undefined,
            brightnessSliderValue: 1.0,
            colorSliderValue: 1.0,
            contrastSliderValue: 1.0,
            sharpnessSliderValue: 1.0,
            filters: undefined,
            selectedFilter: undefined,
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
            return api.fetch(
                api.endpoints.enhanceImage(imageEnhanceDto),
                (response) => {
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
                }
            )
        });
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
        })
    };

    render() {
        return (
            <div className='App'>
                <Button variant='contained' component='label' startIcon={<SendIcon/>}
                        disabled={this.state.originalImage !== undefined}>
                    Upload File
                    <input hidden type='file' accept='.jpg,.jpeg,.png' onChange={this.handleImageLoad}/>
                </Button>
                <img src={this.state.editedImage} alt=''/>
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
                    disabled={this.state.originalImage === undefined}
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
                    disabled={this.state.originalImage === undefined}
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
                    disabled={this.state.originalImage === undefined}
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
                    disabled={this.state.originalImage === undefined}
                    onChangeCommitted={this.handleSharpnessSliderValueChange}
                />
                <Button variant='contained' color='primary' startIcon={<SaveIcon/>}
                        disabled={this.state.originalImage === undefined}>
                    Save image
                </Button>
                <Button variant='contained' color='secondary' startIcon={<DeleteIcon/>}
                        disabled={this.state.originalImage === undefined}>
                    Discard Changes
                </Button>
                <FormControl>
                    <FormLabel>Apply Filter</FormLabel>
                    <RadioGroup name='filter' control={this.state.selectedFilter} defaultValue={'No filter'}
                                onChange={this.handleFilterChange}>
                        {this.state.filters.map(filter => <FormControlLabel value={filter} key={filter}
                                                                            control={<Radio color='primary'/>}
                                                                            disabled={this.state.originalImage === undefined}
                                                                            label={filter}/>)}
                    </RadioGroup>
                </FormControl>
            </div>
        )
    }
}


export default App;
