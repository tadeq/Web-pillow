package pl.edu.agh.webpillow.dto;

public class ImageFilterDto {
    private String filename;
    private String image;
    private String filter;

    public ImageFilterDto(String filename, String image, String filter) {
        this.filename = filename;
        this.image = image;
        this.filter = filter;
    }
}
