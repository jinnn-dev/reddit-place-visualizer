package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
)

type Entry struct {
	UserId     string `json:"user_id"`
	PixelColor string `json:"pixel_color"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
}

func main() {

	var ctx = context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	file, err := os.Open("../2022_place_canvas_history.csv")
	if err != nil {
		log.Fatal(err)
	}

	parser := csv.NewReader(file)

	parser.Read()

	buffer := make([]*redis.Z, 0)

	count := 0

	last_insert := time.Now()

	for {
		record, err := parser.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		count++

		timestamp, _ := time.Parse("2006-02-01 15:04:05 UTC", record[0])

		coords := strings.Split(record[3], ",")[:2]

		x, _ := strconv.Atoi(coords[0])

		y, _ := strconv.Atoi(coords[1])

		entry := &Entry{
			UserId:     record[1],
			PixelColor: record[2],
			X:          x,
			Y:          y,
		}

		b, err := json.Marshal(entry)

		if err != nil {
			log.Fatal(err)
		}

		buffer = append(buffer, &redis.Z{
			Score:  float64(timestamp.UTC().UnixNano() / 1000000),
			Member: string(b),
		})

		if count%500000 == 0 {
			err := rdb.ZAdd(ctx, "newpixels", buffer...).Err()
			if err != nil {
				log.Fatal(err)
			}
			buffer = make([]*redis.Z, 0)
			fmt.Printf("%d million rows processed in %d milliseconds \n", count/1000000, time.Since(last_insert)/time.Millisecond)

			last_insert = time.Now()
		}

	}
}
