import csv
import redis
import json
from datetime import datetime
from dateutil import parser
from numba import jit
import time

r_client = redis.Redis(host='localhost', port=6379, db=0)

PLACE_CSV = "N:\\2022_place_canvas_history.csv"


def parse_row(row):
    timestamp = parser.parse(row[0]).timestamp()
    x, y = row[3].split(",")[:2]
    payload = {
        "user_id": row[1],
        "pixel_color": row[2],
        "x": x,
        "y": y
    }
    return timestamp, json.dumps(payload)

def main():
    with open(PLACE_CSV) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')

        print(csv_reader.__next__())

        # r_client.delete("pixels")
        # r_client.ts().create('pixels')
        # r_client.ts().add('pixels', 8888, json.dumps({"test": "test"}))


        row_num = 0
        buffer = {}
        last_insert = time.time()
        
        for row in csv_reader:
            row_num += 1

            timestamp, parsed = parse_row(row)

            buffer[parsed] = timestamp
            
            # json.dumps(payload): timestamp
            if row_num % 100000 == 0:
                print(f"{row_num} rows processed. Time: {time.time() - last_insert}")
                r_client.zadd("pixels", buffer)
                buffer = {}
                last_insert = time.time()

            


if __name__ == "__main__":
    main()