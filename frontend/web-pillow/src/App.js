import React from 'react';
import {Typography, Slider, Button} from '@material-ui/core';
import './App.css';
import api from "./api";


class App extends React.Component {

    state = {
        filename: undefined,
        originalImage: undefined,
        editedImage: undefined,
        brightnessSliderValue: 1.0,
        colorSliderValue: 1.0,
        contrastSliderValue: 1.0,
        sharpnessSliderValue: 1.0,
        filter: undefined,
    };

    handleImageLoaded = event => {
        const image = event.target.files[0];
        console.log(image);
        this.setState({
            filename: image.name,
            originalImage: URL.createObjectURL(image),
            editedImage: URL.createObjectURL(image)
        })
    };

    handleImageRemoved = () => {
        this.setState({
            filename: undefined,
            originalImage: undefined,
            editedImage: undefined,
            brightnessSliderValue: 1.0,
            colorSliderValue: 1.0,
            contrastSliderValue: 1.0,
            sharpnessSliderValue: 1.0,
            filter: undefined,
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
        document.body.style.cursor = 'wait';
        this.toBase64(this.state.editedImage, (encodedImage) => {
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
                    console.log(response);
                    const byteCharacters = atob(response.image);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], {type: 'image/png'});
                    this.setState({
                        editedImage: URL.createObjectURL(blob)
                    }, () => {
                        document.body.style.cursor = 'default';
                    });
                }
            )
        });
    };

    handleBrightnessSliderValueChange = (event) => {
        this.setState({
            brightnessSliderValue: parseFloat(event.target.textContent)
        }, this.enhanceImage)
    };

    handleColorSliderValueChange = (event) => {
        this.setState({
            colorSliderValue: parseFloat(event.target.textContent)
        }, this.enhanceImage)
    };

    handleContrastSliderValueChange = (event) => {
        this.setState({
            contrastSliderValue: parseFloat(event.target.textContent)
        }, this.enhanceImage)
    };

    handleSharpnessSliderValueChange = (event) => {
        this.setState({
            sharpnessSliderValue: parseFloat(event.target.textContent)
        }, this.enhanceImage)
    };


    render() {
        return (
            <div className='App'>
                <input type='file' onChange={this.handleImageLoaded}/><br/>
                <img src={this.state.editedImage} alt=''/>
                <Typography id="brightness-slider" gutterBottom>
                    Brightness
                </Typography>
                <Slider
                    defaultValue={this.state.brightnessSliderValue}
                    aria-labelledby="brightness-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    min={0}
                    max={4}
                    onChange={this.handleBrightnessSliderValueChange}
                />
                <Typography id="color-slider" gutterBottom>
                    Color
                </Typography>
                <Slider
                    defaultValue={this.state.colorSliderValue}
                    aria-labelledby="color-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    min={0}
                    max={4}
                    onChange={this.handleColorSliderValueChange}
                />
                <Typography id="contrast-slider" gutterBottom>
                    Contrast
                </Typography>
                <Slider
                    defaultValue={this.state.contrastSliderValue}
                    aria-labelledby="contrast-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    min={0}
                    max={4}
                    onChange={this.handleContrastSliderValueChange}
                />
                <Typography id="sharpness-slider" gutterBottom>
                    Sharpness
                </Typography>
                <Slider
                    defaultValue={this.state.sharpnessSliderValue}
                    aria-labelledby="sharpness-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    min={0}
                    max={4}
                    onChange={this.handleSharpnessSliderValueChange}
                />
            </div>
        )
    }
}


export default App;
