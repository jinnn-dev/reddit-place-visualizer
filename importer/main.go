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
	"time"

	goredis "github.com/go-redis/redis/v8"
	rejson "github.com/nitishm/go-rejson/v4"
)

type Entry struct {
	T int `json:"t"`
	C int `json:"c"`
	X int `json:"x"`
	Y int `json:"y"`
}

var COLOR_MAPPINGS = map[string]int{"#6D001A": 0, "#BE0039": 1, "#FF4500": 2, "#FFA800": 3, "#FFD635": 4, "#FFF8B8": 5, "#00A368": 6, "#00CC78": 7, "#7EED56": 8, "#00756F": 9, "#009EAA": 10, "#00CCC0": 11, "#2450A4": 12, "#3690EA": 13, "#51E9F4": 14, "#493AC1": 15, "#6A5CFF": 16, "#94B3FF": 17, "#811E9F": 18, "#B44AC0": 19, "#E4ABFF": 20, "#DE107F": 21, "#FF3881": 22, "#FF99AA": 23, "#6D482F": 24, "#9C6926": 25, "#FFB470": 26, "#000000": 27, "#515252": 28, "#898D90": 29, "#D4D7D9": 30, "#FFFFFF": 31}

func main() {

	ctx := context.Background()

	rdb := goredis.NewClient(&goredis.Options{
		Addr:     "127.0.0.1:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	// ImportUserDate(rdb, &ctx)
	// ImportUserRanking(rdb, &ctx)
	importPixelData(rdb, &ctx)

}

func ImportUserDate(rdb *goredis.Client, ctx *context.Context) {
	file, err := os.Open("../../reddit_place_sorted.csv")
	if err != nil {
		log.Fatal(err)
	}

	parser := csv.NewReader(file)

	parser.Read()

	count := 0

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

		timestamp, _ := time.Parse("2006-02-01 15:04:05 UTC", record[0])

		allUsers[userId] = append(allUsers[userId], fmt.Sprintf("%d,%d,%d,%d", x, y, COLOR_MAPPINGS[record[2]], int(timestamp.UTC().UnixNano()/1000000)))

		count++

		if count%500000 == 0 {

			fmt.Println(count)

		}
	}
	count = 0
	for key, value := range allUsers {
		rdb.RPush(*ctx, key, value)
	}
}

func ImportUserRanking(rdb *goredis.Client, ctx *context.Context) {
	file, err := os.Open("E:/archive/reddit_place_sorted_user.csv")

	log.Println(rdb.Ping(*ctx))

	if err != nil {
		log.Fatal(err)
	}

	parser := csv.NewReader(file)

	var userRanking []*goredis.Z

	for {
		record, err := parser.Read()

		if err == io.EOF {
			break
		}

		if err != nil {
			log.Fatal(err)
		}

		userId := record[0]
		score, _ := strconv.Atoi(record[1])

		userRanking = append(userRanking, &goredis.Z{Member: userId, Score: float64(score)})
	}

	log.Println(len(userRanking))

	chunks := chunkSlice(userRanking, 100000)

	for _, chunk := range chunks {
		res, err := rdb.ZAdd(*ctx, "Ranking", chunk...).Result()

		if err != nil {
			log.Fatal(err)
		}

		log.Println(res)
	}

}

func chunkSlice(slice []*goredis.Z, chunkSize int) [][]*goredis.Z {
	var chunks [][]*goredis.Z
	for {
		if len(slice) == 0 {
			break
		}

		if len(slice) < chunkSize {
			chunkSize = len(slice)
		}

		chunks = append(chunks, slice[0:chunkSize])
		slice = slice[chunkSize:]
	}

	return chunks
}

func importPixelData(rdb *goredis.Client, ctx *context.Context) {

	rh := rejson.NewReJSONHandler()

	rh.SetGoRedisClient(rdb)

	file, err := os.Open("../../reddit_place_sorted.csv")

	if err != nil {
		log.Fatal(err)
	}

	parser := csv.NewReader(file)

	pixelData := make(map[string]map[string]int)

	count := 0

	for {
		record, err := parser.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		coords := strings.Split(record[3], ",")[:2]

		x, _ := strconv.Atoi(coords[0])

		y, _ := strconv.Atoi(coords[1])

		color := COLOR_MAPPINGS[record[2]]
		colorKey := fmt.Sprintf("%d", color)

		key := fmt.Sprintf("%d_%d", x, y)

		if _, ok := pixelData[key]; ok {
			if _, ok := pixelData[key][colorKey]; ok {
				pixelData[key]["changes"] += 1
				var colorCount int = pixelData[key][colorKey]
				pixelData[key][colorKey] = colorCount + 1
			} else {
				pixelData[key]["changes"] += 1
				pixelData[key][colorKey] = 1
			}
		} else {
			pixelData[key] = map[string]int{
				"changes": 1,
				colorKey:  1,
			}
		}

		count++

		if count%500000 == 0 {

			fmt.Println(count)
		}
	}

	fmt.Println(len(pixelData))

	for key, value := range pixelData {
		rh.JSONSet(key, ".", value)
	}

}
