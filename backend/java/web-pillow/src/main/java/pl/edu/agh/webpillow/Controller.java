package pl.edu.agh.webpillow;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.webpillow.dto.ImageEnhanceDto;
import pl.edu.agh.webpillow.dto.ImageFilterDto;

import java.io.IOException;

@RestController
@RequestMapping(value = "/")
public class Controller {

    private final PillowClient pillowClient;

    @Autowired
    public Controller(PillowClient pillowClient) {
        this.pillowClient = pillowClient;
    }

    @PutMapping(value = "enhance")
    public ResponseEntity<?> enhanceImage(@RequestBody ImageEnhanceDto imageEnhanceDto) {
        try {
            return ResponseEntity.ok(pillowClient.enhanceImage(imageEnhanceDto));
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping(value = "filter")
    public ResponseEntity<?> applyFilter(@RequestBody ImageFilterDto imageFilterDto) {
        try {
            return ResponseEntity.ok(pillowClient.applyFilter(imageFilterDto));
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "filter/all")
    public ResponseEntity<?> getAvailableFilters() {
        try {
            return ResponseEntity.ok(pillowClient.getAvailableFilters());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
