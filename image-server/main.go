package main

import (
	"bytes"
	"github.com/gofiber/fiber/v2"
	"image"
	"image/color"
	"image/png"
	"log"
	"time"
)

func main() {

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
	})

	app.Get("/image", func(ctx *fiber.Ctx) error {
		return ctx.Send(GenerateImage().Bytes())
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
