package pl.edu.agh.webpillow.dto;

public class ImageEnhanceDto {
    private String filename;
    private String image;
    private double color;
    private double contrast;
    private double brightness;
    private double sharpness;

    public ImageEnhanceDto(String filename, String image, double color, double contrast, double brightness, double sharpness) {
        this.filename = filename;
        this.image = image;
        this.color = color;
        this.contrast = contrast;
        this.brightness = brightness;
        this.sharpness = sharpness;
    }
}
