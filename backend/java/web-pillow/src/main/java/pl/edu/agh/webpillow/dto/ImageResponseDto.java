package pl.edu.agh.webpillow.dto;

public class ImageResponseDto {
    private String filename;
    private String image;

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
