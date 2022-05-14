

# PLACE_CSV = "N:\\2022_place_canvas_history.csv"
PLACE_CSV = "E:\\archive\\reddit_place_sorted.csv"
OUT_FILE = "E:\\archive\\reddit_place_sorted_converted.csv"
CHUNK_SIZE = 500e3

# timestamp,user_id,pixel_color,coordinate
COLOR_MAPPINGS = {'#6D001A': 0, '#BE0039': 1, '#FF4500': 2, '#FFA800': 3, '#FFD635': 4, '#FFF8B8': 5, '#00A368': 6, '#00CC78': 7, '#7EED56': 8, '#00756F': 9, '#009EAA': 10, '#00CCC0': 11, '#2450A4': 12, '#3690EA': 13, '#51E9F4': 14, '#493AC1': 15, '#6A5CFF': 16, '#94B3FF': 17, '#811E9F': 18, '#B44AC0': 19, '#E4ABFF': 20, '#DE107F': 21, '#FF3881': 22, '#FF99AA': 23, '#6D482F': 24, '#9C6926': 25, '#FFB470': 26, '#000000': 27, '#515252': 28, '#898D90': 29, '#D4D7D9': 30, '#FFFFFF': 31 }

def main():
    row_num = 0
    # read file line by line and split into array
    with open(PLACE_CSV) as csv_file:
        csv_file.readline()  # Skip headline
        with open(OUT_FILE, 'wb') as out_file:
            for line in csv_file:
                row_num += 1
                tmp = line.split(",")
                x = tmp[3].removeprefix('"')
                y = tmp[4].rstrip('\n').removesuffix('"')
                color = COLOR_MAPPINGS[tmp[2]]
                out_file.write(f"{x},{y},{color}\n".encode('utf-8'))
                if row_num % CHUNK_SIZE == 0:
                    print(f"{row_num / 1e6}M rows converted")






if __name__ == "__main__":
    main()