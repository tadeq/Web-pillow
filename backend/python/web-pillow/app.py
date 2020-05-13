import base64
import os

from PIL import Image, ImageEnhance, ImageFilter
from flask import Flask, request, jsonify

app = Flask(__name__)

filters = {'Blur': ImageFilter.BLUR,
           'Contour': ImageFilter.CONTOUR,
           'Detail': ImageFilter.DETAIL,
           'Edge enhance': ImageFilter.EDGE_ENHANCE,
           'Edge enhance more': ImageFilter.EDGE_ENHANCE_MORE,
           'Emboss': ImageFilter.EMBOSS,
           'Find edges': ImageFilter.FIND_EDGES,
           'Sharpen': ImageFilter.SHARPEN,
           'Smooth': ImageFilter.SMOOTH,
           'Smooth more': ImageFilter.SMOOTH_MORE}


@app.route('/enhance', methods=['PUT'])
def enhance_image():
    body = request.form
    image_name = body.get('filename')
    image_decoded = base64.b64decode(body.get('image'))
    color = body.get('color')
    contrast = body.get('contrast')
    brightness = body.get('brightness')
    sharpness = body.get('sharpness')
    image = open_image(image_decoded, image_name)
    color_enhanced_img = ImageEnhance.Color(image).enhance(color)
    contrast_enhanced_img = ImageEnhance.Contrast(color_enhanced_img).enhance(contrast)
    brightness_enhanced_img = ImageEnhance.Brightness(contrast_enhanced_img).enhance(brightness)
    sharpness_enhanced_img = ImageEnhance.Sharpness(brightness_enhanced_img).enhance(sharpness)
    os.remove(image_name)
    return jsonify(filename=image_name, image=base64.b64encode(sharpness_enhanced_img))


@app.route('/filter', methods=['PUT'])
def filter_image():
    body = request.form
    image_name = body.get('filename')
    image_decoded = base64.b64decode(body.get('image'))
    filter_name = body.get('filter')
    image = open_image(image_decoded, image_name)
    filtered_image = image.filter(filters[filter_name])
    os.remove(image_name)
    return jsonify(filename=image_name, image=base64.b64encode(filtered_image))


@app.route('/filter/all', methods=['GET'])
def get_all_filter_names():
    return jsonify(filters=list(filters.keys()))


def open_image(img_decoded, img_name):
    with open(img_name, 'wb') as img_file:
        img_file.write(img_decoded)
    return Image.open(img_name)


if __name__ == '__main__':
    app.run()
