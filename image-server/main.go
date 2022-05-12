package main

import (
	"bytes"
	"context"
	"image"
	"image/color"
	"image/png"
	"log"
	"net/url"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	fiber "github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type response struct {
	UserId string   `json:"userId"`
	Pixels []string `json:"pixels"`
}

func main() {
	var data [16000000]int

	for i := 0; i < len(data); i++ {
		data[i] = 234
	}

	redisContext := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	app := fiber.New()
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
	})

	app.Get("/image", func(ctx *fiber.Ctx) error {
		return ctx.Send(GenerateImage().Bytes())
	})

	app.Get("/user/ranking/:from/:to", func(ctx *fiber.Ctx) error {
		fromString, fromQueryErr := url.QueryUnescape(ctx.Params("from"))
		fromAmount, fromParseErr := strconv.Atoi(fromString)

		toString, toQueryErr := url.QueryUnescape(ctx.Params("to"))
		toAmount, toParseErr := strconv.Atoi(toString)

		if fromQueryErr != nil || fromParseErr != nil || toQueryErr != nil || toParseErr != nil {
			return fiber.NewError(fiber.StatusBadRequest, "malformed query params")
		}

		result, err := rdb.ZRevRangeWithScores(redisContext, "Ranking", int64(fromAmount), int64(toAmount)).Result()

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		if fromAmount > toAmount {
			return fiber.NewError(fiber.StatusBadRequest, "from must be smaller than to")
		}

		type UserScore struct {
			UserId string  `json:"userId"`
			Amount float64 `json:"amount"`
		}

		var userRanking []UserScore

		for _, item := range result {
			userRanking = append(userRanking, UserScore{
				UserId: item.Member.(string),
				Amount: item.Score,
			})
		}

		return ctx.JSON(userRanking)
	})

	app.Get("/user/random", func(ctx *fiber.Ctx) error {
		random, _ := rdb.RandomKey(redisContext).Result()
		data, _ := rdb.LRange(redisContext, random, 0, -1).Result()
		res := response{
			UserId: random,
			Pixels: data,
		}
		return ctx.JSON(res)
	})

	app.Get("/user/:id", func(ctx *fiber.Ctx) error {

		id, _ := url.QueryUnescape(ctx.Params("id"))

		data, _ := rdb.LRange(redisContext, id, 0, -1).Result()

		return ctx.JSON(data)
	})

	app.Get("/changes", func(ctx *fiber.Ctx) error {
		return ctx.JSON(data)
	})

	app.Listen(":4000")

}

func GenerateImage() *bytes.Buffer {

	start := time.Now()
	width := 2000
	height := 2000

	upLeft := image.Point{}
	lowRight := image.Point{X: width, Y: height}

	img := image.NewRGBA(image.Rectangle{Min: upLeft, Max: lowRight})
	//cyan := color.RGBA{100, 200, 200, 0xff}

	// Set color for each pixel.
	for x := 0; x < width; x++ {
		for y := 0; y < height; y++ {
			img.Set(x, y, color.RGBA{0, 0, 0, 1})
		}
	}
	log.Print(time.Since(start))

	buff := new(bytes.Buffer)
	err := png.Encode(buff, img)
	if err != nil {
		log.Fatalln(err)
	}
	log.Print(time.Since(start))
	return buff
}
