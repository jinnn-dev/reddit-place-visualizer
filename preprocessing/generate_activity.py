import datetime

import ciso8601

PLACE_CSV = "N:\\reddit_place_sorted.csv"
OUT_FILE = "N:\\place_activity_stats.csv"
TIMEDELTA = datetime.timedelta(seconds=60)

COLOR_MAPPINGS = {'#6D001A': 0, '#BE0039': 1, '#FF4500': 2, '#FFA800': 3, '#FFD635': 4, '#FFF8B8': 5, '#00A368': 6,
                  '#00CC78': 7, '#7EED56': 8, '#00756F': 9, '#009EAA': 10, '#00CCC0': 11, '#2450A4': 12, '#3690EA': 13,
                  '#51E9F4': 14, '#493AC1': 15, '#6A5CFF': 16, '#94B3FF': 17, '#811E9F': 18, '#B44AC0': 19,
                  '#E4ABFF': 20, '#DE107F': 21, '#FF3881': 22, '#FF99AA': 23, '#6D482F': 24, '#9C6926': 25,
                  '#FFB470': 26, '#000000': 27, '#515252': 28, '#898D90': 29, '#D4D7D9': 30, '#FFFFFF': 31}


def main():
    row_num = 0
    curr_interval_row_start = 0
    curr_interval_start = None
    curr_interval_end = None
    curr_changes = {}

    # read file line by line and split into array
    with open(PLACE_CSV) as csv_file:
        csv_file.readline()  # Skip headline
        with open(OUT_FILE, 'wb') as out_file:

            # Write header to file
            out_file.write("line;interval_start;interval_end;changes_total;changes_by_color\n".encode('utf-8'))
            for line in csv_file:

                row_num += 1
                tmp = line.split(",")
                timestamp = ciso8601.parse_datetime(tmp[0].removesuffix(" UTC"))
                color = COLOR_MAPPINGS[tmp[2]]

                # if interval start is none, start new interval
                if curr_interval_start is None:
                    curr_interval_start = timestamp
                    curr_interval_end = timestamp + TIMEDELTA

                # if timestamp after interval end, save last interval and start new one
                elif timestamp > curr_interval_end:
                    total_changes = sum(curr_changes.values())
                    # save interval
                    out_file.write(
                        f"{curr_interval_row_start};{curr_interval_start};{curr_interval_end};{total_changes};{curr_changes}\n".encode(
                            'utf-8'))

                    # reset interval
                    curr_interval_start = curr_interval_end
                    curr_interval_end = curr_interval_start + TIMEDELTA
                    curr_changes = {}
                    curr_interval_row_start = row_num

                # increment counter for color, default is 0
                curr_changes[color] = curr_changes.get(color, 0) + 1

                # Print progress
                if row_num % 1e6 == 0:
                    print(f"{row_num / 1e6}M rows processed")


if __name__ == "__main__":
    main()
