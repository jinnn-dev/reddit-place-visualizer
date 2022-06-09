from typing import List, Tuple

import numpy as np
from PIL import Image


def color_counts(image: str) -> None:
    im = Image.open(image)

    black = 0
    white = 0
    remaining = 0

    for pixel in im.getdata():
        if pixel == (0, 0, 0, 255):
            black += 1
        elif pixel == (255, 255, 255, 255):
            white += 1
        else:
            remaining += 1
    print(f"Result for {image}:")
    print(f"black={black}, white={white}, remaining={remaining}, sum={black + white + remaining}")


def color_coordinates(image: str, color: Tuple[int, int, int]) -> List[Tuple[int, int]]:
    image = Image.open(image).convert('RGB')
    width = image.width
    found_pixels = [i for i, pixel in enumerate(image.getdata()) if pixel == color]
    return [divmod(index, width) for index in found_pixels]


if __name__ == '__main__':
    color_counts('canvas_4.png')
    coordinates = color_coordinates('canvas_4.png', (0, 0, 0))
    parsed_coordinates = [[coord[0], coord[1]]for coord in coordinates]
    print(parsed_coordinates)
