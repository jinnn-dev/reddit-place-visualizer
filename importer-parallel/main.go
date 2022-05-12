package main

import (
	"bufio"
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"io"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

func main() {
	runParallel()
}

func parallelSlow() {
	start := time.Now()
	csvfile, err := os.Open("E:/archive/2022_place_canvas_history.csv")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer csvfile.Close()

	reader := csv.NewReader(csvfile)

	i := 0
	ch := make(chan []string)
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			fmt.Println(err)
			return
		}
		i++

		go func(r []string) {
			processData(r)
			ch <- r
		}(record)

		fmt.Printf("go %d %s\n", i, record)
	}
	for ; i >= 0; i-- {
		fmt.Printf("<- %d %s\n", i, <-ch)
	}

	fmt.Printf("\n%2fs", time.Since(start).Seconds())
}

func processData(r []string) {

}

type Entry struct {
	UserId     string `json:"user_id"`
	PixelColor string `json:"pixel_color"`
}

const mb = 1024 * 1024

const gb = 1024 * mb

const file = "E:/archive/canvas.csv"

func runParallel() {

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	var ctx = context.Background()

	wg := sync.WaitGroup{}

	channel := make(chan string)

	done := make(chan bool, 1)

	rows := 0

	go func() {
		count := 0

		last_insert := time.Now()
		buffer := make([]*redis.Z, 1e5)

		for row := range channel {

			//println(row)

			splitRow := strings.Split(row, ",")
			timestamp, _ := time.Parse("2006-02-01 15:04:05 UTC", splitRow[0])
			//println(timestamp.String(), user, color, splitRow[3:])

			entry := &Entry{
				UserId:     splitRow[1],
				PixelColor: splitRow[2],
			}

			b, err := json.Marshal(entry)

			if err != nil {
				log.Fatal(err)
			}

			buffer = append(buffer, &redis.Z{
				Score:  float64(timestamp.UTC().UnixNano() / 1000000),
				Member: string(b),
			})

			//if rowLen < maxElements {
			//	println(rowLen, maxElements)
			//}
			//
			//if rowLen > maxElements {
			//	maxElements = rowLen
			//}
			if count == 1e5 {

				err := rdb.ZAdd(ctx, "mypixels", buffer...).Err()
				if err != nil {
					log.Fatal(err)
				}
				buffer = make([]*redis.Z, 1e5)
				fmt.Printf("%d million rows processed in %d milliseconds \n", count/1e5, time.Since(last_insert)/time.Millisecond)
				last_insert = time.Now()
			}
			count++
			rows++
		}
		done <- true
	}()

	var current int64

	var limit int64 = 100 * mb

	for i := 0; i < 10; i++ {
		wg.Add(1)

		go func(idx, position int64) {
			read(position, limit, file, channel)
			fmt.Printf("%d thread has been completed\n", idx)

			wg.Done()
		}(int64(i), current)

		// Increment the current by 1+(last byte read by previous thread).
		current += limit + 1
	}
	wg.Wait()
	close(channel)

	<-done
	close(done)
	fmt.Printf("Rows: %d\n", rows)

}

func read(offset int64, limit int64, fileName string, channel chan string) {

	file, err := os.Open(fileName)

	defer file.Close()

	if err != nil {
		panic(err)
	}

	file.Seek(offset, 0)
	reader := bufio.NewReader(file)

	if offset != 0 {
		_, err = reader.ReadBytes('\n')
		if err == io.EOF {
			fmt.Printf("EOF")
			return
		}

		if err != nil {
			panic(err)
		}
	}

	var cumulativeSize int64
	for {
		// Break if read size has exceed the chunk size.
		if cumulativeSize > limit {
			break
		}

		b, err := reader.ReadBytes('\n')

		// Break if end of file is encountered.
		if err == io.EOF {
			break
		}

		if err != nil {
			panic(err)
		}

		cumulativeSize += int64(len(b))
		s := strings.TrimSpace(string(b))
		if s != "" {
			// Send the read word in the channel to enter into dictionary.
			channel <- s
		}
	}
}
