package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/go-redis/redis/v8"
	jsoniter "github.com/json-iterator/go"
)

type Entry struct {
	UserId     string `json:"_id"`
	PixelColor string `json:"pixel_color"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
}

func main() {

	ctx := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	file, err := os.Open("../../reddit_place_sorted.csv")
	if err != nil {
		log.Fatal(err)
	}

	parser := csv.NewReader(file)

	parser.Read()

	count := 0

	COLOR_MAPPINGS := map[string]int{"#6D001A": 0, "#BE0039": 1, "#FF4500": 2, "#FFA800": 3, "#FFD635": 4, "#FFF8B8": 5, "#00A368": 6, "#00CC78": 7, "#7EED56": 8, "#00756F": 9, "#009EAA": 10, "#00CCC0": 11, "#2450A4": 12, "#3690EA": 13, "#51E9F4": 14, "#493AC1": 15, "#6A5CFF": 16, "#94B3FF": 17, "#811E9F": 18, "#B44AC0": 19, "#E4ABFF": 20, "#DE107F": 21, "#FF3881": 22, "#FF99AA": 23, "#6D482F": 24, "#9C6926": 25, "#FFB470": 26, "#000000": 27, "#515252": 28, "#898D90": 29, "#D4D7D9": 30, "#FFFFFF": 31}

	allUsers := make(map[string][]interface{})

	for {
		record, err := parser.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		userId := record[1]

		coords := strings.Split(record[3], ",")[:2]

		x, _ := strconv.Atoi(coords[0])

		y, _ := strconv.Atoi(coords[1])

		if _, ok := allUsers[userId]; ok {
			allUsers[userId] = append(allUsers[userId], fmt.Sprintf("%d,%d,%d", x, y, COLOR_MAPPINGS[record[2]]))
		} else {
			allUsers[userId] = append(allUsers[userId], fmt.Sprintf("%d,%d,%d", x, y, COLOR_MAPPINGS[record[2]]))
		}

		count++

		if count%500000 == 0 {

			fmt.Println(count)

		}
	}
	for key, value := range allUsers {
		rdb.RPush(ctx, key, value)
	}

}

func WriteObjectToFile(object interface{}, filename string) {
	file, _ := os.OpenFile(filename, os.O_CREATE|os.O_WRONLY, os.ModePerm)
	defer file.Close()

	encoder := jsoniter.NewEncoder(file)
	encoder.Encode(object)
}
