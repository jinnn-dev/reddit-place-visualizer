package main

import (
	"context"
	"encoding/json"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/nitishm/go-rejson/v4"
	"log"
	"net/url"
	"strconv"
)

type response struct {
	UserId string   `json:"userId"`
	Pixels []string `json:"pixel"`
}

func main() {
	var data [16000000]int

	for i := 0; i < len(data); i++ {
		data[i] = 234
	}

	redisContext := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	rh := rejson.NewReJSONHandler()
	rh.SetGoRedisClient(rdb)

	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
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

		userId, err := rdb.ZRandMember(redisContext, "Ranking", 1, false).Result()
		data, _ := rdb.LRange(redisContext, userId[0], 0, -1).Result()

		if err != nil {
			log.Println(err)
			return ctx.SendStatus(500)
		}

		res := response{
			UserId: userId[0],
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

	app.Get("/pixel/:position", func(ctx *fiber.Ctx) error {

		position, _ := url.QueryUnescape(ctx.Params("position"))

		pixelData, err := rh.JSONGet(position, ".")

		if err != nil {
			log.Println(err)
			return ctx.SendStatus(400)
		}

		if err != nil {
			log.Println(err)
			return ctx.SendStatus(400)
		}

		var temp interface{}

		err = json.Unmarshal(pixelData.([]byte), &temp)
		if err != nil {
			log.Println(err)
			return ctx.SendStatus(500)
		}

		return ctx.JSON(temp)
	})

	err := app.Listen(":4000")
	if err != nil {
		log.Print(err)
		return
	}

}
